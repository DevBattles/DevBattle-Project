import { Role } from '../constants/roles';

/* ----------------------------- Domain types ---------------------------- */

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type ProblemType = 'dsa' | 'frontend' | 'fullstack';
export type QuestionStatus = 'draft' | 'published' | 'archived';
export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string | null;
}

export interface QuestionTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  isSample: boolean;
  sortOrder: number;
}

/** Full question payload as served by the API (assembled from all tables). */
export interface QuestionDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ProblemType;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  companies: string[];
  technology: string[];
  requirements: string[];
  constraints: string[];
  acceptanceRate: number;
  estimatedMinutes: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  isPremium: boolean;
  status: QuestionStatus;
  createdBy: string;
  attemptedCount: number;
  solvedCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  examples: QuestionExample[];
  starterCode: Record<string, string>;
  testCases: QuestionTestCase[];
  isBookmarked?: boolean;
}

/** Compact card view used by list endpoints. */
export type QuestionSummary = Omit<
  QuestionDetail,
  'examples' | 'starterCode' | 'testCases' | 'requirements' | 'constraints' | 'isPremium'
> & { testCaseCount: number; hiddenTestCaseCount: number };

/* ----------------------------- DTOs ------------------------------------ */

export interface CreateQuestionDto {
  title: string;
  description: string;
  type?: ProblemType;
  difficulty?: Difficulty;
  category?: string;
  tags?: string[];
  companies?: string[];
  technology?: string[];
  requirements?: string[];
  constraints?: string[];
  acceptanceRate?: number;
  estimatedMinutes?: number;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  isPremium?: boolean;
  examples?: QuestionExample[];
  starterCode?: Record<string, string>;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
    isSample?: boolean;
    sortOrder?: number;
  }>;
}

export type UpdateQuestionDto = Partial<CreateQuestionDto>;

export interface QuestionListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  difficulty?: Difficulty;
  type?: ProblemType;
  category?: string;
  tag?: string;
  technology?: string;
  search?: string;
  status?: QuestionStatus;
  bookmarked?: boolean;
  /** Internal: id of the caller, used to attach bookmark flags. */
  userId?: string;
}

export interface QuestionStatistics {
  total: number;
  byStatus: Record<QuestionStatus, number>;
  byDifficulty: Record<Difficulty, number>;
  byType: Record<ProblemType, number>;
  totalAttempts: number;
  totalSolves: number;
  overallAcceptanceRate: number;
}

/** Identity of the caller extracted from the verified JWT. */
export interface Requester {
  id: string; // auth_user_id
  role: Role;
  permissions: string[];
}

export interface InternalStatsInput {
  attempted?: boolean;
  solved?: boolean;
}
