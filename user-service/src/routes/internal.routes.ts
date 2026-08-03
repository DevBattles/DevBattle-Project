import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
import { config } from '../config/env';
import { ApiError } from '../utils/error';
import { provisionUserSchema } from '../validations/user.validations';

/**
 * Service-to-service boundary. The Auth Service (or platform gateway) calls this
 * to provision a user profile when an account is created/verified. It is NOT a
 * public endpoint and must never perform authentication itself.
 */
const requireInternalKey = (req: Request, _res: Response, next: NextFunction): void => {
  const key = req.header('x-internal-api-key');
  if (!key || key !== config.internalApiKey) {
    return next(ApiError.unauthorized('Invalid or missing internal service key.', 'INTERNAL_AUTH'));
  }
  next();
};

const router = Router();

router.post(
  '/users',
  requireInternalKey,
  validate({ body: provisionUserSchema }),
  asyncHandler(userController.provision),
);

export default router;
