import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/error';
import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import logger from '../utils/logger';

/**
 * Global error handler. Translates operational ApiErrors and unexpected errors
 * into the standard failure envelope. Must be registered last.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error('Non-operational error', { message: err.message, stack: err.stack });
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ? err.errors : [{ code: err.code }],
    });
    return;
  }

  // Zod validation errors that bypassed the validate middleware
  if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'ZodError') {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: Messages.VALIDATION_FAILED,
      errors: (err as any).errors,
    });
    return;
  }

  logger.error('Unhandled exception', {
    message: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: Messages.INTERNAL_ERROR,
    errors: [{ code: 'INTERNAL' }],
  });
};

export const statusCodeOf = (err: unknown): HttpStatusCode =>
  err instanceof ApiError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
