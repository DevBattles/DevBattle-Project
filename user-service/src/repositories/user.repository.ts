import { eq, and, or, ilike, desc, asc, sql, count, SQL } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { db } from '../database/db';
import { users, socialLinks, skills, education, experience } from '../database/schema';
import {
  UserProfile,
  CreateUserDto,
  UpdateProfileDto,
  SearchUsersQuery,
  SocialLinks as SocialLinksType,
  Skill,
  Education as EducationType,
  Experience as ExperienceType,
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
  firstName: row.firstName ?? '',
  lastName: row.lastName ?? '',
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
  profileCompletion: row.profileCompletion ?? 0,
  isActive: row.isActive !== false,
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

/* --------------------------- File-backed Fallback --------------------------- */

const FALLBACK_DIR = '/home/user/DevBattle/database-fallback';
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'user_profiles.json');

const loadFallback = (): UserProfile[] => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_FILE)) {
      // Seed default accounts matching auth-service and seed.ts
      const defaultUsers: UserProfile[] = [
        {
          id: 'u1111111-1111-4111-8111-111111111111',
          authUserId: '11111111-1111-4111-8111-111111111111',
          firstName: 'Sarah',
          lastName: 'Connor',
          email: 'admin@devbattles.io',
          phone: null,
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          bio: 'DevBattles Platform Architect & Global Super Administrator.',
          gender: 'female',
          dateOfBirth: '1995-10-25',
          role: 'admin' as any,
          collegeId: null,
          branchId: null,
          batchId: null,
          profileCompletion: 80,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          socialLinks: {
            github: 'https://github.com/devbattles-admin',
            linkedin: 'https://linkedin.com/in/sarah',
            portfolio: null,
            leetcode: null,
            codeforces: null,
            hackerrank: null,
          },
          skills: [
            { id: 'sk-1', name: 'System Architecture', level: 'expert' as any },
            { id: 'sk-2', name: 'Go', level: 'advanced' as any },
          ],
          education: [],
          experience: [],
        },
        {
          id: 'u2222222-2222-4222-8222-222222222222',
          authUserId: '22222222-2222-4222-8222-222222222222',
          firstName: 'Aarav',
          lastName: 'Patel',
          email: 'aarav.patel@krmangalam.edu.in',
          phone: '+919876543210',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          bio: 'Fullstack Dev & DSA enthusiast. Building high performance web apps.',
          gender: 'male',
          dateOfBirth: '2004-03-12',
          role: 'student' as any,
          collegeId: 'col-1',
          branchId: 'br-cs',
          batchId: 'batch-2025-a',
          profileCompletion: 95,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          socialLinks: {
            github: 'https://github.com/aaravpatel-dev',
            linkedin: 'https://linkedin.com/in/aarav',
            portfolio: null,
            leetcode: 'https://leetcode.com/aarav',
            codeforces: null,
            hackerrank: null,
          },
          skills: [
            { id: 'sk-3', name: 'React', level: 'advanced' as any },
            { id: 'sk-4', name: 'Algorithms', level: 'intermediate' as any },
          ],
          education: [
            {
              id: 'ed-1',
              college: 'KR Mangalam University',
              branch: 'CSE',
              degree: 'B.Tech',
              startYear: 2022,
              endYear: 2026,
            },
          ],
          experience: [],
        },
        {
          id: 'u3333333-3333-4333-8333-333333333333',
          authUserId: '33333333-3333-4333-8333-333333333333',
          firstName: 'Rajesh',
          lastName: 'Sharma',
          email: 'rajesh.sharma@krmangalam.edu.in',
          phone: null,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          bio: 'Faculty mentor on DevBattles.',
          gender: 'male',
          dateOfBirth: '1975-01-10',
          role: 'mentor' as any,
          collegeId: 'col-1',
          branchId: 'br-cs',
          batchId: null,
          profileCompletion: 70,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          socialLinks: {
            github: 'https://github.com/rsharma-prof',
            linkedin: 'https://linkedin.com/in/rajesh',
            portfolio: null,
            leetcode: null,
            codeforces: null,
            hackerrank: null,
          },
          skills: [{ id: 'sk-5', name: 'Distributed Systems', level: 'expert' as any }],
          education: [],
          experience: [
            {
              id: 'ex-1',
              company: 'Amazon',
              designation: 'Senior SDE',
              startDate: '2018-01-01',
              endDate: '2023-01-01',
              description: 'Built large-scale notifications platform.',
            },
          ],
        },
      ];
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
      return defaultUsers;
    }
    const content = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading user-profile fallback:', error);
    return [];
  }
};

