import { eq, and, or, ilike, desc, asc, sql, count, SQL } from 'drizzle-orm';
import { db } from '../database/db';
import { users, socialLinks, skills, education, experience } from '../database/schema';
import {
  UserProfile,
  CreateUserDto,
  UpdateProfileDto,
  SearchUsersQuery,
  SocialLinks,
  Skill,
  Education,
  Experience,
  UserStatistics,
} from '../types';
import {
  PaginationQuery,
  getOffset,
  buildPaginationMeta,
  PaginatedResult,
  sanitizeSortColumn,
} from '../utils/pagination';

const SORTABLE_COLUMNS = ['firstName', 'lastName', 'email', 'createdAt', 'profileCompletion'];

const mapProfile = (row: any): UserProfile => ({
  id: row.id,
  authUserId: row.authUserId,
  firstName: row.firstName,
  lastName: row.lastName,
  email: row.email,
  phone: row.phone ?? null,
  avatarUrl: row.avatarUrl ?? null,
  bio: row.bio ?? null,
  gender: row.gender ?? null,
  dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth).toISOString().slice(0, 10) : null,
  role: row.role,
  collegeId: row.collegeId ?? null,
  branchId: row.branchId ?? null,
  batchId: row.batchId ?? null,
  profileCompletion: row.profileCompletion,
  isActive: row.isActive,
  createdAt: new Date(row.createdAt).toISOString(),
  updatedAt: new Date(row.updatedAt).toISOString(),
  socialLinks: row.socialLinks
    ? {
        github: row.socialLinks.github ?? null,
        linkedin: row.socialLinks.linkedin ?? null,
        portfolio: row.socialLinks.portfolio ?? null,
        leetcode: row.socialLinks.leetcode ?? null,
        codeforces: row.socialLinks.codeforces ?? null,
        hackerrank: row.socialLinks.hackerrank ?? null,
      }
    : null,
  skills: Array.isArray(row.skills)
    ? row.skills.map((s: any) => ({ id: s.id, name: s.name, level: s.level }))
    : undefined,
  education: Array.isArray(row.education)
    ? row.education.map((e: any) => ({
        id: e.id,
        college: e.college,
        branch: e.branch ?? null,
        degree: e.degree ?? null,
        startYear: e.startYear ?? null,
        endYear: e.endYear ?? null,
      }))
    : undefined,
  experience: Array.isArray(row.experience)
    ? row.experience.map((x: any) => ({
        id: x.id,
        company: x.company,
        designation: x.designation ?? null,
        startDate: x.startDate ? new Date(x.startDate).toISOString().slice(0, 10) : null,
        endDate: x.endDate ? new Date(x.endDate).toISOString().slice(0, 10) : null,
        description: x.description ?? null,
      }))
    : undefined,
});

const withRelations = {
  socialLinks: true,
  skills: true,
  education: true,
  experience: true,
} as const;

export class UserRepository {
  /** Create the profile row when the Auth Service provisions a new account. */
  async create(dto: CreateUserDto): Promise<UserProfile> {
    const [row] = await db
      .insert(users)
      .values({
        authUserId: dto.authUserId,
        email: dto.email,
        firstName: dto.firstName ?? '',
        lastName: dto.lastName ?? '',
        role: dto.role ?? 'student',
      })
      .returning();
    return mapProfile(row);
  }

