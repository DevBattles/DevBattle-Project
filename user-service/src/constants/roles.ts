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
  PROFILE_READ_SELF: 'profile:read:self',
  PROFILE_UPDATE_SELF: 'profile:update:self',
  AVATAR_MANAGE_SELF: 'avatar:manage:self',
  USER_READ: 'user:read',
  USER_SEARCH: 'user:search',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_BLOCK: 'user:block',
  USER_ROLE_UPDATE: 'user:role:update',
  USER_STATISTICS: 'user:statistics',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.STUDENT]: [
    Permission.PROFILE_READ_SELF,
    Permission.PROFILE_UPDATE_SELF,
    Permission.AVATAR_MANAGE_SELF,
  ],
  [Role.MENTOR]: [
    Permission.PROFILE_READ_SELF,
    Permission.PROFILE_UPDATE_SELF,
    Permission.AVATAR_MANAGE_SELF,
    Permission.USER_READ,
    Permission.USER_SEARCH,
  ],
  [Role.ADMIN]: [
    Permission.PROFILE_READ_SELF,
    Permission.PROFILE_UPDATE_SELF,
    Permission.AVATAR_MANAGE_SELF,
    Permission.USER_READ,
    Permission.USER_SEARCH,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_BLOCK,
    Permission.USER_ROLE_UPDATE,
    Permission.USER_STATISTICS,
  ],
};
