import { Router, Request, Response, NextFunction } from 'express';
import { questionController } from '../controllers/question.controller';
import { validate } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
import { config } from '../config/env';
import { ApiError } from '../utils/error';
import { questionIdParamSchema, internalStatsSchema } from '../validations/question.validations';

/**
 * Service-to-service boundary. The Judge/Submission Service (or platform gateway)
 * calls this to fetch full question payloads (including hidden test cases) and to
 * record attempt/solve statistics. These are NOT public endpoints and must never
 * perform authentication themselves.
 */
const requireInternalKey = (req: Request, _res: Response, next: NextFunction): void => {
  const key = req.header('x-internal-api-key');
  if (!key || key !== config.internalApiKey) {
    return next(ApiError.unauthorized('Invalid or missing internal service key.', 'INTERNAL_AUTH'));
  }
  next();
};

const router = Router();

// Full question payload (hidden test cases included) — consumed by the Judge Service.
router.get(
  '/questions/:id',
  requireInternalKey,
  validate({ params: questionIdParamSchema }),
  asyncHandler(questionController.getInternal),
);

// Record attempt/solve statistics after a submission is judged.
router.post(
  '/questions/:id/stats',
  requireInternalKey,
  validate({ params: questionIdParamSchema, body: internalStatsSchema }),
  asyncHandler(questionController.recordStats),
);

export default router;
