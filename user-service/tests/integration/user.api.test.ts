import request from 'supertest';
import { createApp } from '../../src/app';
import { signToken } from '../../src/utils/jwt';
import { Role, Permission } from '../../src/constants/roles';
import { config } from '../../src/config/env';
import { pool } from '../../src/database/db';

const app = createApp();
const adminToken = signToken({ sub: 'auth-admin', role: Role.ADMIN, permissions: Object.values(Permission) as Permission[] });
const studentToken = signToken({ sub: 'auth-student', role: Role.STUDENT });

let dbReady = false;

beforeAll(async () => {
  try {
    await pool.query('SELECT 1');
    dbReady = true;
  } catch {
    dbReady = false;
    // eslint-disable-next-line no-console
    console.warn('[integration] DATABASE_URL not reachable — DB-backed tests will be skipped.');
  }
});

afterAll(async () => {
  await pool.end();
});

describe('User Service — smoke (no DB required)', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('rejects requests without a token (401)', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects an invalid token (401)', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Authorization', 'Bearer not.a.jwt');
    expect(res.status).toBe(401);
  });

  it('rejects internal provisioning without the service key (401)', async () => {
    const res = await request(app)
      .post('/api/v1/internal/users')
      .send({ authUserId: '11111111-1111-4111-8111-111111111111', email: 'x@y.com' });
    expect(res.status).toBe(401);
  });

  it('serves the OpenAPI document', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBeDefined();
    expect(res.body.paths['/users/me']).toBeDefined();
  });
});

describe('User Service — DB-backed flows', () => {
  const guarded = (name: string, fn: () => Promise<void>) =>
    it(name, async () => {
      if (!dbReady) return;
      await fn();
    });

  guarded('provisions a user via internal endpoint', async () => {
    const res = await request(app)
      .post('/api/v1/internal/users')
      .set('x-internal-api-key', config.internalApiKey)
      .send({ authUserId: 'auth-student', email: 'student-flow@devbattle.io', role: Role.STUDENT });
    expect([200, 201]).toContain(res.status);
  });

  guarded('returns own profile for the student', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('student-flow@devbattle.io');
  });

  guarded('blocks the student from reading the user list (403)', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  guarded('allows admin to list and search users', async () => {
    const list = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.pagination).toBeDefined();

    const search = await request(app)
      .get('/api/v1/users/search?q=student-flow')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(search.status).toBe(200);
  });

  guarded('allows admin to read statistics', async () => {
    const res = await request(app).get('/api/v1/users/statistics').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBeGreaterThan(0);
  });
});
