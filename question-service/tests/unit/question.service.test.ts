import { QuestionService, IQuestionRepository } from '../../src/services/question.service';
import {
  QuestionDetail,
  QuestionStatistics,
  CreateQuestionDto,
  UpdateQuestionDto,
  InternalStatsInput,
  Requester,
} from '../../src/types';
import { Role } from '../../src/constants/roles';

const STUDENT: Requester = { id: 'auth-student', role: Role.STUDENT, permissions: [] };
const MENTOR: Requester = { id: 'auth-mentor', role: Role.MENTOR, permissions: [] };
const ADMIN: Requester = { id: 'auth-admin', role: Role.ADMIN, permissions: [] };

const baseQuestion = (overrides: Partial<QuestionDetail> = {}): QuestionDetail => ({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Two Sum',
  slug: 'two-sum',
  description:
    'Given an array of integers, return indices of the two numbers that add up to a target.',
  type: 'dsa',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Hash Table'],
  companies: ['Google'],
  technology: ['JavaScript'],
  requirements: [],
  constraints: [],
  acceptanceRate: 84.5,
  estimatedMinutes: 15,
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  isPremium: false,
  status: 'published',
  createdBy: MENTOR.id,
  attemptedCount: 100,
  solvedCount: 84,
  publishedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
  starterCode: { javascript: 'function twoSum(nums, target) {}' },
  testCases: [
    {
      id: 'tc-1',
      input: '[2,7,11,15]',
      expectedOutput: '[0,1]',
      isHidden: false,
      isSample: true,
      sortOrder: 0,
    },
    {
      id: 'tc-2',
      input: '[-1,-2]',
      expectedOutput: '[0,1]',
      isHidden: true,
      isSample: false,
      sortOrder: 1,
    },
  ],
  ...overrides,
});

const createMockRepository = (
  overrides: Partial<IQuestionRepository> = {},
): IQuestionRepository => ({
  findById: jest.fn().mockResolvedValue(baseQuestion()),
  existsBySlug: jest.fn().mockResolvedValue(false),
  findMany: jest.fn().mockResolvedValue({
    items: [baseQuestion()],
    pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
  }),
  create: jest.fn().mockResolvedValue(baseQuestion({ status: 'draft' })),
  update: jest.fn().mockResolvedValue(baseQuestion()),
  setStatus: jest.fn().mockResolvedValue(baseQuestion({ status: 'published' })),
  delete: jest.fn().mockResolvedValue(true),
  addBookmark: jest.fn().mockResolvedValue(undefined),
  removeBookmark: jest.fn().mockResolvedValue(undefined),
  isBookmarked: jest.fn().mockResolvedValue(false),
  listBookmarks: jest.fn().mockResolvedValue({
    items: [baseQuestion({ isBookmarked: true })],
    pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
  }),
  incrementStats: jest.fn().mockResolvedValue(baseQuestion()),
  statistics: jest.fn().mockResolvedValue({
    total: 1,
    byStatus: { draft: 0, published: 1, archived: 0 },
    byDifficulty: { Easy: 1, Medium: 0, Hard: 0, Expert: 0 },
    byType: { dsa: 1, frontend: 0, fullstack: 0 },
    totalAttempts: 100,
    totalSolves: 84,
    overallAcceptanceRate: 84,
  } satisfies QuestionStatistics),
  ...overrides,
});

