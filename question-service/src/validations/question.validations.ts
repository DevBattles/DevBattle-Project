import { z } from 'zod';
import { paginationQuerySchema } from '../utils/pagination';

/**
 * Languages the platform ships starter-code templates for. The future Judge
 * Service will accept submissions in exactly these languages.
 */
export const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp'] as const;

export const difficultyValues = ['Easy', 'Medium', 'Hard', 'Expert'] as const;
export const problemTypeValues = ['dsa', 'frontend', 'fullstack'] as const;
export const questionStatusValues = ['draft', 'published', 'archived'] as const;

const exampleSchema = z.object({
  input: z.string().trim().min(1).max(10_000),
  output: z.string().trim().min(1).max(10_000),
  explanation: z.string().trim().min(1).max(20_000).optional().nullable(),
});

const testCaseSchema = z.object({
  input: z.string().trim().min(1).max(50_000),
  expectedOutput: z.string().trim().min(1).max(50_000),
  isHidden: z.boolean().default(false),
  isSample: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});

const stringListSchema = z.array(z.string().trim().min(1).max(100)).max(25);

export const createQuestionSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(10).max(50_000),
  type: z.enum(problemTypeValues).default('dsa'),
  difficulty: z.enum(difficultyValues).default('Medium'),
  category: z.string().trim().min(1).max(100).default('General'),
  tags: stringListSchema.default([]),
  companies: stringListSchema.default([]),
  technology: stringListSchema.default([]),
  requirements: stringListSchema.default([]),
  constraints: stringListSchema.default([]),
  acceptanceRate: z.number().min(0).max(100).optional(),
  estimatedMinutes: z.coerce.number().int().min(1).max(600).default(30),
  timeLimitMs: z.coerce.number().int().min(100).max(60_000).default(2000),
  memoryLimitMb: z.coerce.number().int().min(16).max(4096).default(256),
  isPremium: z.boolean().default(false),
  examples: z.array(exampleSchema).max(20).default([]),
  starterCode: z.record(z.enum(LANGUAGES), z.string()).default({}),
  testCases: z.array(testCaseSchema).max(200).default([]),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = createQuestionSchema.partial();

export const questionIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const questionListQuerySchema = paginationQuerySchema.extend({
  difficulty: z.enum(difficultyValues).optional(),
  type: z.enum(problemTypeValues).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  tag: z.string().trim().min(1).max(100).optional(),
  technology: z.string().trim().min(1).max(100).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  status: z.enum(questionStatusValues).optional(),
  bookmarked: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  sortBy: z
    .enum(['title', 'difficulty', 'acceptanceRate', 'estimatedMinutes', 'createdAt', 'updatedAt'])
    .optional(),
});

export type QuestionListQueryInput = z.infer<typeof questionListQuerySchema>;

export const changeStatusSchema = z.object({
  status: z.enum(questionStatusValues),
});

export const bookmarkParamSchema = questionIdParamSchema;

/* --------------------------- Internal schemas --------------------------- */

export const internalStatsSchema = z.object({
  attempted: z.boolean().optional(),
  solved: z.boolean().optional(),
});
