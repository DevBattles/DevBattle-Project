// ===========================================
// User Repository
// ===========================================

import { eq } from 'drizzle-orm';

import db from '../config/db.config.js';
import { users } from '../database/schema.js';

/**
 * Repository class for user database operations.
 * Handles all direct database interactions for the users table.
 */
class UserRepository {
  /**
   * Find a user by their unique ID.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  /**
   * Find a user by their email address.
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  /**
   * Find a user by their verification token.
   * @param {string} token - Verification token
   * @returns {Promise<Object|null>}
   */
  async findByVerificationToken(token) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);
    return result[0] || null;
  }

  /**
   * Find a user by their password reset token.
   * @param {string} token - Password reset token
   * @returns {Promise<Object|null>}
   */
  async findByResetPasswordToken(token) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token))
      .limit(1);
    return result[0] || null;
  }

  /**
   * Find a user by their refresh token hash.
   * @param {string} tokenHash - Hashed refresh token
   * @returns {Promise<Object|null>}
   */
  async findByRefreshToken(tokenHash) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, tokenHash))
      .limit(1);
    return result[0] || null;
  }

  /**
   * Create a new user.
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
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
  }

  /**
   * Update a user by ID.
   * @param {string} id - User UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object|null>} Updated user
   */
  async update(id, data) {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Update user's refresh token.
   * @param {string} id - User UUID
   * @param {string|null} tokenHash - Hashed refresh token
   * @param {Date|null} expiry - Token expiry date
   * @returns {Promise<Object|null>}
   */
  async updateRefreshToken(id, tokenHash, expiry) {
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
  }

  /**
   * Clear the refresh token for a user (logout).
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async clearRefreshToken(id) {
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
  }

  /**
   * Set password reset token for a user.
   * @param {string} id - User UUID
   * @param {string} token - Reset token hash
   * @param {Date} expiry - Token expiry
   * @returns {Promise<Object|null>}
   */
  async setResetPasswordToken(id, token, expiry) {
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
  }

  /**
   * Clear password reset token.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async clearResetPasswordToken(id) {
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
  }

  /**
   * Verify a user's email.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async verifyEmail(id) {
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
  }

  /**
   * Update user password.
   * @param {string} id - User UUID
   * @param {string} passwordHash - New hashed password
   * @returns {Promise<Object|null>}
   */
  async updatePassword(id, passwordHash) {
    const result = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Update last login timestamp.
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async updateLastLogin(id) {
    const result = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Delete a user by ID.
   * @param {string} id - User UUID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
}

export default new UserRepository();
