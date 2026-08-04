// ===========================================
// Integration Tests - Auth API
// ===========================================

import request from 'supertest';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import '../setup.js';

// Mock the database module before importing app
jest.unstable_mockModule('../../src/config/db.config.js', () => ({
  default: {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
  db: {},
  client: jest.fn(),
}));

jest.unstable_mockModule('../../src/repositories/user.repository.js', () => ({
  default: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateRefreshToken: jest.fn(),
    clearRefreshToken: jest.fn(),
    findByRefreshToken: jest.fn(),
    setResetPasswordToken: jest.fn(),
    findByResetPasswordToken: jest.fn(),
    clearResetPasswordToken: jest.fn(),
    updatePassword: jest.fn(),
    updateLastLogin: jest.fn(),
    verifyEmail: jest.fn(),
    findByVerificationToken: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/services/email.service.js', () => ({
  default: {
    sendVerificationEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendPasswordChangedEmail: jest.fn().mockResolvedValue(true),
  },
}));

const { default: app } = await import('../../src/app.js');
const { default: userRepository } = await import('../../src/repositories/user.repository.js');
const { hashPassword } = await import('../../src/utils/password.helper.js');
const { generateAccessToken } = await import('../../src/utils/jwt.helper.js');

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestP@ssw0rd!',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it('should return 409 if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '123', email: 'test@example.com' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestP@ssw0rd!',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });

    it('should return 422 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: '',
          email: 'invalid',
          password: 'weak',
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const hashedPw = await hashPassword('TestP@ssw0rd!');
      userRepository.findByEmail.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: hashedPw,
        role: 'student',
        isVerified: true,
      });
      userRepository.updateRefreshToken.mockResolvedValue({});
      userRepository.updateLastLogin.mockResolvedValue({});

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestP@ssw0rd!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongP@ssw0rd!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 422 for missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const token = generateAccessToken({
        id: userId,
        email: 'test@example.com',
        role: 'student',
      });

      userRepository.findById.mockResolvedValue({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 without auth header', async () => {
      await request(app).get('/api/v1/auth/me').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service).toBeDefined();
      expect(response.body.data.uptime).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should always return success message', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 422 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'invalid' })
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/auth/change-password')
        .send({
          currentPassword: 'OldP@ssw0rd!',
          newPassword: 'NewP@ssw0rd!',
          confirmNewPassword: 'NewP@ssw0rd!',
        })
        .expect(401);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/v1/nonexistent').expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
