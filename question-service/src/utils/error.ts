import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';

/**
 * Operational error with an associated HTTP status code.
 * Thrown from services/controllers and translated into the standard
 * error envelope by the global error handler.
 */
export class ApiError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly errors?: unknown[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    options: { code?: string; errors?: unknown[]; isOperational?: boolean } = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = options.code || 'ERR_OPERATIONAL';
    this.errors = options.errors;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: unknown[], code = 'BAD_REQUEST') {
    return new ApiError(HttpStatus.BAD_REQUEST, message, { code, errors });
  }
  static unauthorized(message: string, code = 'UNAUTHORIZED') {
    return new ApiError(HttpStatus.UNAUTHORIZED, message, { code });
  }
  static forbidden(message: string, code = 'FORBIDDEN') {
    return new ApiError(HttpStatus.FORBIDDEN, message, { code });
  }
  static notFound(message: string, code = 'NOT_FOUND') {
    return new ApiError(HttpStatus.NOT_FOUND, message, { code });
  }
  static conflict(message: string, code = 'CONFLICT') {
    return new ApiError(HttpStatus.CONFLICT, message, { code });
  }
  static unprocessable(message: string, errors?: unknown[], code = 'UNPROCESSABLE') {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, { code, errors });
  }
  static internal(message: string, code = 'INTERNAL') {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, { code, isOperational: false });
  }
}
