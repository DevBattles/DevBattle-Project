// ===========================================
// Health Controller
// ===========================================

import { sendSuccess } from '../utils/response.helper.js';
import { STATUS_CODES } from '../constants/index.js';
import appConfig from '../config/app.config.js';

/**
 * GET /health
 * Health check endpoint for load balancers and monitoring.
 */
const healthCheck = (_req, res) => {
  sendSuccess(res, {
    statusCode: STATUS_CODES.OK,
    message: 'Service is healthy',
    data: {
      service: appConfig.name,
      version: appConfig.version,
      environment: appConfig.env,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
    },
  });
};

export default healthCheck;
