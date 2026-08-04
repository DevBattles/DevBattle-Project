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
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Sarah Connor',
    email: 'admin@devbattles.io',
    passwordHash: await bcrypt.hash('admin123', SALT_ROUNDS),
    role: 'admin',
    isVerified: true,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Aarav Patel',
    email: 'aarav.patel@krmangalam.edu.in',
    passwordHash: await bcrypt.hash('password123', SALT_ROUNDS),
    role: 'student',
    isVerified: true,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Prof. Rajesh Sharma',
    email: 'rajesh.sharma@krmangalam.edu.in',
    passwordHash: await bcrypt.hash('password123', SALT_ROUNDS),
    role: 'mentor',
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
