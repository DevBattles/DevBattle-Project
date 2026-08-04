// ===========================================
// Not Found Handler Middleware
// ===========================================

import { STATUS_CODES } from '../constants/index.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Middleware to handle requests to undefined routes.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const notFoundHandler = (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: `${ERROR_MESSAGES.ROUTE_NOT_FOUND} ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

export default notFoundHandler;
