// ===========================================
// Password Helper Utility
// ===========================================

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Bcrypt hashed password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Validate password strength against policy.
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }}
 */
const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters.' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }

  return { valid: true, message: 'Password meets requirements.' };
};

export { hashPassword, comparePassword, validatePasswordStrength, SALT_ROUNDS };
