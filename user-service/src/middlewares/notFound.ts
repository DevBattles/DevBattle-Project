import { Request, Response } from 'express';
import { ApiError } from '../utils/error';
import { Messages } from '../constants/messages';
import { HttpStatus } from '../constants/httpStatus';

/** 404 handler for unmatched routes. */
export const notFound = (_req: Request, res: Response): void => {
  const error = ApiError.notFound(Messages.NOT_FOUND, 'NOT_FOUND');
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: error.message,
    errors: [{ code: error.code }],
  });
};
