import { and, asc, count, desc, eq, ilike, inArray, ne, or, sql, SQL } from 'drizzle-orm';
import { db } from '../database/db';
import {
  questions,
  questionExamples,
  questionStarterCodes,
  questionTestCases,
  questionBookmarks,
  QuestionRow,
  ExampleRow,
  StarterCodeRow,
  TestCaseRow,
} from '../database/schema';
import {
  QuestionDetail,
  QuestionStatistics,
  QuestionStatus,
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionListQuery,
  InternalStatsInput,
} from '../types';
import {
  PaginatedResult,
  getOffset,
  buildPaginationMeta,
  sanitizeSortColumn,
} from '../utils/pagination';

/** Row returned by the relational query builder (question + children). */
export interface QuestionWithRelations extends QuestionRow {
  examples: ExampleRow[];
  starterCodes: StarterCodeRow[];
  testCases: TestCaseRow[];
}

const SORTABLE_COLUMNS = [
  'title',
  'difficulty',
  'acceptanceRate',
  'estimatedMinutes',
  'createdAt',
  'updatedAt',
];

const withChildren = { examples: true, starterCodes: true, testCases: true } as const;

/** Assemble a flat row + children into the API QuestionDetail shape. */
const assemble = (row: QuestionWithRelations, isBookmarked = false): QuestionDetail => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  description: row.description,
  type: row.type,
  difficulty: row.difficulty,
  category: row.category,
  tags: row.tags ?? [],
  companies: row.companies ?? [],
  technology: row.technology ?? [],
  requirements: row.requirements ?? [],
  constraints: row.constraints ?? [],
  acceptanceRate: row.acceptanceRate,
  estimatedMinutes: row.estimatedMinutes,
  timeLimitMs: row.timeLimitMs,
  memoryLimitMb: row.memoryLimitMb,
  isPremium: row.isPremium,
  status: row.status,
  createdBy: row.createdBy,
  attemptedCount: row.attemptedCount,
  solvedCount: row.solvedCount,
  publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
  examples: [...row.examples]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((e) => ({ input: e.input, output: e.output, explanation: e.explanation ?? null })),
  starterCode: Object.fromEntries(row.starterCodes.map((s) => [s.language, s.code])),
  testCases: [...row.testCases]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((t) => ({
      id: t.id,
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: t.isHidden,
      isSample: t.isSample,
      sortOrder: t.sortOrder,
    })),
  isBookmarked,
});

const orderColumnFor = (sortBy: string | undefined) => {
  switch (sanitizeSortColumn(sortBy, SORTABLE_COLUMNS, 'createdAt')) {
    case 'title':
      return questions.title;
    case 'difficulty':
      return questions.difficulty;
    case 'acceptanceRate':
      return questions.acceptanceRate;
    case 'estimatedMinutes':
      return questions.estimatedMinutes;
    case 'updatedAt':
      return questions.updatedAt;
    default:
      return questions.createdAt;
  }
};

/** Build the WHERE clause shared by count + page queries. */
const buildWhere = (query: QuestionListQuery): SQL | undefined => {
  const conds: SQL[] = [];

  if (query.status) conds.push(eq(questions.status, query.status));
  if (query.difficulty) conds.push(eq(questions.difficulty, query.difficulty));
  if (query.type) conds.push(eq(questions.type, query.type));
  if (query.category) conds.push(eq(questions.category, query.category));
  if (query.tag) conds.push(sql`${questions.tags} @> ARRAY[${query.tag}]::text[]`);
  if (query.technology) {
    conds.push(sql`${questions.technology} @> ARRAY[${query.technology}]::text[]`);
  }
  if (query.search) {
    const searchCond = or(
      ilike(questions.title, `%${query.search}%`),
      ilike(questions.description, `%${query.search}%`),
    );
    if (searchCond) conds.push(searchCond);
  }
  if (query.bookmarked && query.userId) {
    conds.push(
      inArray(
        questions.id,
        db
          .select({ questionId: questionBookmarks.questionId })
          .from(questionBookmarks)
          .where(eq(questionBookmarks.userId, query.userId)),
      ),
    );
  }

  return conds.length ? and(...conds) : undefined;
};

