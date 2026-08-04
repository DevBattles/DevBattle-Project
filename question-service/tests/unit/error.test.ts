import { ApiError } from '../../src/utils/error';
import { HttpStatus } from '../../src/constants/httpStatus';

describe('ApiError', () => {
  it('carries status, code and message', () => {
    const err = ApiError.notFound('Question not found.', 'QUESTION_NOT_FOUND');
    expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(err.code).toBe('QUESTION_NOT_FOUND');
    expect(err.message).toBe('Question not found.');
    expect(err.isOperational).toBe(true);
    expect(err.name).toBe('ApiError');
  });

  it('provides static factories', () => {
    expect(ApiError.badRequest('x').statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(ApiError.unauthorized('x').statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(ApiError.forbidden('x').statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(ApiError.conflict('x').statusCode).toBe(HttpStatus.CONFLICT);
    expect(ApiError.unprocessable('x', []).statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(ApiError.internal('x').isOperational).toBe(false);
    expect(ApiError.internal('x').statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('supports custom codes and error details', () => {
    const err = ApiError.unprocessable('Validation failed.', [{ path: 'title' }], 'VALIDATION');
    expect(err.code).toBe('VALIDATION');
    expect(err.errors).toEqual([{ path: 'title' }]);
  });
});
