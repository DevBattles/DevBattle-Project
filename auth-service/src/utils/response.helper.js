// ===========================================
// Response Helper Utility
// ===========================================

import { STATUS_CODES } from '../constants/index.js';

/**
 * Send a success response.
 * @param {import('express').Response} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} options.message - Success message
 * @param {Object} [options.data] - Response data
 * @returns {import('express').Response}
 */
const sendSuccess = (res, { statusCode = STATUS_CODES.OK, message, data = null }) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {import('express').Response} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} options.message - Error message
 * @param {Array} [options.errors] - Array of error details
 * @returns {import('express').Response}
 */
const sendError = (res, { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message, errors = [] }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Sanitize a user object by removing sensitive fields.
 * @param {Object} user - Raw user object from database
 * @returns {Object} Sanitized user object
 */
const sanitizeUser = (user) => {
  if (!user) return null;

  const {
    passwordHash,
    refreshToken,
    refreshTokenExpiry,
    verificationToken,
    verificationTokenExpiry,
    resetPasswordToken,
    resetPasswordTokenExpiry,
    ...safeUser
  } = user;

  return safeUser;
};

export { sendSuccess, sendError, sanitizeUser };
