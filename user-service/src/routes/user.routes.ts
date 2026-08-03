import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
import { uploadAvatarMiddleware } from '../utils/fileUpload';
import { Role } from '../constants/roles';
import {
  userIdParamSchema,
  updateProfileSchema,
  updateStatusSchema,
  updateRoleSchema,
  userListQuerySchema,
  searchQuerySchema,
} from '../validations/user.validations';

const router = Router();

const STAFF = [Role.MENTOR, Role.ADMIN];

// Self-service (any authenticated user)
router
  .route('/me')
  .get(authenticate, asyncHandler(userController.getMe))
  .put(
    authenticate,
    validate({ body: updateProfileSchema }),
    asyncHandler(userController.updateMe),
  );

// Avatar management (self)
router
  .route('/avatar')
  .post(authenticate, uploadAvatarMiddleware, asyncHandler(userController.uploadAvatar))
  .delete(authenticate, asyncHandler(userController.deleteAvatar));

// Search + statistics (mentor / admin)
router.get(
  '/search',
  authenticate,
  authorize(...STAFF),
  validate({ query: searchQuerySchema }),
  asyncHandler(userController.search),
);
router.get(
  '/statistics',
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(userController.statistics),
);

// Listing (mentor / admin)
router.get(
  '/',
  authenticate,
  authorize(...STAFF),
  validate({ query: userListQuerySchema }),
  asyncHandler(userController.list),
);

// Single user operations
router.get(
  '/:id',
  authenticate,
  authorize(...STAFF),
  validate({ params: userIdParamSchema }),
  asyncHandler(userController.getById),
);
router.patch(
  '/:id/status',
  authenticate,
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema, body: updateStatusSchema }),
  asyncHandler(userController.changeStatus),
);
router.patch(
  '/:id/role',
  authenticate,
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema, body: updateRoleSchema }),
  asyncHandler(userController.changeRole),
);
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema }),
  asyncHandler(userController.deleteUser),
);

export default router;
