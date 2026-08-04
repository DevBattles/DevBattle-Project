// ===========================================
// JWT Configuration
// ===========================================

import { env } from './env.js';

const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET || env.JWT_SECRET || 'devbattle-shared-jwt-secret',
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    /** Expiration in milliseconds for token validation */
    expiresInMs: 15 * 60 * 1000, // 15 minutes
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    /** Expiration in milliseconds for cookie max-age */
    expiresInMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  issuer: 'devbattle-auth-service',
  audience: 'devbattle-client',
};

export default jwtConfig;
