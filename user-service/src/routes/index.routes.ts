import { Router } from 'express';
import userRoutes from './user.routes';
import internalRoutes from './internal.routes';
import { config } from '../config/env';
import { Messages } from '../constants/messages';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: Messages.HEALTH_OK,
    data: {
      status: 'ok',
      service: config.appName,
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/users', userRoutes);
router.use('/internal', internalRoutes);

export default router;
