import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  doublePrecision,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ----------------------------- Enums ----------------------------------- */
/**
 * Difficulty and problem type values are aligned with the DevBattle frontend
 * data model (frontend/src/types) so the API can be consumed without mapping.
 */
export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard', 'Expert']);
export const problemTypeEnum = pgEnum('problem_type', ['dsa', 'frontend', 'fullstack']);
export const questionStatusEnum = pgEnum('question_status', ['draft', 'published', 'archived']);

/* ----------------------------- Tables ---------------------------------- */

export const questions = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description').notNull(),
    type: problemTypeEnum('type').notNull().default('dsa'),
    difficulty: difficultyEnum('difficulty').notNull().default('Medium'),
    category: varchar('category', { length: 100 }).notNull().default('General'),
    tags: text('tags').array().notNull().default([]),
    companies: text('companies').array().notNull().default([]),
    technology: text('technology').array().notNull().default([]),
    requirements: text('requirements').array().notNull().default([]),
    constraints: text('constraints').array().notNull().default([]),
    acceptanceRate: doublePrecision('acceptance_rate').notNull().default(0),
    estimatedMinutes: integer('estimated_minutes').notNull().default(30),
    timeLimitMs: integer('time_limit_ms').notNull().default(2000),
    memoryLimitMb: integer('memory_limit_mb').notNull().default(256),
    isPremium: boolean('is_premium').notNull().default(false),
    status: questionStatusEnum('status').notNull().default('draft'),
    /** auth_user_id of the mentor/admin who authored the question. */
    createdBy: uuid('created_by').notNull(),
    attemptedCount: integer('attempted_count').notNull().default(0),
    solvedCount: integer('solved_count').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('questions_slug_idx').on(table.slug),
    statusIdx: index('questions_status_idx').on(table.status),
    difficultyIdx: index('questions_difficulty_idx').on(table.difficulty),
    typeIdx: index('questions_type_idx').on(table.type),
    categoryIdx: index('questions_category_idx').on(table.category),
    createdByIdx: index('questions_created_by_idx').on(table.createdBy),
    titleIdx: index('questions_title_idx').on(table.title),
  }),
);

export const questionExamples = pgTable(
  'question_examples',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    input: text('input').notNull(),
    output: text('output').notNull(),
    explanation: text('explanation'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => ({
    questionIdx: index('question_examples_question_id_idx').on(table.questionId),
  }),
);

export const questionStarterCodes = pgTable(
  'question_starter_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    language: varchar('language', { length: 50 }).notNull(),
    code: text('code').notNull(),
  },
  (table) => ({
    questionLanguageIdx: uniqueIndex('question_starter_codes_question_language_idx').on(
      table.questionId,
      table.language,
    ),
  }),
);

export const questionTestCases = pgTable(
  'question_test_cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    input: text('input').notNull(),
    expectedOutput: text('expected_output').notNull(),
    isHidden: boolean('is_hidden').notNull().default(false),
    isSample: boolean('is_sample').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => ({
    questionIdx: index('question_test_cases_question_id_idx').on(table.questionId),
  }),
);

export const questionBookmarks = pgTable(
  'question_bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** auth_user_id of the user who bookmarked the question. */
    userId: uuid('user_id').notNull(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userQuestionIdx: uniqueIndex('question_bookmarks_user_question_idx').on(
      table.userId,
      table.questionId,
    ),
    userIdIdx: index('question_bookmarks_user_id_idx').on(table.userId),
  }),
);

/* ----------------------------- Relations ------------------------------- */

export const questionsRelations = relations(questions, ({ many }) => ({
  examples: many(questionExamples),
  starterCodes: many(questionStarterCodes),
  testCases: many(questionTestCases),
  bookmarks: many(questionBookmarks),
}));

export const questionExamplesRelations = relations(questionExamples, ({ one }) => ({
  question: one(questions, { fields: [questionExamples.questionId], references: [questions.id] }),
}));

export const questionStarterCodesRelations = relations(questionStarterCodes, ({ one }) => ({
  question: one(questions, {
    fields: [questionStarterCodes.questionId],
    references: [questions.id],
  }),
}));

export const questionTestCasesRelations = relations(questionTestCases, ({ one }) => ({
  question: one(questions, {
    fields: [questionTestCases.questionId],
    references: [questions.id],
  }),
}));

export const questionBookmarksRelations = relations(questionBookmarks, ({ one }) => ({
  question: one(questions, {
    fields: [questionBookmarks.questionId],
    references: [questions.id],
  }),
}));

/* ----------------------------- Types ----------------------------------- */

export type NewQuestion = typeof questions.$inferInsert;
export type QuestionRow = typeof questions.$inferSelect;
export type ExampleRow = typeof questionExamples.$inferSelect;
export type StarterCodeRow = typeof questionStarterCodes.$inferSelect;
export type TestCaseRow = typeof questionTestCases.$inferSelect;
export type BookmarkRow = typeof questionBookmarks.$inferSelect;
