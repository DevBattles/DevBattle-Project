// ===========================================
// Request Logger Middleware
// ===========================================

import morgan from 'morgan';

import { logger } from '../utils/logger.js';

/**
 * Custom Morgan stream that routes to Winston logger.
 */
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

/**
 * Morgan format string for request logging.
 */
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

/**
 * Request logger middleware using Morgan.
 */
const requestLogger = morgan(morganFormat, { stream: morganStream });

export default requestLogger;
