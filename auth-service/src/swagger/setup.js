// ===========================================
// Swagger Setup Middleware
// ===========================================

import swaggerUi from 'swagger-ui-express';

import { logger } from '../utils/logger.js';

import swaggerSpec from './swagger.config.js';

/**
 * Setup Swagger documentation middleware.
 * @param {import('express').Application} app - Express app instance
 */
const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'DevBattle Auth API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
      },
    }),
  );

  // Serve raw swagger spec as JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info('Swagger documentation available at /api-docs');
};

export default setupSwagger;
