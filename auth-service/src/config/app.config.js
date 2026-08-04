// ===========================================
// Application Configuration
// ===========================================

import { env } from './env.js';

const appConfig = {
  name: 'DevBattle Auth Service',
  version: '1.0.0',
  description: 'Authentication Microservice for the DevBattle platform',
  env: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
};

export default appConfig;
