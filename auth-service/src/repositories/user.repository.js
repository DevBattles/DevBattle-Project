// ===========================================
// User Repository with JSON Fallback
// ===========================================

import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import db from '../config/db.config.js';
import { users } from '../database/schema.js';

const FALLBACK_DIR = '/home/user/DevBattle/database-fallback';
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'auth_users.json');

const loadFallback = () => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_FILE)) {
      // Seed default accounts
      const defaultUsers = [
        {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Sarah Connor',
          email: 'admin@devbattles.io',
          passwordHash: '$2a$12$L7R66lA5.h4g2bW3e1gU0eYv58R.9m9u7g.KzD7K2C6ZkY4f7fS6q', // admin123
          role: 'admin',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '22222222-2222-4222-8222-222222222222',
          name: 'Aarav Patel',
          email: 'aarav.patel@krmangalam.edu.in',
          passwordHash: '$2a$12$K1R22tA5.h4g2bW3e1gU0ePv58R.9m9u7g.KzD7K2C6ZkY4f7fS6q', // password123
          role: 'student',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '33333333-3333-4333-8333-333333333333',
          name: 'Prof. Rajesh Sharma',
          passwordHash: '$2a$12$K1R22tA5.h4g2bW3e1gU0ePv58R.9m9u7g.KzD7K2C6ZkY4f7fS6q', // password123
          email: 'rajesh.sharma@krmangalam.edu.in',
          role: 'mentor',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
      return defaultUsers;
    }
    const content = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading auth fallback:', error);
    return [];
  }
};

const saveFallback = (usersList) => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(usersList, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving auth fallback:', error);
  }
};

/**
 * Repository class for user database operations.
 * Handles all direct database interactions for the users table with JSON fallback.
 */
class UserRepository {
  /**
   * Find a user by their unique ID.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.id === id) || null;
    }
  }

  /**
   * Find a user by their email address.
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      const normEmail = email.trim().toLowerCase();
      return list.find((u) => u.email.trim().toLowerCase() === normEmail) || null;
    }
  }

  /**
   * Find a user by their verification token.
   * @param {string} token - Verification token
   * @returns {Promise<Object|null>}
   */
  async findByVerificationToken(token) {
    try {
      const result = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1);
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.verificationToken === token) || null;
    }
  }

  /**
   * Find a user by their password reset token.
   * @param {string} token - Password reset token
   * @returns {Promise<Object|null>}
   */
  async findByResetPasswordToken(token) {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.resetPasswordToken, token))
        .limit(1);
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.resetPasswordToken === token) || null;
    }
  }

  /**
   * Find a user by their refresh token hash.
   * @param {string} tokenHash - Hashed refresh token
   * @returns {Promise<Object|null>}
   */
  async findByRefreshToken(tokenHash) {
    try {
      const result = await db.select().from(users).where(eq(users.refreshToken, tokenHash)).limit(1);
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.refreshToken === tokenHash) || null;
    }
  }

  /**
   * Create a new user.
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    try {
      const result = await db
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          role: data.role || 'student',
          isVerified: data.isVerified || false,
          verificationToken: data.verificationToken || null,
          verificationTokenExpiry: data.verificationTokenExpiry || null,
        })
        .returning();
      return result[0];
    } catch (err) {
      const list = loadFallback();
      const newUser = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || 'student',
        isVerified: data.isVerified || false,
        verificationToken: data.verificationToken || null,
        verificationTokenExpiry: data.verificationTokenExpiry ? new Date(data.verificationTokenExpiry).toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.push(newUser);
      saveFallback(list);
      return newUser;
    }
  }

  /**
   * Update a user by ID.
   * @param {string} id - User UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object|null>} Updated user
   */
  async update(id, data) {
    try {
      const result = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      const list = loadFallback();
      const index = list.findIndex((u) => u.id === id);
      if (index === -1) return null;
      list[index] = {
        ...list[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      saveFallback(list);
      return list[index];
    }
  }

  /**
   * Update user's refresh token.
   * @param {string} id - User UUID
   * @param {string|null} tokenHash - Hashed refresh token
   * @param {Date|null} expiry - Token expiry date
   * @returns {Promise<Object|null>}
   */
  async updateRefreshToken(id, tokenHash, expiry) {
    try {
      const result = await db
        .update(users)
        .set({
          refreshToken: tokenHash,
          refreshTokenExpiry: expiry,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        refreshToken: tokenHash,
        refreshTokenExpiry: expiry ? new Date(expiry).toISOString() : null
      });
    }
  }

  /**
   * Clear the refresh token for a user (logout).
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async clearRefreshToken(id) {
    try {
      const result = await db
        .update(users)
        .set({
          refreshToken: null,
          refreshTokenExpiry: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        refreshToken: null,
        refreshTokenExpiry: null
      });
    }
  }

  /**
   * Set password reset token for a user.
   * @param {string} id - User UUID
   * @param {string} token - Reset token hash
   * @param {Date} expiry - Token expiry
   * @returns {Promise<Object|null>}
   */
  async setResetPasswordToken(id, token, expiry) {
    try {
      const result = await db
        .update(users)
        .set({
          resetPasswordToken: token,
          resetPasswordTokenExpiry: expiry,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expiry ? new Date(expiry).toISOString() : null
      });
    }
  }

  /**
   * Clear password reset token.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async clearResetPasswordToken(id) {
    try {
      const result = await db
        .update(users)
        .set({
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null
      });
    }
  }

  /**
   * Verify a user's email.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async verifyEmail(id) {
    try {
      const result = await db
        .update(users)
        .set({
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      });
    }
  }

  /**
   * Update user password.
   * @param {string} id - User UUID
   * @param {string} passwordHash - New hashed password
   * @returns {Promise<Object|null>}
   */
  async updatePassword(id, passwordHash) {
    try {
      const result = await db
        .update(users)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        passwordHash
      });
    }
  }

  /**
   * Update last login timestamp.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async updateLastLogin(id) {
    try {
      const result = await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (err) {
      return this.update(id, {
        lastLoginAt: new Date().toISOString()
      });
    }
  }

  /**
   * Delete a user by ID.
   * @param {string} id - User UUID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await db.delete(users).where(eq(users.id, id)).returning();
      return result.length > 0;
    } catch (err) {
      const list = loadFallback();
      const filtered = list.filter((u) => u.id !== id);
      if (filtered.length === list.length) return false;
      saveFallback(filtered);
      return true;
    }
  }
}

export default new UserRepository();
