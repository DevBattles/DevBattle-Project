import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config/env';
import * as schema from './schema';

/**
 * Single PostgreSQL connection pool for the process.
 * The pool lazily connects on first query, so importing this module is safe
 * even when no database is reachable yet (e.g. during unit tests).
 */
export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: config.isProduction ? 20 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export const db = drizzle(pool, { schema });

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export { schema };
