import { Role, Permission } from '../constants/roles';

/**
 * Identity extracted from the verified JWT (issued by the Auth Service).
 * The `id` is the Auth Service's `auth_user_id` (UUID) that links to our `users.auth_user_id`.
 */
export interface AuthenticatedUser {
  id: string; // auth_user_id from the Auth Service
  role: Role;
  permissions: Permission[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      file?: Express.Multer.File;
    }
  }
}

export {};
