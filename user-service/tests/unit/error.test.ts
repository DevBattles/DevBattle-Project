import { ApiError } from '../../src/utils/error';

describe('ApiError', () => {
  it('maps helpers to correct status codes', () => {
    expect(ApiError.badRequest('x').statusCode).toBe(400);
    expect(ApiError.unauthorized('x').statusCode).toBe(401);
    expect(ApiError.forbidden('x').statusCode).toBe(403);
    expect(ApiError.notFound('x').statusCode).toBe(404);
    expect(ApiError.conflict('x').statusCode).toBe(409);
    expect(ApiError.unprocessable('x').statusCode).toBe(422);
    expect(ApiError.internal('x').statusCode).toBe(500);
  });

  it('carries errors array and code', () => {
    const err = ApiError.unprocessable('Validation failed', [{ path: 'email', message: 'invalid' }]);
    expect(Array.isArray(err.errors)).toBe(true);
    expect(err.code).toBe('UNPROCESSABLE');
    expect(err.isOperational).toBe(true);
  });

  it('internal errors are non-operational', () => {
    expect(ApiError.internal('boom').isOperational).toBe(false);
  });
});
