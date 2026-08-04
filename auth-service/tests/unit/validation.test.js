// ===========================================
// Unit Tests - Validation Schemas
// ===========================================

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from '../../src/validations/auth.validation.js';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'P@ssw0rd!',
        role: 'student',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept registration without role (defaults to student)', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'P@ssw0rd!',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.role).toBe('student');
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'P@ssw0rd!',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        password: 'P@ssw0rd!',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'P@ssw0rd!',
        role: 'superadmin',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        name: 'John Doe',
        email: 'John@Example.COM',
        password: 'P@ssw0rd!',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.email).toBe('john@example.com');
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const data = {
        email: 'john@example.com',
        password: 'any-password',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject empty email', () => {
      const data = {
        email: '',
        password: 'password',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const data = {
        email: 'john@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should accept valid reset data', () => {
      const data = {
        token: 'reset-token-123',
        password: 'NewP@ssw0rd!',
        confirmPassword: 'NewP@ssw0rd!',
      };

      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const data = {
        token: 'reset-token-123',
        password: 'NewP@ssw0rd!',
        confirmPassword: 'DifferentP@ss!',
      };

      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should accept valid change password data', () => {
      const data = {
        currentPassword: 'OldP@ssw0rd!',
        newPassword: 'NewP@ssw0rd!',
        confirmNewPassword: 'NewP@ssw0rd!',
      };

      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched new passwords', () => {
      const data = {
        currentPassword: 'OldP@ssw0rd!',
        newPassword: 'NewP@ssw0rd!',
        confirmNewPassword: 'Different!',
      };

      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('verifyEmailSchema', () => {
    it('should accept valid token', () => {
      const data = { token: 'verification-token-123' };
      const result = verifyEmailSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const data = { token: '' };
      const result = verifyEmailSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should accept valid email', () => {
      const data = { email: 'john@example.com' };
      const result = forgotPasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid' };
      const result = forgotPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