export const questionRepository = {
  /** Full detail by id (all test cases, hidden included). */
  async findById(id: string, userId?: string): Promise<QuestionDetail | null> {
    const row = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: withChildren,
    });
    if (!row) return null;
    const bookmarked = userId ? await this.isBookmarked(userId, id) : false;
    return assemble(row as QuestionWithRelations, bookmarked);
  },

  async existsBySlug(slug: string, exceptId?: string): Promise<boolean> {
    const rows = await db
      .select({ id: questions.id })
      .from(questions)
      .where(
        exceptId
          ? and(eq(questions.slug, slug), ne(questions.id, exceptId))
          : eq(questions.slug, slug),
      )
      .limit(1);
    return rows.length > 0;
  },

  async findMany(query: QuestionListQuery): Promise<PaginatedResult<QuestionDetail>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = buildWhere(query);

    const [countRows, rows] = await Promise.all([
      db.select({ value: count() }).from(questions).where(where),
      db.query.questions.findMany({
        where,
        with: withChildren,
        orderBy: [
          query.sortOrder === 'asc'
            ? asc(orderColumnFor(query.sortBy))
            : desc(orderColumnFor(query.sortBy)),
        ],
        offset: getOffset(page, limit),
        limit,
      }),
    ]);

    // Bookmark flags for the requesting user (single query per page)
    let bookmarkedIds = new Set<string>();
    if (query.userId && rows.length > 0) {
      const bookmarks = await db
        .select({ questionId: questionBookmarks.questionId })
        .from(questionBookmarks)
        .where(
          and(
            eq(questionBookmarks.userId, query.userId),
            inArray(
              questionBookmarks.questionId,
              rows.map((r) => r.id),
            ),
          ),
        );
      bookmarkedIds = new Set(bookmarks.map((b) => b.questionId));
    }

    return {
      items: rows.map((r) => assemble(r as QuestionWithRelations, bookmarkedIds.has(r.id))),
      pagination: buildPaginationMeta(countRows[0]?.value ?? 0, page, limit),
    };
  },

  async create(
    dto: CreateQuestionDto & { slug: string; createdBy: string; status: QuestionStatus },
  ): Promise<QuestionDetail> {
    return db.transaction(async (tx) => {
      const [row] = await tx
        .insert(questions)
        .values({
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          type: dto.type ?? 'dsa',
          difficulty: dto.difficulty ?? 'Medium',
          category: dto.category ?? 'General',
          tags: dto.tags ?? [],
          companies: dto.companies ?? [],
          technology: dto.technology ?? [],
          requirements: dto.requirements ?? [],
          constraints: dto.constraints ?? [],
          acceptanceRate: dto.acceptanceRate ?? 0,
          estimatedMinutes: dto.estimatedMinutes ?? 30,
          timeLimitMs: dto.timeLimitMs ?? 2000,
          memoryLimitMb: dto.memoryLimitMb ?? 256,
          isPremium: dto.isPremium ?? false,
          status: dto.status,
          createdBy: dto.createdBy,
        })
        .returning();

      const examples = dto.examples ?? [];
      if (examples.length > 0) {
        await tx.insert(questionExamples).values(
          examples.map((e, i) => ({
            questionId: row.id,
            input: e.input,
            output: e.output,
            explanation: e.explanation ?? null,
            sortOrder: i,
          })),
        );
      }

      const starterCodes = Object.entries(dto.starterCode ?? {});
      if (starterCodes.length > 0) {
        await tx
          .insert(questionStarterCodes)
          .values(starterCodes.map(([language, code]) => ({ questionId: row.id, language, code })));
      }

      const testCases = dto.testCases ?? [];
      if (testCases.length > 0) {
        await tx.insert(questionTestCases).values(
          testCases.map((t, i) => ({
            questionId: row.id,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isHidden: t.isHidden ?? false,
            isSample: t.isSample ?? false,
            sortOrder: t.sortOrder ?? i,
          })),
        );
      }

      const full = await tx.query.questions.findFirst({
        where: eq(questions.id, row.id),
        with: withChildren,
      });
      return assemble(full as QuestionWithRelations);
    });
  },

  /** Updates base columns and replaces any provided child collections. */
  async update(
    id: string,
    patch: UpdateQuestionDto & { slug?: string },
  ): Promise<QuestionDetail | null> {
    return db.transaction(async (tx) => {
      const [row] = await tx
        .update(questions)
        .set({
          ...(patch.title !== undefined ? { title: patch.title } : {}),
          ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
          ...(patch.description !== undefined ? { description: patch.description } : {}),
          ...(patch.type !== undefined ? { type: patch.type } : {}),
          ...(patch.difficulty !== undefined ? { difficulty: patch.difficulty } : {}),
          ...(patch.category !== undefined ? { category: patch.category } : {}),
          ...(patch.tags !== undefined ? { tags: patch.tags } : {}),
          ...(patch.companies !== undefined ? { companies: patch.companies } : {}),
          ...(patch.technology !== undefined ? { technology: patch.technology } : {}),
          ...(patch.requirements !== undefined ? { requirements: patch.requirements } : {}),
          ...(patch.constraints !== undefined ? { constraints: patch.constraints } : {}),
          ...(patch.acceptanceRate !== undefined ? { acceptanceRate: patch.acceptanceRate } : {}),
          ...(patch.estimatedMinutes !== undefined
            ? { estimatedMinutes: patch.estimatedMinutes }
            : {}),
          ...(patch.timeLimitMs !== undefined ? { timeLimitMs: patch.timeLimitMs } : {}),
          ...(patch.memoryLimitMb !== undefined ? { memoryLimitMb: patch.memoryLimitMb } : {}),
          ...(patch.isPremium !== undefined ? { isPremium: patch.isPremium } : {}),
          updatedAt: new Date(),
        })
        .where(eq(questions.id, id))
        .returning();
      if (!row) return null;

      if (patch.examples !== undefined) {
        await tx.delete(questionExamples).where(eq(questionExamples.questionId, id));
        if (patch.examples.length > 0) {
          await tx.insert(questionExamples).values(
            patch.examples.map((e, i) => ({
              questionId: id,
              input: e.input,
              output: e.output,
              explanation: e.explanation ?? null,
              sortOrder: i,
            })),
          );
        }
      }

      if (patch.starterCode !== undefined) {
        await tx.delete(questionStarterCodes).where(eq(questionStarterCodes.questionId, id));
        const entries = Object.entries(patch.starterCode);
        if (entries.length > 0) {
          await tx
            .insert(questionStarterCodes)
            .values(entries.map(([language, code]) => ({ questionId: id, language, code })));
        }
      }

      if (patch.testCases !== undefined) {
        await tx.delete(questionTestCases).where(eq(questionTestCases.questionId, id));
        if (patch.testCases.length > 0) {
          await tx.insert(questionTestCases).values(
            patch.testCases.map((t, i) => ({
              questionId: id,
              input: t.input,
              expectedOutput: t.expectedOutput,
              isHidden: t.isHidden ?? false,
              isSample: t.isSample ?? false,
              sortOrder: t.sortOrder ?? i,
            })),
          );
        }
      }

      const full = await tx.query.questions.findFirst({
        where: eq(questions.id, id),
        with: withChildren,
      });
      return full ? assemble(full as QuestionWithRelations) : null;
    });
  },

  async setStatus(id: string, status: QuestionStatus): Promise<QuestionDetail | null> {
    const [row] = await db
      .update(questions)
      .set({
        status,
        publishedAt: status === 'published' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id))
      .returning();
    if (!row) return null;
    const full = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: withChildren,
    });
    return full ? assemble(full as QuestionWithRelations) : null;
  },

  async delete(id: string): Promise<boolean> {
    const rows = await db
      .delete(questions)
      .where(eq(questions.id, id))
      .returning({ id: questions.id });
    return rows.length > 0;
  },

  /* ----------------------------- Bookmarks ----------------------------- */

  async addBookmark(userId: string, questionId: string): Promise<void> {
    await db.insert(questionBookmarks).values({ userId, questionId }).onConflictDoNothing();
  },

  async removeBookmark(userId: string, questionId: string): Promise<void> {
    await db
      .delete(questionBookmarks)
      .where(
        and(eq(questionBookmarks.userId, userId), eq(questionBookmarks.questionId, questionId)),
      );
  },

  async isBookmarked(userId: string, questionId: string): Promise<boolean> {
    const rows = await db
      .select({ id: questionBookmarks.id })
      .from(questionBookmarks)
      .where(
        and(eq(questionBookmarks.userId, userId), eq(questionBookmarks.questionId, questionId)),
      )
      .limit(1);
    return rows.length > 0;
  },

  async listBookmarks(
    userId: string,
    query: QuestionListQuery,
  ): Promise<PaginatedResult<QuestionDetail>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const baseWhere = and(
      eq(questionBookmarks.userId, userId),
      inArray(
        questionBookmarks.questionId,
        db.select({ id: questions.id }).from(questions).where(eq(questions.status, 'published')),
      ),
    );

    const [countRows, bookmarkRows] = await Promise.all([
      db.select({ value: count() }).from(questionBookmarks).where(baseWhere),
      db.query.questionBookmarks.findMany({
        where: eq(questionBookmarks.userId, userId),
        with: { question: { with: withChildren } },
        orderBy: [desc(questionBookmarks.createdAt)],
        offset: getOffset(page, limit),
        limit,
      }),
    ]);

    const items = bookmarkRows
      .filter((b) => b.question?.status === 'published')
      .map((b) => assemble(b.question as QuestionWithRelations, true));

    return {
      items,
      pagination: buildPaginationMeta(countRows[0]?.value ?? 0, page, limit),
    };
  },

  /* ----------------------------- Statistics ---------------------------- */

  async incrementStats(id: string, input: InternalStatsInput): Promise<QuestionDetail | null> {
    const attempted = input.attempted === true;
    const solved = input.solved === true;
    const [row] = await db
      .update(questions)
      .set({
        attemptedCount: sql`${questions.attemptedCount} + ${attempted ? 1 : 0}`,
        solvedCount: sql`${questions.solvedCount} + ${solved ? 1 : 0}`,
        acceptanceRate: sql`CASE
          WHEN ${questions.attemptedCount} + ${attempted ? 1 : 0} > 0
          THEN ROUND(((${questions.solvedCount} + ${solved ? 1 : 0})::numeric /
                      (${questions.attemptedCount} + ${attempted ? 1 : 0})) * 100, 2)::double precision
          ELSE ${questions.acceptanceRate}
        END`,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id))
      .returning();
    if (!row) return null;

    const full = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: withChildren,
    });
    return full ? assemble(full as QuestionWithRelations) : null;
  },

  async statistics(): Promise<QuestionStatistics> {
    const [totalRows, byStatus, byDifficulty, byType, attemptsRows, solvesRows] = await Promise.all(
      [
        db.select({ value: count() }).from(questions),
        db
          .select({ key: questions.status, value: count() })
          .from(questions)
          .groupBy(questions.status),
        db
          .select({ key: questions.difficulty, value: count() })
          .from(questions)
          .groupBy(questions.difficulty),
        db.select({ key: questions.type, value: count() }).from(questions).groupBy(questions.type),
        db
          .select({ value: sql<number>`COALESCE(SUM(${questions.attemptedCount}), 0)` })
          .from(questions),
        db
          .select({ value: sql<number>`COALESCE(SUM(${questions.solvedCount}), 0)` })
          .from(questions),
      ],
    );

    const toRecord = <K extends string>(
      rows: { key: string; value: number }[],
      keys: readonly K[],
    ) => {
      const record = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
      rows.forEach((r) => {
        if (r.key in record) record[r.key as K] = r.value;
      });
      return record;
    };

    const totalAttempts = attemptsRows[0]?.value ?? 0;
    const totalSolves = solvesRows[0]?.value ?? 0;

    return {
      total: totalRows[0]?.value ?? 0,
      byStatus: toRecord(byStatus, ['draft', 'published', 'archived'] as const),
      byDifficulty: toRecord(byDifficulty, ['Easy', 'Medium', 'Hard', 'Expert'] as const),
      byType: toRecord(byType, ['dsa', 'frontend', 'fullstack'] as const),
      totalAttempts,
      totalSolves,
      overallAcceptanceRate:
        totalAttempts > 0 ? Math.round((totalSolves / totalAttempts) * 10000) / 100 : 0,
    };
  },
};

export type QuestionRepository = typeof questionRepository;