const saveFallback = (usersList: UserProfile[]) => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(usersList, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving user-profile fallback:', error);
  }
};

/* --------------------------- Repository Class --------------------------- */

export class UserRepository {
  /** Create the profile row when the Auth Service provisions a new account. */
  async create(dto: CreateUserDto): Promise<UserProfile> {
    try {
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
    } catch (err) {
      const list = loadFallback();
      const existing = list.find((u) => u.authUserId === dto.authUserId);
      if (existing) return existing;

      const newUser: UserProfile = {
        id: `u${dto.authUserId}`,
        authUserId: dto.authUserId,
        firstName: dto.firstName ?? '',
        lastName: dto.lastName ?? '',
        email: dto.email,
        phone: null,
        avatarUrl: null,
        bio: null,
        gender: null,
        dateOfBirth: null,
        role: (dto.role as any) ?? 'student',
        collegeId: null,
        branchId: null,
        batchId: null,
        profileCompletion: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        socialLinks: {
          github: null,
          linkedin: null,
          portfolio: null,
          leetcode: null,
          codeforces: null,
          hackerrank: null,
        },
        skills: [],
        education: [],
        experience: [],
      };
      list.push(newUser);
      saveFallback(list);
      return newUser;
    }
  }

  async findByAuthUserId(authUserId: string): Promise<UserProfile | null> {
    try {
      const row = await db.query.users.findFirst({
        where: eq(users.authUserId, authUserId),
        with: withRelations,
      });
      return row ? mapProfile(row) : null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.authUserId === authUserId) || null;
    }
  }

  async findById(id: string): Promise<UserProfile | null> {
    try {
      const row = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: withRelations,
      });
      return row ? mapProfile(row) : null;
    } catch (err) {
      const list = loadFallback();
      return list.find((u) => u.id === id) || null;
    }
  }

  async update(id: string, patch: Partial<UpdateProfileDto>): Promise<UserProfile | null> {
    try {
      const [row] = await db
        .update(users)
        .set({ ...patch, updatedAt: new Date() } as any)
        .where(eq(users.id, id))
        .returning();
      return row ? mapProfile(row) : null;
    } catch (err) {
      const list = loadFallback();
      const idx = list.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      list[idx] = {
        ...list[idx],
        ...patch,
        updatedAt: new Date().toISOString(),
      } as any;
      saveFallback(list);
      return list[idx];
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [row] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
      return Boolean(row);
    } catch (err) {
      const list = loadFallback();
      const filtered = list.filter((u) => u.id !== id);
      if (filtered.length === list.length) return false;
      saveFallback(filtered);
      return true;
    }
  }

  /** Paginated, filtered, sorted listing (used by /users and /users/search). */
  async findMany(query: SearchUsersQuery & PaginationQuery): Promise<PaginatedResult<UserProfile>> {
    try {
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
    } catch (err) {
      // Fallback matching logic
      let list = loadFallback();

      if (query.role) {
        list = list.filter((u) => u.role === query.role);
      }
      if (query.q) {
        const term = query.q.toLowerCase();
        list = list.filter(
          (u) =>
            u.firstName.toLowerCase().includes(term) ||
            u.lastName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term),
        );
      }

      const limit = query.limit ?? 20;
      const page = query.page ?? 1;
      const offset = getOffset(page, limit);

      const items = list.slice(offset, offset + limit);

      return {
        items,
        pagination: buildPaginationMeta(list.length, page, limit),
      };
    }
  }

  async existsByAuthUserId(authUserId: string): Promise<boolean> {
    try {
      const [row] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.authUserId, authUserId))
        .limit(1);
      return Boolean(row);
    } catch (err) {
      const list = loadFallback();
      return list.some((u) => u.authUserId === authUserId);
    }
  }

  async existsByEmail(email: string, exceptAuthUserId?: string): Promise<boolean> {
    try {
      const conditions = [ilike(users.email, email)];
      if (exceptAuthUserId) conditions.push(sql`${users.authUserId} <> ${exceptAuthUserId}`);
      const [row] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(...conditions))
        .limit(1);
      return Boolean(row);
    } catch (err) {
      const list = loadFallback();
      const normEmail = email.trim().toLowerCase();
      return list.some(
        (u) =>
          u.email.trim().toLowerCase() === normEmail &&
          (!exceptAuthUserId || u.authUserId !== exceptAuthUserId),
      );
    }
  }

  /* --------------------------- Sub-entities --------------------------- */

  async upsertSocialLinks(userId: string, data: SocialLinksType): Promise<void> {
    try {
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
    } catch (err) {
      const list = loadFallback();
      const idx = list.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        list[idx].socialLinks = {
          github: data.github ?? null,
          linkedin: data.linkedin ?? null,
          portfolio: data.portfolio ?? null,
          leetcode: data.leetcode ?? null,
          codeforces: data.codeforces ?? null,
          hackerrank: data.hackerrank ?? null,
        };
        saveFallback(list);
      }
    }
  }

  async replaceSkills(
    userId: string,
    items: Array<{ name: string; level?: Skill['level'] }>,
  ): Promise<void> {
    try {
      await db.delete(skills).where(eq(skills.userId, userId));
      if (items.length) {
        await db
          .insert(skills)
          .values(items.map((s) => ({ userId, name: s.name, level: s.level ?? 'beginner' })));
      }
    } catch (err) {
      const list = loadFallback();
      const idx = list.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        list[idx].skills = items.map((s, i) => ({ id: `sk-${userId}-${i}`, name: s.name, level: s.level ?? 'beginner' }));
        saveFallback(list);
      }
    }
  }

  async replaceEducation(userId: string, items: Array<Omit<EducationType, 'id'>>): Promise<void> {
    try {
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
    } catch (err) {
      const list = loadFallback();
      const idx = list.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        list[idx].education = items.map((e, i) => ({
          id: `ed-${userId}-${i}`,
          college: e.college,
          branch: e.branch ?? null,
          degree: e.degree ?? null,
          startYear: e.startYear ?? null,
          endYear: e.endYear ?? null,
        }));
        saveFallback(list);
      }
    }
  }

  async replaceExperience(userId: string, items: Array<Omit<ExperienceType, 'id'>>): Promise<void> {
    try {
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
    } catch (err) {
      const list = loadFallback();
      const idx = list.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        list[idx].experience = items.map((x, i) => ({
          id: `ex-${userId}-${i}`,
          company: x.company,
          designation: x.designation ?? null,
          startDate: x.startDate ?? null,
          endDate: x.endDate ?? null,
          description: x.description ?? null,
        }));
        saveFallback(list);
      }
    }
  }

  /* ----------------------------- Statistics --------------------------- */

  async getStatistics(): Promise<UserStatistics> {
    try {
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
    } catch (err) {
      const list = loadFallback();
      const total = list.length;
      const active = list.filter((u) => u.isActive).length;
      return {
        total,
        active,
        inactive: total - active,
        students: list.filter((u) => u.role === 'student').length,
        mentors: list.filter((u) => u.role === 'mentor').length,
        admins: list.filter((u) => u.role === 'admin').length,
      };
    }
  }
}

export const userRepository = new UserRepository();
