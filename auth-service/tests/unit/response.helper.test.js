// ===========================================
// Unit Tests - Response Helper
// ===========================================

import { sanitizeUser } from '../../src/utils/response.helper.js';

describe('Response Helper', () => {
  describe('sanitizeUser', () => {
    it('should remove sensitive fields from user object', () => {
      const user = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        isVerified: true,
        passwordHash: '$2b$12$somehash',
        refreshToken: 'hashed-refresh-token',
        refreshTokenExpiry: new Date(),
        verificationToken: 'verification-token',
        verificationTokenExpiry: new Date(),
        resetPasswordToken: 'reset-token',
        resetPasswordTokenExpiry: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const sanitized = sanitizeUser(user);

      expect(sanitized.id).toBe('123');
      expect(sanitized.name).toBe('John Doe');
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.role).toBe('student');
      expect(sanitized.isVerified).toBe(true);
      expect(sanitized.passwordHash).toBeUndefined();
      expect(sanitized.refreshToken).toBeUndefined();
      expect(sanitized.refreshTokenExpiry).toBeUndefined();
      expect(sanitized.verificationToken).toBeUndefined();
      expect(sanitized.verificationTokenExpiry).toBeUndefined();
      expect(sanitized.resetPasswordToken).toBeUndefined();
      expect(sanitized.resetPasswordTokenExpiry).toBeUndefined();
    });

    it('should return null for null input', () => {
      expect(sanitizeUser(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(sanitizeUser(undefined)).toBeNull();
    });
  });
});
