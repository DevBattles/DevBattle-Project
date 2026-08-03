// ===========================================
// Unit Tests - Password Helper
// ===========================================

import { hashPassword, comparePassword, validatePasswordStrength } from '../../src/utils/password.helper.js';

describe('Password Helper', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestP@ssw0rd!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'TestP@ssw0rd!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestP@ssw0rd!';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestP@ssw0rd!';
      const hash = await hashPassword(password);
      const result = await comparePassword('WrongP@ssw0rd!', hash);

      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept a valid strong password', () => {
      const result = validatePasswordStrength('TestP@ssw0rd!');
      expect(result.valid).toBe(true);
    });

    it('should reject a short password', () => {
      const result = validatePasswordStrength('Te@1');
      expect(result.valid).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('testp@ssw0rd!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('TESTP@SSW0RD!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('TestP@ssword!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = validatePasswordStrength('TestPassw0rd');
      expect(result.valid).toBe(false);
    });

    it('should reject empty password', () => {
      const result = validatePasswordStrength('');
      expect(result.valid).toBe(false);
    });

    it('should reject null password', () => {
      const result = validatePasswordStrength(null);
      expect(result.valid).toBe(false);
    });
  });
});
