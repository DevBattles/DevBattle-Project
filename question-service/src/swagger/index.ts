import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/env';
import { openapiComponents, openapiPaths } from '../docs/openapi';

/**
 * Builds the full OpenAPI 3.0 document for the Question Service by merging server
 * metadata, security schemes and the path/component definitions from src/docs/openapi.ts.
 */
const definition = {
  openapi: '3.0.3',
  info: {
    title: 'DevBattle — Question Service API',
    version: '1.0.0',
    description:
      'Question microservice for the DevBattle platform. Manages the coding-battle question bank: problem statements, examples, constraints, starter code templates, test cases (public + hidden), bookmarks, publishing workflow and attempt/solve statistics. Authentication (JWT issuance, passwords, login, registration) is handled by the Auth Service; this service only verifies the JWT and manages questions.',
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
