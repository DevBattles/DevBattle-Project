import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/error';
import { Messages } from '../constants/messages';

/**
 * Verifies the bearer token (issued by the Auth Service) and attaches the
 * decoded identity to `req.user`. This service NEVER issues or refreshes tokens.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized(Messages.TOKEN_MISSING, 'TOKEN_MISSING');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) throw ApiError.unauthorized(Messages.TOKEN_MISSING, 'TOKEN_MISSING');

    const verified = verifyToken(token);
    req.user = {
      id: verified.authUserId,
      role: verified.role,
      permissions: verified.permissions,
    };
    next();
  } catch (err) {
    next(err);
  }
};
