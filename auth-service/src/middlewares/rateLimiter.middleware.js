// ===========================================
// Rate Limiter Middleware
// ===========================================

import rateLimit from 'express-rate-limit';

import { STATUS_CODES, RATE_LIMITS } from '../constants/index.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * General rate limiter for all routes.
 */
const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.GENERAL.windowMs,
  max: RATE_LIMITS.GENERAL.max,
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
});

/**
 * Strict rate limiter for authentication routes.
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH.windowMs,
  max: RATE_LIMITS.AUTH.max,
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
  skipSuccessfulRequests: false,
});

export { generalLimiter, authLimiter };
