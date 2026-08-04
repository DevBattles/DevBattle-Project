import request from 'supertest';
import { createApp } from '../../src/app';
import { signToken } from '../../src/utils/jwt';
import { Role, Permission } from '../../src/constants/roles';
import { config } from '../../src/config/env';
import { pool } from '../../src/database/db';

const app = createApp();
const adminToken = signToken({
  sub: 'auth-admin',
  role: Role.ADMIN,
  permissions: Object.values(Permission) as Permission[],
});
const mentorToken = signToken({ sub: 'auth-mentor', role: Role.MENTOR });
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

describe('Question Service — smoke (no DB required)', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('rejects requests without a token (401)', async () => {
    const res = await request(app).get('/api/v1/questions');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects an invalid token (401)', async () => {
    const res = await request(app)
      .get('/api/v1/questions')
      .set('Authorization', 'Bearer not.a.jwt');
    expect(res.status).toBe(401);
  });

  it('rejects students creating questions (403)', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'X', description: 'A long enough description.' });
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid UUID params (422)', async () => {
    const res = await request(app)
      .get('/api/v1/questions/not-a-uuid')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(422);
  });

  it('rejects internal endpoints without the service key (401)', async () => {
    const res = await request(app).get(
      '/api/v1/internal/questions/11111111-1111-4111-8111-111111111111',
    );
    expect(res.status).toBe(401);
  });

  it('rejects stats recording with an invalid body (422)', async () => {
    const res = await request(app)
      .post('/api/v1/internal/questions/11111111-1111-4111-8111-111111111111/stats')
      .set('x-internal-api-key', config.internalApiKey)
      .send({ attempted: 'yes' });
    expect(res.status).toBe(422);
  });

  it('serves the OpenAPI document', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBeDefined();
    expect(res.body.paths['/questions']).toBeDefined();
    expect(res.body.paths['/internal/questions/{id}']).toBeDefined();
  });
});

describe('Question Service — DB-backed flows', () => {
  const guarded = (name: string, fn: () => Promise<void>) =>
    it(name, async () => {
      if (!dbReady) return;
      await fn();
    });

  let questionId = '';

  guarded('mentor creates a question (draft)', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({
        title: 'Integration Two Sum',
        description:
          'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
        type: 'dsa',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        tags: ['Hash Table'],
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
        starterCode: { javascript: 'function twoSum(nums, target) {}' },
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isSample: true },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: true },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('draft');
    expect(res.body.data.testCases).toHaveLength(2);
    questionId = res.body.data.id;
  });

  guarded('draft is invisible to students', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/${questionId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(404);
  });

  guarded('mentor publishes the question', async () => {
    const res = await request(app)
      .patch(`/api/v1/questions/${questionId}/status`)
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ status: 'published' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('published');
    expect(res.body.data.publishedAt).toBeTruthy();
  });

  guarded('student sees the published question without hidden test cases', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/${questionId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.testCases).toHaveLength(1);
    expect(res.body.data.testCases[0].isHidden).toBe(false);
  });

  guarded('mentor sees hidden test cases', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/${questionId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.testCases.some((tc: any) => tc.isHidden)).toBe(true);
  });

  guarded('student toggles a bookmark', async () => {
    const add = await request(app)
      .post(`/api/v1/questions/${questionId}/bookmark`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(add.status).toBe(200);
    expect(add.body.data.bookmarked).toBe(true);

    const list = await request(app)
      .get('/api/v1/questions/bookmarks')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(list.body.data.items[0].isBookmarked).toBe(true);

    const remove = await request(app)
      .delete(`/api/v1/questions/${questionId}/bookmark`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(remove.status).toBe(200);
    expect(remove.body.data.bookmarked).toBe(false);
  });

  guarded('internal stats recording updates counters', async () => {
    const before = await request(app)
      .get(`/api/v1/internal/questions/${questionId}`)
      .set('x-internal-api-key', config.internalApiKey);
    expect(before.status).toBe(200);
    expect(before.body.data.testCases.some((tc: any) => tc.isHidden)).toBe(true);

    const res = await request(app)
      .post(`/api/v1/internal/questions/${questionId}/stats`)
      .set('x-internal-api-key', config.internalApiKey)
      .send({ attempted: true, solved: true });
    expect(res.status).toBe(200);
    expect(res.body.data.attemptedCount).toBe(before.body.data.attemptedCount + 1);
    expect(res.body.data.solvedCount).toBe(before.body.data.solvedCount + 1);
  });

  guarded('admin sees question statistics', async () => {
    const res = await request(app)
      .get('/api/v1/questions/statistics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data.byStatus).toBeDefined();
  });

  guarded('mentor deletes the question', async () => {
    const res = await request(app)
      .delete(`/api/v1/questions/${questionId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
