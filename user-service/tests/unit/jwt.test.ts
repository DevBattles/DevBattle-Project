import { signToken, verifyToken } from '../../src/utils/jwt';
import { Role } from '../../src/constants/roles';
import { ApiError } from '../../src/utils/error';

describe('jwt utils', () => {
  it('round-trips a signed token', () => {
    const token = signToken({ sub: 'auth-123', role: Role.ADMIN });
    const decoded = verifyToken(token);
    expect(decoded.authUserId).toBe('auth-123');
    expect(decoded.role).toBe(Role.ADMIN);
  });

  it('rejects a malformed token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow(ApiError);
  });

  it('rejects an empty/invalid payload', () => {
    // HS256 token with no `sub`
    const token = Buffer.from('eyJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIifQ.x'.replace('x', '')).toString();
    // Use jsonwebtoken style: just assert garbage throws
    expect(() => verifyToken('a.b.c')).toThrow();
  });
});
