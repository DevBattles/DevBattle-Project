// ===========================================
// Authentication Middleware
// ===========================================

import { verifyAccessToken } from '../utils/jwt.helper.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import userRepository from '../repositories/user.repository.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to authenticate requests using JWT access tokens.
 * Extracts token from Authorization header (Bearer scheme).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decoded = verifyAccessToken(token);

    // Verify user still exists
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    logger.debug('Authentication failed:', error.message);
    next(
      error instanceof UnauthorizedError
        ? error
        : new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED),
    );
  }
};

/**
 * Middleware factory to authorize requests based on user roles.
 * Must be used after the authenticate middleware.
 *
 * @param {...string} roles - Allowed roles
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(ERROR_MESSAGES.INSUFFICIENT_ROLE));
    }

    next();
  };
};

export { authenticate, authorize };