  async findByAuthUserId(authUserId: string): Promise<UserProfile | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.authUserId, authUserId),
      with: withRelations,
    });
    return row ? mapProfile(row) : null;
  }

  async findById(id: string): Promise<UserProfile | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: withRelations,
    });
    return row ? mapProfile(row) : null;
  }

  async update(id: string, patch: Partial<UpdateProfileDto>): Promise<UserProfile | null> {
    const [row] = await db
      .update(users)
      .set({ ...patch, updatedAt: new Date() } as any)
      .where(eq(users.id, id))
      .returning();
    return row ? mapProfile(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const [row] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return Boolean(row);
  }

  /** Paginated, filtered, sorted listing (used by /users and /users/search). */
  async findMany(query: SearchUsersQuery & PaginationQuery): Promise<PaginatedResult<UserProfile>> {
    const conditions: SQL[] = [];

    if (query.q) {
      const term = `%${query.q}%`;
      conditions.push(
        or(ilike(users.firstName, term), ilike(users.lastName, term), ilike(users.email, term))!,
      );
    }
    if (query.role) conditions.push(eq(users.role, query.role));
    if (query.collegeId) conditions.push(eq(users.collegeId, query.collegeId));
    if (query.branchId) conditions.push(eq(users.branchId, query.branchId));
    if (query.batchId) conditions.push(eq(users.batchId, query.batchId));

    const where = conditions.length ? and(...conditions) : undefined;
    const sortColumn = sanitizeSortColumn(query.sortBy, SORTABLE_COLUMNS, 'createdAt');
    const orderFn = query.sortOrder === 'asc' ? asc : desc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderExpr = (users as any)[sortColumn];

    const [rows, totalResult] = await Promise.all([
      db.query.users.findMany({
        where,
        orderBy: orderFn(orderExpr),
        limit: query.limit,
        offset: getOffset(query.page, query.limit),
      }),
      db.select({ value: count() }).from(users).where(where),
    ]);

    const items = rows.map((r) => mapProfile(r));
    return {
      items,
      pagination: buildPaginationMeta(totalResult[0].value, query.page, query.limit),
    };
  }

  async existsByAuthUserId(authUserId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authUserId, authUserId))
      .limit(1);
    return Boolean(row);
  }

  async existsByEmail(email: string, exceptAuthUserId?: string): Promise<boolean> {
    const conditions = [ilike(users.email, email)];
    if (exceptAuthUserId) conditions.push(sql`${users.authUserId} <> ${exceptAuthUserId}`);
    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(...conditions))
      .limit(1);
    return Boolean(row);
  }

  /* --------------------------- Sub-entities --------------------------- */

  async upsertSocialLinks(userId: string, data: SocialLinks): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.userId, userId));
    await db.insert(socialLinks).values({
      userId,
      github: data.github ?? null,
      linkedin: data.linkedin ?? null,
      portfolio: data.portfolio ?? null,
      leetcode: data.leetcode ?? null,
      codeforces: data.codeforces ?? null,
      hackerrank: data.hackerrank ?? null,
    });
  }

  async replaceSkills(
    userId: string,
    items: Array<{ name: string; level?: Skill['level'] }>,
  ): Promise<void> {
    await db.delete(skills).where(eq(skills.userId, userId));
    if (items.length) {
      await db
        .insert(skills)
        .values(items.map((s) => ({ userId, name: s.name, level: s.level ?? 'beginner' })));
    }
  }

  async replaceEducation(userId: string, items: Array<Omit<Education, 'id'>>): Promise<void> {
    await db.delete(education).where(eq(education.userId, userId));
    if (items.length) {
      await db.insert(education).values(
        items.map((e) => ({
          userId,
          college: e.college,
          branch: e.branch ?? null,
          degree: e.degree ?? null,
          startYear: e.startYear ?? null,
          endYear: e.endYear ?? null,
        })),
      );
    }
  }

  async replaceExperience(userId: string, items: Array<Omit<Experience, 'id'>>): Promise<void> {
    await db.delete(experience).where(eq(experience.userId, userId));
    if (items.length) {
      await db.insert(experience).values(
        items.map((x) => ({
          userId,
          company: x.company,
          designation: x.designation ?? null,
          startDate: x.startDate ? new Date(x.startDate).toISOString().slice(0, 10) : null,
          endDate: x.endDate ? new Date(x.endDate).toISOString().slice(0, 10) : null,
          description: x.description ?? null,
        })),
      );
    }
  }

  /* ----------------------------- Statistics --------------------------- */

  async getStatistics(): Promise<UserStatistics> {
    const [total, active, students, mentors, admins] = await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(users).where(eq(users.isActive, true)),
      db.select({ value: count() }).from(users).where(eq(users.role, 'student')),
      db.select({ value: count() }).from(users).where(eq(users.role, 'mentor')),
      db.select({ value: count() }).from(users).where(eq(users.role, 'admin')),
    ]);

    const totalCount = Number(total[0].value);
    const activeCount = Number(active[0].value);
    return {
      total: totalCount,
      active: activeCount,
      inactive: totalCount - activeCount,
      students: Number(students[0].value),
      mentors: Number(mentors[0].value),
      admins: Number(admins[0].value),
    };
  }
}

export const userRepository = new UserRepository();
