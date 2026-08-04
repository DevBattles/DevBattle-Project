// ===========================================
// Swagger/OpenAPI Configuration
// ===========================================

import swaggerJsdoc from 'swagger-jsdoc';

import appConfig from '../config/app.config.js';
import { env } from '../config/env.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: `${appConfig.name} - API Documentation`,
      version: appConfig.version,
      description: `
## DevBattle Authentication Microservice

Production-ready authentication service providing:
- User Registration & Login with JWT
- Refresh Token Rotation (HttpOnly Cookies)
- Password Management (Forgot, Reset, Change)
- Email Verification
- Role-Based Access Control (Student, Mentor, Admin)

### Authentication Flow
1. **Register** - Create an account
2. **Login** - Receive access token (response) + refresh token (cookie)
3. **Access API** - Include \`Authorization: Bearer <access_token>\` header
4. **Refresh** - Call \`/auth/refresh\` when access token expires (refresh token from cookie)
5. **Logout** - Invalidate refresh token

### Roles
| Role | Description |
|------|-------------|
| student | Default role for all new users |
| mentor | Can mentor students and review code |
| admin | Full system access |
      `,
      contact: {
        name: 'DevBattle Team',
        email: 'support@devbattle.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Development server (with API prefix)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from login response',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'Refresh token stored in HTTP-only cookie',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'mentor', 'admin'] },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'P@ssw0rd!' },
            role: { type: 'string', enum: ['student', 'mentor', 'admin'], default: 'student' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'P@ssw0rd!' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Service health check' },
      { name: 'Authentication', description: 'User registration and login' },
      { name: 'Password', description: 'Password management' },
      { name: 'Email Verification', description: 'Email verification' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
