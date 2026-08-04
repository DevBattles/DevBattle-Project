import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/error';
import { Messages } from '../constants/messages';

type ValidatedPart = 'body' | 'params' | 'query' | 'headers';

interface ValidationConfig {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
  headers?: ZodSchema;
}

const formatZodErrors = (error: ZodError) =>
  error.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
    code: e.code,
  }));

/**
 * Validates the incoming request against Zod schemas for body/params/query/headers.
 * Parsed values are written back onto the request so controllers receive typed data.
 */
export const validate =
  (schemas: ValidationConfig) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      (['body', 'params', 'query', 'headers'] as ValidatedPart[]).forEach((part) => {
        const schema = schemas[part];
        if (!schema) return;
        const result = schema.safeParse(req[part]);
        if (!result.success) {
          throw ApiError.unprocessable(
            Messages.VALIDATION_FAILED,
            formatZodErrors(result.error),
            'VALIDATION',
          );
        }
        (req as any)[part] = result.data;
      });
      next();
    } catch (err) {
      next(err);
    }
  };
