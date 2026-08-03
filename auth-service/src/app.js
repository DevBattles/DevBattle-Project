// ===========================================
// Express Application Setup
// ===========================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import sanitizeXSS from './middlewares/sanitize.middleware.js';

import { env } from './config/env.js';
import appConfig from './config/app.config.js';
import corsConfig from './config/cors.config.js';
import routes, { healthRoutes } from './routes/index.js';
import requestLogger from './middlewares/requestLogger.middleware.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import notFoundHandler from './middlewares/notFound.middleware.js';
import setupSwagger from './swagger/setup.js';
import { logger } from './utils/logger.js';

const app = express();

// ===========================================
// Security Middleware
// ===========================================

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: appConfig.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }),
);

// XSS Protection
app.use(sanitizeXSS);

// CORS
app.use(cors(corsConfig));

// ===========================================
// Body Parsing Middleware
// ===========================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser(env.COOKIE_SECRET));

// Compression
app.use(compression());

// ===========================================
// Rate Limiting
// ===========================================

app.use(generalLimiter);

// ===========================================
// Logging
// ===========================================

app.use(requestLogger);

// ===========================================
// Health Check Route (no prefix)
// ===========================================

app.use('/health', healthRoutes);

// ===========================================
// API Routes
// ===========================================

app.use(env.API_PREFIX, routes);

// ===========================================
// Swagger Documentation
// ===========================================

setupSwagger(app);

// ===========================================
// Root Route
// ===========================================

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: `${appConfig.name} is running`,
    data: {
      version: appConfig.version,
      environment: appConfig.env,
      docs: '/api-docs',
      health: '/health',
    },
  });
});

// ===========================================
// 404 Handler
// ===========================================

app.use(notFoundHandler);

// ===========================================
// Global Error Handler
// ===========================================

app.use(errorHandler);

export default app;
