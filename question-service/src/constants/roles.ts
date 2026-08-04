/**
 * Role definitions. The Auth Service is the source of truth for authentication;
 * this service only trusts the `role` claim present in the verified JWT.
 */
export const Role = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES: Role[] = [Role.STUDENT, Role.MENTOR, Role.ADMIN];

/**
 * Fine-grained permissions. A JWT may carry a `permissions` claim; endpoints can
 * require either a role or one of these permissions.
 */
export const Permission = {
  QUESTION_READ: 'question:read',
  QUESTION_READ_HIDDEN: 'question:read:hidden',
  QUESTION_CREATE: 'question:create',
  QUESTION_UPDATE: 'question:update',
  QUESTION_DELETE: 'question:delete',
  QUESTION_PUBLISH: 'question:publish',
  QUESTION_STATISTICS: 'question:statistics',
  QUESTION_BOOKMARK: 'question:bookmark',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.STUDENT]: [Permission.QUESTION_READ, Permission.QUESTION_BOOKMARK],
  [Role.MENTOR]: [
    Permission.QUESTION_READ,
    Permission.QUESTION_READ_HIDDEN,
    Permission.QUESTION_CREATE,
    Permission.QUESTION_UPDATE,
    Permission.QUESTION_DELETE,
    Permission.QUESTION_PUBLISH,
    Permission.QUESTION_BOOKMARK,
  ],
  [Role.ADMIN]: [
    Permission.QUESTION_READ,
    Permission.QUESTION_READ_HIDDEN,
    Permission.QUESTION_CREATE,
    Permission.QUESTION_UPDATE,
    Permission.QUESTION_DELETE,
    Permission.QUESTION_PUBLISH,
    Permission.QUESTION_STATISTICS,
    Permission.QUESTION_BOOKMARK,
  ],
};
