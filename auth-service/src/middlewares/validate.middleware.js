// ===========================================
// Validation Middleware
// ===========================================

import { ZodError } from 'zod';

import { ValidationError } from '../utils/errors.js';

/**
 * Creates a validation middleware for Express routes.
 * Validates request body, query, params, or headers against a Zod schema.
 *
 * @param {Object} schemas - Object containing schemas for different request parts
 * @param {import('zod').ZodSchema} [schemas.body] - Body validation schema
 * @param {import('zod').ZodSchema} [schemas.query] - Query string validation schema
 * @param {import('zod').ZodSchema} [schemas.params] - URL params validation schema
 * @param {import('zod').ZodSchema} [schemas.headers] - Headers validation schema
 * @returns {import('express').RequestHandler} Express middleware
 */
const validate = (schemas) => {
  return (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.headers) {
        req.headers = { ...req.headers, ...schemas.headers.parse(req.headers) };
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError('Validation failed', formattedErrors));
        return;
      }

      next(error);
    }
  };
};

export default validate;
