import { updateProfileSchema, searchQuerySchema, provisionUserSchema, updateRoleSchema } from '../../src/validations/user.validations';
import { z } from 'zod';

describe('user.validations', () => {
  it('updateProfile rejects unknown keys (strict)', () => {
    const result = updateProfileSchema.safeParse({ firstName: 'A', hacker: 1 });
    expect(result.success).toBe(false);
  });

  it('updateProfile accepts a full valid payload', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Aarav',
      lastName: 'Patel',
      bio: 'Fullstack developer building things.',
      gender: 'male',
      skills: [{ name: 'React', level: 'advanced' }],
      education: [{ college: 'KRMU', degree: 'B.Tech' }],
      socialLinks: { github: 'https://github.com/aarav' },
    });
    expect(result.success).toBe(true);
  });

  it('search query defaults page/limit/sort', () => {
    const result = searchQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('search query coerces numeric strings', () => {
    const result = searchQuerySchema.safeParse({ page: '3', limit: '5', role: 'student' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(5);
      expect(result.data.role).toBe('student');
    }
  });

  it('provision requires a valid uuid authUserId', () => {
    expect(provisionUserSchema.safeParse({ authUserId: 'not-uuid', email: 'a@b.com' }).success).toBe(false);
    expect(
      provisionUserSchema.safeParse({ authUserId: '11111111-1111-4111-8111-111111111111', email: 'a@b.com' }).success,
    ).toBe(true);
  });

  it('role update only allows enum', () => {
    expect(updateRoleSchema.safeParse({ role: 'god' }).success).toBe(false);
    expect(updateRoleSchema.safeParse({ role: 'admin' }).success).toBe(true);
  });

  it('social links must be URLs when provided', () => {
    const result = updateProfileSchema.safeParse({ socialLinks: { github: 'not-a-url' } });
    expect(result.success).toBe(false);
  });
});
