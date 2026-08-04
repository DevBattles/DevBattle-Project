// ===========================================
// Application Constants
// ===========================================

/**
 * User roles for role-based access control.
 */
export const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
};

export const ALL_ROLES = Object.values(ROLES);

/**
 * HTTP Status codes used throughout the application.
 */
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Cookie names used for token storage.
 */
export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
};

/**
 * JWT token types.
 */
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  VERIFICATION: 'verification',
  PASSWORD_RESET: 'password_reset',
};

/**
 * API version prefix.
 */
export const API_PREFIX = '/api/v1';

/**
 * Password policy constants.
 */
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,128}$/,
  REGEX_DESCRIPTION:
    'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
};

/**
 * Rate limiting configuration.
 */
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window
  },
  GENERAL: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
