// ===========================================
// Type Definitions
// ===========================================

/**
 * Express Request with authenticated user.
 * @typedef {import('express').Request & { user?: AuthenticatedUser }} AuthRequest
 */

/**
 * Authenticated user attached to request after JWT verification.
 * @typedef {Object} AuthenticatedUser
 * @property {string} id - User UUID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} role - User role (student | mentor | admin)
 * @property {boolean} isVerified - Email verification status
 */

/**
 * Standard API success response.
 * @typedef {Object} SuccessResponse
 * @property {true} success
 * @property {string} message
 * @property {Object} [data]
 */

/**
 * Standard API error response.
 * @typedef {Object} ErrorResponse
 * @property {false} success
 * @property {string} message
 * @property {Array<{ field?: string, message: string, code?: string }>} errors
 */

/**
 * JWT payload structure.
 * @typedef {Object} JWTPayload
 * @property {string} id - User ID (subject)
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {string} iss - Issuer
 * @property {string} aud - Audience
 * @property {number} iat - Issued at (unix timestamp)
 * @property {number} exp - Expiry (unix timestamp)
 */

export {};
