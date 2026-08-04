// ===========================================
// Unit Tests - JWT Helper
// ===========================================

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
} from '../../src/utils/jwt.helper.js';
import { UnauthorizedError } from '../../src/utils/errors.js';

// Ensure env is set for tests
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

describe('JWT Helper', () => {
  const testPayload = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'student',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const token = generateAccessToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT refresh token', () => {
      const token = generateRefreshToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for tampered token', () => {
      const token = generateAccessToken(testPayload);
      const tampered = token.slice(0, -5) + 'XXXXX';

      expect(() => verifyAccessToken(tampered)).toThrow(UnauthorizedError);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const token = generateRefreshToken(testPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.type).toBe('refresh');
    });

    it('should throw UnauthorizedError for invalid refresh token', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow(UnauthorizedError);
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verification', () => {
      const token = generateAccessToken(testPayload);
      const decoded = decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('not-a-jwt');
      expect(decoded).toBeNull();
    });
  });
});
