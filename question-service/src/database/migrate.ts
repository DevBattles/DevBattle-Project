import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from '../config/env';
import logger from '../utils/logger';

/**
 * Applies pending Drizzle migrations from ./drizzle.
 * Run with: npm run db:migrate
 */
const pool = new Pool({ connectionString: config.databaseUrl });

const run = async (): Promise<void> => {
  const db = drizzle(pool, { schema: {} });
  logger.info('Applying database migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  logger.info('Migrations applied successfully.');
  await pool.end();
};

run().catch((err) => {
  logger.error('Migration failed', { error: err.message });
  process.exit(1);
});
