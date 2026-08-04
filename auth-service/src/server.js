// ===========================================
// Server Entry Point
// ===========================================

import app from './app.js';
import { env, validateEnv } from './config/env.js';
import { client } from './config/db.config.js';
import { logger } from './utils/logger.js';

/**
 * Start the application server.
 */
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();
    logger.info('Environment variables validated.');

    // Test database connection
    await testDatabaseConnection();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 DevBattle Auth Service started`);
      logger.info(`   Environment: ${env.NODE_ENV}`);
      logger.info(`   Port: ${env.PORT}`);
      logger.info(`   API: http://localhost:${env.PORT}${env.API_PREFIX}`);
      logger.info(`   Docs: http://localhost:${env.PORT}/api-docs`);
      logger.info(`   Health: http://localhost:${env.PORT}/health`);
    });

    // Graceful shutdown handler
    setupGracefulShutdown(server);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Test database connectivity.
 */
const testDatabaseConnection = async () => {
  try {
    await client`SELECT 1`;
    logger.info('Database connection established.');
  } catch (error) {
    logger.warn(`Database connection failed: ${error.message}`);
    logger.warn(
      'Server will start, but database operations will fail until connection is restored.',
    );
  }
};

/**
 * Setup graceful shutdown handlers for SIGTERM and SIGINT.
 * @param {import('http').Server} server
 */
const setupGracefulShutdown = (server) => {
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed.');

      try {
        await client.end();
        logger.info('Database connection closed.');
      } catch (error) {
        logger.error('Error closing database connection:', error);
      }

      logger.info('Graceful shutdown complete.');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

// Start the server
startServer();
