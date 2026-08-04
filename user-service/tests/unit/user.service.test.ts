import { UserService, IUserRepository } from '../../src/services/user.service';
import { UserProfile, CreateUserDto } from '../../src/types';
import { Role } from '../../src/constants/roles';

const makeProfile = (over: Partial<UserProfile> = {}): UserProfile => ({
  id: 'u-1',
  authUserId: 'a-1',
  firstName: 'Aarav',
  lastName: 'Patel',
  email: 'a@b.com',
  phone: null,
  avatarUrl: null,
  bio: null,
  gender: null,
  dateOfBirth: null,
  role: Role.STUDENT,
  collegeId: null,
  branchId: null,
  batchId: null,
  profileCompletion: 0,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...over,
});

const makeRepo = (): IUserRepository => {
  const byId: Record<string, UserProfile> = {};
  const byAuth: Record<string, string> = {};

  const store = (p: UserProfile) => {
    byId[p.id] = p;
    byAuth[p.authUserId] = p.id;
    return p;
  };

  return {
    async create(dto: CreateUserDto) {
      return store(makeProfile({ authUserId: dto.authUserId, email: dto.email, role: dto.role ?? Role.STUDENT }));
    },
    async findByAuthUserId(id) {
      const pid = byAuth[id];
      return pid ? byId[pid] : null;
    },
    async findById(id) {
      return byId[id] ?? null;
    },
    async update(id, patch) {
      if (!byId[id]) return null;
      byId[id] = { ...byId[id], ...(patch as Partial<UserProfile>), id };
      return byId[id];
    },
    async delete() {
      return true;
    },
    async findMany() {
      const items = Object.values(byId);
      return {
        items,
        pagination: { page: 1, limit: items.length || 1, total: items.length, totalPages: 1, hasNext: false, hasPrev: false },
      };
    },
    async existsByAuthUserId(id) {
      return Boolean(byAuth[id]);
    },
    async existsByEmail() {
      return false;
    },
    async upsertSocialLinks(userId, data) {
      if (byId[userId]) byId[userId] = { ...byId[userId], socialLinks: data };
    },
    async replaceSkills(userId, items) {
      if (byId[userId])
        byId[userId] = {
          ...byId[userId],
          skills: items.map((s, i) => ({ id: `s-${i}`, name: s.name, level: s.level ?? 'beginner' })),
        };
    },
    async replaceEducation(userId, items) {
      if (byId[userId])
        byId[userId] = { ...byId[userId], education: items.map((e, i) => ({ id: `e-${i}`, ...e })) };
    },
    async replaceExperience(userId, items) {
      if (byId[userId])
        byId[userId] = { ...byId[userId], experience: items.map((x, i) => ({ id: `x-${i}`, ...x })) };
    },
    async getStatistics() {
      return { total: 1, students: 1, mentors: 0, admins: 0, active: 1, inactive: 0 };
    },
  };
};

describe('UserService (unit, mock repository)', () => {
  it('getMe throws when the profile is missing', async () => {
    const service = new UserService(makeRepo());
    await expect(service.getMe('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('provision is idempotent', async () => {
    const repo = makeRepo();
    const service = new UserService(repo);
    const created = await service.provision({ authUserId: 'a-1', email: 'a@b.com', role: Role.STUDENT });
    const again = await service.provision({ authUserId: 'a-1', email: 'a@b.com', role: Role.STUDENT });
    expect(created.id).toBe(again.id);
  });

  it('updateMe recomputes profile completion', async () => {
    const repo = makeRepo();
    const service = new UserService(repo);
    await service.provision({ authUserId: 'a-1', email: 'a@b.com', role: Role.STUDENT });

    const updated = await service.updateMe('a-1', {
      firstName: 'Aarav',
      lastName: 'Patel',
      bio: 'I build fullstack apps and love DSA challenges.',
      phone: '+919999999999',
      gender: 'male',
      skills: [{ name: 'React', level: 'advanced' }],
      education: [{ college: 'KRMU' }],
      socialLinks: { github: 'https://github.com/aarav' },
    });

    // 10(name)+5(email)+10(phone)+15(bio)+5(gender)+10(skills)+10(education)+5(social)=70
    expect(updated.profileCompletion).toBe(70);
  });

  it('statistics aggregates correctly', async () => {
    const service = new UserService(makeRepo());
    const stats = await service.statistics();
    expect(stats.total).toBe(1);
    expect(stats.students).toBe(1);
  });
});
