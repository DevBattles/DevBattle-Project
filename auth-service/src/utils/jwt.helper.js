// ===========================================
// JWT Helper Utility
// ===========================================

import jwt from 'jsonwebtoken';

import jwtConfig from '../config/jwt.config.js';
import { UnauthorizedError } from './errors.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Generate an access token for a user.
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    subject: payload.id,
  });
};

/**
 * Generate a refresh token for a user.
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign({ id: payload.id, type: 'refresh' }, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    subject: payload.id,
  });
};

/**
 * Verify and decode an access token.
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.access.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Verify and decode a refresh token.
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refresh.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED);
    }
    throw new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
  }
};

/**
 * Decode a token without verification (for inspection).
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
