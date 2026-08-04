// ===========================================
// Custom Error Classes
// ===========================================

import { STATUS_CODES } from '../constants/index.js';

/**
 * Base application error class.
 * All custom errors should extend this class.
 */
class AppError extends Error {
  constructor(message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, errors = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      errors: this.errors,
    };
  }
}

/**
 * Validation error (422).
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, STATUS_CODES.UNPROCESSABLE_ENTITY, errors);
  }
}

/**
 * Unauthorized error (401).
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}

/**
 * Forbidden error (403).
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}

/**
 * Conflict error (409).
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, STATUS_CODES.CONFLICT);
  }
}

/**
 * Not found error (404).
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}

export {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
};
