import { Request, Response, NextFunction } from 'express';
import { Role, Permission, ROLE_PERMISSIONS } from '../constants/roles';
import { ApiError } from '../utils/error';
import { Messages } from '../constants/messages';

/**
 * Authorize by role. The acting user must hold at least one of the allowed roles.
 * Usage: router.get('/', authenticate, authorize(Role.ADMIN), handler)
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) throw ApiError.unauthorized(Messages.UNAUTHORIZED, 'UNAUTHORIZED');
      if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
        return next();
      }
      throw ApiError.forbidden(Messages.FORBIDDEN, 'FORBIDDEN');
    } catch (err) {
      next(err);
    }
  };

/** Authorize by explicit permission claim. */
export const requirePermissions =
  (...required: Permission[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) throw ApiError.unauthorized(Messages.UNAUTHORIZED, 'UNAUTHORIZED');

      const userPerms = new Set<Permission>([
        ...ROLE_PERMISSIONS[req.user.role],
        ...req.user.permissions,
      ]);

      const hasAll = required.every((p) => userPerms.has(p));
      if (!hasAll) throw ApiError.forbidden(Messages.FORBIDDEN, 'FORBIDDEN');
      next();
    } catch (err) {
      next(err);
    }
  };