describe('QuestionService', () => {
  describe('list', () => {
    it('forces status=published for students', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      await service.list({ status: 'draft' }, STUDENT);

      expect(repo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'published', userId: STUDENT.id }),
      );
    });

    it('lets staff filter by any status', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      await service.list({ status: 'draft' }, MENTOR);

      expect(repo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'draft', userId: MENTOR.id }),
      );
    });

    it('strips hidden test cases from summaries for students', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const result = await service.list({}, STUDENT);
      const item = result.items[0];
      expect(item.testCaseCount).toBe(1); // only the non-hidden case
      expect(item.hiddenTestCaseCount).toBe(0);
    });

    it('reports hidden test case counts to staff', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const result = await service.list({}, MENTOR);
      const item = result.items[0];
      expect(item.testCaseCount).toBe(2);
      expect(item.hiddenTestCaseCount).toBe(1);
    });
  });

  describe('getById', () => {
    it('returns the question for staff', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const question = await service.getById('11111111-1111-4111-8111-111111111111', ADMIN);
      expect(question.testCases).toHaveLength(2);
    });

    it('strips hidden test cases for students', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const question = await service.getById('11111111-1111-4111-8111-111111111111', STUDENT);
      expect(question.testCases).toHaveLength(1);
      expect(question.testCases[0].isHidden).toBe(false);
    });

    it('hides non-published questions from students (404)', async () => {
      const repo = createMockRepository({
        findById: jest.fn().mockResolvedValue(baseQuestion({ status: 'draft' })),
      });
      const service = new QuestionService(repo);

      await expect(
        service.getById('11111111-1111-4111-8111-111111111111', STUDENT),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('throws 404 when the question does not exist', async () => {
      const repo = createMockRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new QuestionService(repo);

      await expect(
        service.getById('11111111-1111-4111-8111-111111111111', MENTOR),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('create', () => {
    it('creates with a slugified title, creator and draft status', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const dto: CreateQuestionDto = {
        title: 'Two Sum! (Easy)',
        description: 'A very nice problem.',
      };
      await service.create(MENTOR, dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'two-sum-easy',
          createdBy: MENTOR.id,
          status: 'draft',
          title: 'Two Sum! (Easy)',
        }),
      );
    });

    it('appends a numeric suffix when the slug is taken', async () => {
      const repo = createMockRepository({
        existsBySlug: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
      });
      const service = new QuestionService(repo);

      await service.create(MENTOR, { title: 'Two Sum', description: 'A very nice problem.' });

      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'two-sum-2' }));
    });
  });

  describe('update', () => {
    it('regenerates the slug when the title changes', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const dto: UpdateQuestionDto = { title: 'Two Sum II' };
      await service.update('11111111-1111-4111-8111-111111111111', MENTOR, dto);

      expect(repo.update).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        expect.objectContaining({ title: 'Two Sum II', slug: 'two-sum-ii' }),
      );
    });

    it('keeps the slug when the title is unchanged', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      await service.update('11111111-1111-4111-8111-111111111111', MENTOR, {
        description: 'Updated description here.',
      });

      expect(repo.update).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        expect.not.objectContaining({ slug: expect.any(String) }),
      );
    });

    it('throws 404 for unknown questions', async () => {
      const repo = createMockRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new QuestionService(repo);

      await expect(
        service.update('11111111-1111-4111-8111-111111111111', MENTOR, { title: 'New' }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('setStatus / remove', () => {
    it('publishes a question', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const q = await service.setStatus('11111111-1111-4111-8111-111111111111', 'published');
      expect(q.status).toBe('published');
      expect(repo.setStatus).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        'published',
      );
    });

    it('throws 404 when publishing a missing question', async () => {
      const repo = createMockRepository({ setStatus: jest.fn().mockResolvedValue(null) });
      const service = new QuestionService(repo);

      await expect(
        service.setStatus('11111111-1111-4111-8111-111111111111', 'published'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deletes a question', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);
      await expect(service.remove('11111111-1111-4111-8111-111111111111')).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111');
    });
  });

  describe('bookmarks', () => {
    it('adds a bookmark when not bookmarked', async () => {
      const repo = createMockRepository({ isBookmarked: jest.fn().mockResolvedValue(false) });
      const service = new QuestionService(repo);

      const result = await service.toggleBookmark('11111111-1111-4111-8111-111111111111', STUDENT);
      expect(result).toEqual({ bookmarked: true });
      expect(repo.addBookmark).toHaveBeenCalledWith(
        STUDENT.id,
        '11111111-1111-4111-8111-111111111111',
      );
    });

    it('removes a bookmark when already bookmarked', async () => {
      const repo = createMockRepository({ isBookmarked: jest.fn().mockResolvedValue(true) });
      const service = new QuestionService(repo);

      const result = await service.toggleBookmark('11111111-1111-4111-8111-111111111111', STUDENT);
      expect(result).toEqual({ bookmarked: false });
      expect(repo.removeBookmark).toHaveBeenCalledWith(
        STUDENT.id,
        '11111111-1111-4111-8111-111111111111',
      );
    });

    it('rejects bookmarking a draft as a student', async () => {
      const repo = createMockRepository({
        findById: jest.fn().mockResolvedValue(baseQuestion({ status: 'draft' })),
      });
      const service = new QuestionService(repo);

      await expect(
        service.toggleBookmark('11111111-1111-4111-8111-111111111111', STUDENT),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lists bookmarked questions as summaries', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const result = await service.getBookmarks(STUDENT, {});
      expect(result.items[0].isBookmarked).toBe(true);
      expect(repo.listBookmarks).toHaveBeenCalledWith(STUDENT.id, expect.objectContaining({}));
    });
  });

  describe('internal', () => {
    it('returns the full payload with hidden test cases', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const q = await service.getInternal('11111111-1111-4111-8111-111111111111');
      expect(q.testCases.some((tc) => tc.isHidden)).toBe(true);
    });

    it('records stats through the repository', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const input: InternalStatsInput = { attempted: true, solved: true };
      await service.recordStats('11111111-1111-4111-8111-111111111111', input);
      expect(repo.incrementStats).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        input,
      );
    });

    it('throws 404 when recording stats for a missing question', async () => {
      const repo = createMockRepository({ incrementStats: jest.fn().mockResolvedValue(null) });
      const service = new QuestionService(repo);

      await expect(
        service.recordStats('11111111-1111-4111-8111-111111111111', { attempted: true }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('statistics', () => {
    it('delegates to the repository', async () => {
      const repo = createMockRepository();
      const service = new QuestionService(repo);

      const stats = await service.statistics();
      expect(stats.total).toBe(1);
      expect(stats.overallAcceptanceRate).toBe(84);
    });
  });
});
