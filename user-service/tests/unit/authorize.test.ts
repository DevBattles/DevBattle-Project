import { authorize, requirePermissions } from '../../src/middlewares/authorize';
import { Role, Permission } from '../../src/constants/roles';
import { ApiError } from '../../src/utils/error';

const runMiddleware = (mw: any, user: any) =>
  new Promise<{ called: boolean; error?: any }>((resolve) => {
    const req: any = { user };
    const next = (err?: any) => resolve({ called: !err, error: err });
    mw(req, {} as any, next);
  });

describe('authorize middleware', () => {
  it('allows a matching role', async () => {
    const result = await runMiddleware(authorize(Role.ADMIN), { id: 'x', role: Role.ADMIN, permissions: [] });
    expect(result.called).toBe(true);
  });

  it('forbids a non-matching role', async () => {
    const result = await runMiddleware(authorize(Role.ADMIN), { id: 'x', role: Role.STUDENT, permissions: [] });
    expect(result.called).toBe(false);
    expect(result.error).toBeInstanceOf(ApiError);
    expect(result.error.statusCode).toBe(403);
  });

  it('requires an authenticated user', async () => {
    const result = await runMiddleware(authorize(Role.ADMIN), undefined);
    expect(result.called).toBe(false);
    expect(result.error.statusCode).toBe(401);
  });

  it('requirePermissions grants when role implies permission', async () => {
    const result = await runMiddleware(requirePermissions(Permission.USER_STATISTICS), {
      id: 'x',
      role: Role.ADMIN,
      permissions: [],
    });
    expect(result.called).toBe(true);
  });

  it('requirePermissions denies without the permission', async () => {
    const result = await runMiddleware(requirePermissions(Permission.USER_DELETE), {
      id: 'x',
      role: Role.STUDENT,
      permissions: [],
    });
    expect(result.called).toBe(false);
    expect(result.error.statusCode).toBe(403);
  });
});
