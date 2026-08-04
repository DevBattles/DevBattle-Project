// ===========================================
// Database Seed Script
// ===========================================

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { db, client } from '../config/db.config.js';
import { logger } from '../utils/logger.js';

import { users } from './schema.js';

const SALT_ROUNDS = 12;

const seedUsers = [
  {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@devbattle.com',
    passwordHash: await bcrypt.hash('Admin@1234', SALT_ROUNDS),
    role: 'admin',
    isVerified: true,
  },
  {
    id: uuidv4(),
    name: 'Mentor User',
    email: 'mentor@devbattle.com',
    passwordHash: await bcrypt.hash('Mentor@1234', SALT_ROUNDS),
    role: 'mentor',
    isVerified: true,
  },
  {
    id: uuidv4(),
    name: 'Student User',
    email: 'student@devbattle.com',
    passwordHash: await bcrypt.hash('Student@1234', SALT_ROUNDS),
    role: 'student',
    isVerified: true,
  },
];

const seed = async () => {
  try {
    logger.info('Seeding database...');

    // Clear existing data
    await db.delete(users);
    logger.info('Cleared existing users.');

    // Insert seed users
    await db.insert(users).values(seedUsers);
    logger.info(`Seeded ${seedUsers.length} users successfully.`);

    logger.info('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

seed();
