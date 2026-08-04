// ===========================================
// CORS Configuration
// ===========================================

import { env } from './env.js';

const corsConfig = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = Array.isArray(env.CORS_ORIGIN)
      ? env.CORS_ORIGIN
      : [env.CORS_ORIGIN];

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: env.CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

export default corsConfig;
