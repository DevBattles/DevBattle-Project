import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/env';
import { openapiComponents, openapiPaths } from '../docs/openapi';

/**
 * Builds the full OpenAPI 3.0 document for the User Service by merging server
 * metadata, security schemes and the path/component definitions from src/docs/openapi.ts.
 */
const definition = {
  openapi: '3.0.3',
  info: {
    title: 'DevBattle — User Service API',
    version: '1.0.0',
    description:
      'User microservice for the DevBattle platform. Manages user profiles, avatars, skills, education, experience and statistics. Authentication (JWT issuance, passwords, login, registration) is handled by the Auth Service; this service only verifies the JWT and manages user information.',
  },
  servers: [{ url: `http://localhost:${config.port}${config.apiPrefix}`, description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      internalApiKey: { type: 'apiKey', in: 'header', name: 'x-internal-api-key' },
    },
    ...openapiComponents,
  },
  security: [{ bearerAuth: [] }],
  paths: openapiPaths,
};

export const swaggerSpec = swaggerJsdoc({ definition, apis: [] });
