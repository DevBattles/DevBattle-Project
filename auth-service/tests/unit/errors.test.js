// ===========================================
// Unit Tests - Custom Errors
// ===========================================

import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
} from '../../src/utils/errors.js';
import { STATUS_CODES } from '../../src/constants/index.js';

describe('Custom Errors', () => {
  describe('AppError', () => {
    it('should create an AppError with message and status code', () => {
      const error = new AppError('Test error', 500);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    it('should serialize to JSON correctly', () => {
      const error = new AppError('Test error', 400, [{ field: 'email', message: 'required' }]);
      const json = error.toJSON();

      expect(json.success).toBe(false);
      expect(json.message).toBe('Test error');
      expect(json.errors).toHaveLength(1);
    });
  });

  describe('ValidationError', () => {
    it('should have status code 422', () => {
      const error = new ValidationError('Invalid input');
      expect(error.statusCode).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    });
  });

  describe('UnauthorizedError', () => {
    it('should have status code 401', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    });
  });

  describe('ForbiddenError', () => {
    it('should have status code 403', () => {
      const error = new ForbiddenError();
      expect(error.statusCode).toBe(STATUS_CODES.FORBIDDEN);
    });
  });

  describe('ConflictError', () => {
    it('should have status code 409', () => {
      const error = new ConflictError();
      expect(error.statusCode).toBe(STATUS_CODES.CONFLICT);
    });
  });

  describe('NotFoundError', () => {
    it('should have status code 404', () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(STATUS_CODES.NOT_FOUND);
    });
  });
});
