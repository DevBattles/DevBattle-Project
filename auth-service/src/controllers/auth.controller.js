// ===========================================
// Auth Controller
// ===========================================

import authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.helper.js';
import { STATUS_CODES, COOKIE_NAMES } from '../constants/index.js';

/**
 * Auth controller handling HTTP request/response for authentication endpoints.
 * Delegates all business logic to the auth service.
 */
class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user.
   */
  register = async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, {
        statusCode: STATUS_CODES.CREATED,
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   * Authenticate a user and issue tokens.
   */
  login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body, res);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   * Logout user and invalidate refresh token.
   */
  logout = async (req, res, next) => {
    try {
      const result = await authService.logout(req.user.id, res);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh
   * Refresh the access token using the refresh token.
   */
  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;
      const result = await authService.refreshAccessToken(refreshToken, res);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   * Get the currently authenticated user's profile.
   */
  getMe = async (req, res, next) => {
    try {
      const result = await authService.getCurrentUser(req.user.id);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/forgot-password
   * Initiate forgot password flow.
   */
  forgotPassword = async (req, res, next) => {
    try {
      const result = await authService.forgotPassword(req.body.email);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/reset-password
   * Reset password using a reset token.
   */
  resetPassword = async (req, res, next) => {
    try {
      const result = await authService.resetPassword({
        token: req.body.token,
        password: req.body.password,
      });
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/change-password
   * Change password for an authenticated user.
   */
  changePassword = async (req, res, next) => {
    try {
      const result = await authService.changePassword(req.user.id, {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      });
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/verify-email
   * Verify user's email address.
   */
  verifyEmail = async (req, res, next) => {
    try {
      const result = await authService.verifyEmail(req.body.token);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/resend-verification
   * Resend email verification link.
   */
  resendVerification = async (req, res, next) => {
    try {
      const result = await authService.resendVerificationEmail(req.body.email);
      sendSuccess(res, {
        statusCode: STATUS_CODES.OK,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
