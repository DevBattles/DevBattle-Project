// ===========================================
// Cookie Helper Utility
// ===========================================

import { env } from '../config/env.js';
import { COOKIE_NAMES } from '../constants/index.js';
import jwtConfig from '../config/jwt.config.js';

/**
 * Set the refresh token as an HTTP-only cookie.
 * @param {import('express').Response} res - Express response object
 * @param {string} token - Refresh token value
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN,
    maxAge: jwtConfig.refresh.expiresInMs,
    path: '/',
  });
};

/**
 * Clear the refresh token cookie.
 * @param {import('express').Response} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN,
    path: '/',
  });
};

export { setRefreshTokenCookie, clearRefreshTokenCookie };
