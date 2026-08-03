import winston from 'winston';
import { config } from '../config/env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${stack || message}${metaString}`;
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  defaultMeta: { service: config.appName },
  transports: [
    new winston.transports.Console({
      format: config.isProduction
        ? combine(errors({ stack: true }), json())
        : combine(colorize(), devFormat),
    }),
  ],
  silent: config.isTest,
});

export default logger;
