// ===========================================
// Error Handler Middleware
// ===========================================

import { AppError, ValidationError } from '../utils/errors.js';
import { STATUS_CODES } from '../constants/index.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { logger } from '../utils/logger.js';
import appConfig from '../config/app.config.js';

/**
 * Global error handler middleware.
 * Catches all errors and sends formatted error responses.
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 */
const errorHandler = (err, req, res, _next) => {
  // Log the error
  if (err instanceof AppError) {
    logger.warn(`[${err.name}] ${err.message}`, {
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.error(`Unhandled error: ${err.message}`, {
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: err.message,
      errors: [],
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
      errors: [],
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_EXPIRED,
      errors: [],
    });
  }

  // Handle validation errors from express/zod
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: formattedErrors,
    });
  }

  // Default error response
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message =
    appConfig.isProduction
      ? ERROR_MESSAGES.INTERNAL_ERROR
      : err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  return res.status(statusCode).json({
    success: false,
    message,
    errors: appConfig.isProduction ? [] : [{ message: err.stack }],
  });
};

export default errorHandler;
