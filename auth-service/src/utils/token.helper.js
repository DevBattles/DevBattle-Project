// ===========================================
// Token Generator Utility
// ===========================================

import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token.
 * @param {number} [length=32] - Token length in bytes (output will be hex, so 2x length)
 * @returns {string} Hex-encoded random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a token using SHA-256 for secure database storage.
 * @param {string} token - Token to hash
 * @returns {string} SHA-256 hex hash
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export { generateToken, hashToken };
