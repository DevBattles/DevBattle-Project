// ===========================================
// Database Configuration
// ===========================================

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../database/schema.js';
import * as relations from '../database/relations.js';

import { env } from './env.js';

const connectionString = env.DATABASE_URL;

/**
 * Postgres client instance.
 * In production, use a connection pool. In development, use a single connection.
 */
const client = postgres(connectionString, {
  max: env.NODE_ENV === 'production' ? 20 : 1,
  idle_timeout: 30,
  connect_timeout: 10,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Drizzle ORM instance with schema awareness.
 */
const db = drizzle(client, {
  schema: { ...schema, ...relations },
  logger: env.NODE_ENV === 'development',
});

export { client, db };
export default db;
