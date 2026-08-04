import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { Role, Permission } from '../constants/roles';
import { ApiError } from './error';

export interface VerifiedToken {
  authUserId: string;
  role: Role;
  permissions: Permission[];
}

/**
 * Verify a JWT issued by the Auth Service. This service NEVER issues tokens.
 * Supports HS256 (shared secret) or RS256/ES256 (public key) verification.
 */
export const verifyToken = (token: string): VerifiedToken => {
  const options: VerifyOptions = {
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  };

  let decoded: string | JwtPayload;
  try {
    decoded = config.jwt.publicKey
      ? jwt.verify(token, config.jwt.publicKey, { ...options, algorithms: ['RS256', 'ES256'] })
      : jwt.verify(token, config.jwt.secret, { ...options, algorithms: ['HS256'] });
  } catch {
    throw ApiError.unauthorized('Invalid or expired authentication token.', 'INVALID_TOKEN');
  }

  if (typeof decoded === 'string' || !decoded.sub) {
    throw ApiError.unauthorized('Malformed authentication token.', 'INVALID_TOKEN');
  }

  const payload = decoded as JwtPayload & {
    sub: string;
    role?: Role;
    permissions?: Permission[];
  };

  const role = (payload.role as Role) ?? Role.STUDENT;
  const permissions = Array.isArray(payload.permissions)
    ? (payload.permissions as Permission[])
    : [];

  return {
    authUserId: payload.sub,
    role,
    permissions,
  };
};

/** Convenience used by tests / token minting utilities. */
export const signToken = (payload: {
  sub: string;
  role: Role;
  permissions?: Permission[];
}): string => {
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: 'HS256',
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    expiresIn: '1h',
  });
};
