import winston from 'winston';
import { config } from '../config/env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat =
  config.nodeEnv === 'production'
    ? combine(timestamp(), errors({ stack: true }), json())
    : combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        printf(({ level, message, timestamp: ts, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          const stackStr = stack ? `\n${stack}` : '';
          return `${ts} [${level}]: ${message}${metaStr}${stackStr}`;
        }),
      );

export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(errors({ stack: true }), json()),
  transports: [new winston.transports.Console({ format: consoleFormat })],
  exitOnError: false,
});

export default logger;
