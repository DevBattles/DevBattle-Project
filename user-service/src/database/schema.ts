import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  date,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ----------------------------- Enums ----------------------------------- */

export const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
export const skillLevelEnum = pgEnum('skill_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);
export const userRoleEnum = pgEnum('user_role', ['student', 'mentor', 'admin']);

/* ----------------------------- Tables ---------------------------------- */

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    authUserId: uuid('auth_user_id').notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull().default(''),
    lastName: varchar('last_name', { length: 100 }).notNull().default(''),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    gender: genderEnum('gender'),
    dateOfBirth: date('date_of_birth'),
    role: userRoleEnum('role').notNull().default('student'),
    collegeId: uuid('college_id'),
    branchId: uuid('branch_id'),
    batchId: uuid('batch_id'),
    profileCompletion: integer('profile_completion').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    authUserIdx: uniqueIndex('users_auth_user_id_idx').on(table.authUserId),
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
    collegeIdx: index('users_college_id_idx').on(table.collegeId),
    activeIdx: index('users_active_idx').on(table.isActive),
    nameIdx: index('users_name_idx').on(table.firstName, table.lastName),
  }),
);

export const socialLinks = pgTable(
  'social_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    github: text('github'),
    linkedin: text('linkedin'),
    portfolio: text('portfolio'),
    leetcode: text('leetcode'),
    codeforces: text('codeforces'),
    hackerrank: text('hackerrank'),
  },
  (table) => ({
    userIdx: uniqueIndex('social_links_user_id_idx').on(table.userId),
  }),
);

export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    level: skillLevelEnum('level').notNull().default('beginner'),
  },
  (table) => ({
    userIdx: index('skills_user_id_idx').on(table.userId),
  }),
);

export const education = pgTable(
  'education',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    college: varchar('college', { length: 200 }).notNull(),
    branch: varchar('branch', { length: 200 }),
    degree: varchar('degree', { length: 200 }),
    startYear: integer('start_year'),
    endYear: integer('end_year'),
  },
  (table) => ({
    userIdx: index('education_user_id_idx').on(table.userId),
  }),
);

export const experience = pgTable(
  'experience',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    company: varchar('company', { length: 200 }).notNull(),
    designation: varchar('designation', { length: 200 }),
    startDate: date('start_date'),
    endDate: date('end_date'),
    description: text('description'),
  },
  (table) => ({
    userIdx: index('experience_user_id_idx').on(table.userId),
  }),
);

/* ----------------------------- Relations ------------------------------- */

export const usersRelations = relations(users, ({ one, many }) => ({
  socialLinks: one(socialLinks, {
    fields: [users.id],
    references: [socialLinks.userId],
  }),
  skills: many(skills),
  education: many(education),
  experience: many(experience),
}));

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  user: one(users, { fields: [socialLinks.userId], references: [users.id] }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  user: one(users, { fields: [education.userId], references: [users.id] }),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
  user: one(users, { fields: [experience.userId], references: [users.id] }),
}));

/* ----------------------------- Types ----------------------------------- */

export type NewUser = typeof users.$inferInsert;
export type SocialLinksRow = typeof socialLinks.$inferSelect;
export type SkillRow = typeof skills.$inferSelect;
export type EducationRow = typeof education.$inferSelect;
export type ExperienceRow = typeof experience.$inferSelect;
