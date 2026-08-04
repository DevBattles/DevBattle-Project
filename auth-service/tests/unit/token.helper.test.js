// ===========================================
// Unit Tests - Token Helper
// ===========================================

import { generateToken, hashToken } from '../../src/utils/token.helper.js';

describe('Token Helper', () => {
  describe('generateToken', () => {
    it('should generate a random hex token', () => {
      const token = generateToken(32);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateToken(32);
      const token2 = generateToken(32);

      expect(token1).not.toBe(token2);
    });

    it('should respect custom length', () => {
      const token = generateToken(16);
      expect(token).toHaveLength(32); // 16 bytes = 32 hex chars
    });
  });

  describe('hashToken', () => {
    it('should hash a token using SHA-256', () => {
      const token = 'test-token-12345';
      const hash = hashToken(token);

      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64); // SHA-256 = 64 hex chars
      expect(hash).not.toBe(token);
    });

    it('should produce consistent hashes for the same input', () => {
      const token = 'consistent-token';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashToken('token-1');
      const hash2 = hashToken('token-2');

      expect(hash1).not.toBe(hash2);
    });
  });
});
