import { createApp } from './app';
import { config } from './config/env';
import logger from './utils/logger';

const bootstrap = (): void => {
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`${config.appName} listening on port ${config.port}`, {
      environment: config.nodeEnv,
      apiPrefix: config.apiPrefix,
      docs: `http://localhost:${config.port}/api-docs`,
    });
  });

  const shutdown = (signal: string): void => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
    // Force-close after 10s
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

bootstrap();
