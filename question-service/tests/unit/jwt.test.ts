import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../../src/utils/jwt';
import { Role, Permission } from '../../src/constants/roles';
import { config } from '../../src/config/env';

describe('jwt utils', () => {
  it('round-trips a signed token', () => {
    const token = signToken({ sub: 'auth-1', role: Role.MENTOR });
    const verified = verifyToken(token);
    expect(verified.authUserId).toBe('auth-1');
    expect(verified.role).toBe(Role.MENTOR);
  });

  it('round-trips permissions', () => {
    const token = signToken({
      sub: 'auth-1',
      role: Role.ADMIN,
      permissions: [Permission.QUESTION_CREATE, Permission.QUESTION_STATISTICS],
    });
    const verified = verifyToken(token);
    expect(verified.permissions).toContain(Permission.QUESTION_CREATE);
  });

  it('rejects an invalid token', () => {
    expect(() => verifyToken('not.a.jwt')).toThrow();
  });

  it('rejects a token signed with a different secret', () => {
    const token = jwt.sign({ sub: 'auth-1', role: Role.STUDENT }, 'some-other-secret', {
      algorithm: 'HS256',
    });
    expect(() => verifyToken(token)).toThrow();
  });

  it('rejects a token for a different audience', () => {
    const token = jwt.sign({ sub: 'auth-1', role: Role.STUDENT }, config.jwt.secret, {
      algorithm: 'HS256',
      issuer: config.jwt.issuer,
      audience: 'devbattle-some-other-service',
      expiresIn: '1h',
    });
    expect(() => verifyToken(token)).toThrow();
  });
});
