import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Role, User, UserStatus } from '../types';
import { mockPendingApprovals, mockUsers } from '../data/mockData';
import { useData } from './DataContext';
import { generateAvatar } from '../utils/avatar';
import { createId, dateNow, readStorage, writeStorage } from '../utils/storage';

/**
 * Client-side auth store.
 *
 * NOTE: this is a demo/mock identity layer - there is no backend in the repo yet, so
 * accounts and (plain) demo passwords are kept in localStorage. When the real API is
 * wired up, replace the bodies of login/register/approveUser with fetch calls and drop
 * the credential map entirely; every component only talks to the hook below.
 */

const STORAGE_KEY = 'devbattles.auth.v1';

/** Seeded demo logins shown on the sign-in screen. */
export const DEMO_ACCOUNTS: { role: Role; email: string; password: string; label: string }[] = [
  { role: 'student', email: 'aarav.patel@krmangalam.edu.in', password: 'password123', label: 'Student Demo' },
  { role: 'mentor', email: 'rajesh.sharma@krmangalam.edu.in', password: 'password123', label: 'Mentor Demo' },
  { role: 'admin', email: 'admin@devbattles.io', password: 'admin123', label: 'Super Admin Demo' },
];

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, 'admin'>;
  collegeId: string;
  branchName?: string;
  batchName?: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  /** Convenience alias - falls back to 'student' when signed out. */
  role: Role;
  users: User[];
  pendingUsers: User[];
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  register: (input: RegisterInput) => AuthResult;
  approveUser: (userId: string, assignedRole: Role) => AuthResult;
  rejectUser: (userId: string) => AuthResult;
  updateUserStatus: (userId: string, status: UserStatus) => AuthResult;
  updateUserRole: (userId: string, role: Role) => AuthResult;
  updateProfile: (patch: Partial<User>) => void;
}

interface PersistedAuth {
  users: User[];
  pendingUsers: User[];
  credentials: Record<string, string>;
  currentUserId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const seedCredentials = (): Record<string, string> => {
  const creds: Record<string, string> = {};
  mockUsers.forEach((u) => {
    creds[normalizeEmail(u.email)] = u.role === 'admin' ? 'admin123' : 'password123';
  });
  // Seeded pending applicants can sign in as soon as an admin approves them.
  mockPendingApprovals.forEach((u) => {
    creds[normalizeEmail(u.email)] = 'password123';
  });
  return creds;
};

const seedAuth = (): PersistedAuth => ({
  users: mockUsers,
  pendingUsers: mockPendingApprovals,
  credentials: seedCredentials(),
  currentUserId: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colleges, addAuditLog } = useData();

  const [state, setState] = useState<PersistedAuth>(() => {
    const stored = readStorage<PersistedAuth | null>(STORAGE_KEY, null);
    if (stored && Array.isArray(stored.users) && Array.isArray(stored.pendingUsers)) {
      return { ...seedAuth(), ...stored, credentials: { ...seedCredentials(), ...stored.credentials } };
    }
    return seedAuth();
  });

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const { users, pendingUsers, credentials, currentUserId } = state;

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const findByEmail = useCallback(
    (email: string) => {
      const key = normalizeEmail(email);
      return {
        active: users.find((u) => normalizeEmail(u.email) === key),
        pending: pendingUsers.find((u) => normalizeEmail(u.email) === key),
      };
    },
    [users, pendingUsers]
  );

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const key = normalizeEmail(email);
      if (!key) return { ok: false, error: 'Please enter your college email address.' };
      if (!password) return { ok: false, error: 'Please enter your password.' };

      const { active, pending } = findByEmail(key);

      if (pending) {
        return {
          ok: false,
          error: 'Your account is still awaiting Super Admin approval. You will be notified once verified.',
        };
      }

      if (!active) {
        return { ok: false, error: 'No DevBattles account found for this email. Please register first.' };
      }

      if (credentials[key] !== password) {
        return { ok: false, error: 'Incorrect password. Please try again.' };
      }

      if (active.status === 'suspended') {
        return { ok: false, error: 'This account has been suspended by the administrator.' };
      }

      if (active.status === 'rejected') {
        return { ok: false, error: 'This registration was declined by the administrator.' };
      }

      setState((prev) => ({ ...prev, currentUserId: active.id }));
      addAuditLog({ actor: active.name, action: 'User Signed In', target: `${active.role.toUpperCase()} session` });

      return { ok: true, user: active };
    },
    [addAuditLog, credentials, findByEmail]
  );

  const logout = useCallback(() => {
    if (currentUser) {
      addAuditLog({ actor: currentUser.name, action: 'User Signed Out', target: 'Session terminated' });
    }
    setState((prev) => ({ ...prev, currentUserId: null }));
  }, [addAuditLog, currentUser]);

  const register = useCallback(
    (input: RegisterInput): AuthResult => {
      const name = input.name.trim();
      const email = normalizeEmail(input.email);

      if (!name) return { ok: false, error: 'Full name is required.' };
      if (!email) return { ok: false, error: 'College email is required.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
      if (input.password.length < 6) return { ok: false, error: 'Password must be at least 6 characters long.' };

      const { active, pending } = findByEmail(email);
      if (active) return { ok: false, error: 'An account with this email already exists. Try signing in.' };
      if (pending) return { ok: false, error: 'A registration with this email is already awaiting approval.' };

      const college = colleges.find((c) => c.id === input.collegeId);

      const applicant: User = {
        id: createId('usr'),
        name,
        email,
        avatar: generateAvatar(name),
        role: input.role,
        status: 'pending',
        collegeId: college?.id,
        collegeName: college?.name,
        branchName: input.branchName,
        batchName: input.batchName,
        joinedAt: dateNow(),
        xp: 0,
        rank: 0,
        streak: 0,
        problemsSolved: 0,
        bio:
          input.role === 'mentor'
            ? 'Faculty mentor on DevBattles.'
            : 'New DevBattles challenger. Starting the journey!',
      };

      setState((prev) => ({
        ...prev,
        pendingUsers: [...prev.pendingUsers, applicant],
        credentials: { ...prev.credentials, [email]: input.password },
      }));

      addAuditLog({
        actor: name,
        action: 'Submitted Registration Request',
        target: `${college?.name ?? 'Unassigned campus'} (${input.role.toUpperCase()})`,
        status: 'warning',
      });

      return { ok: true, user: applicant };
    },
    [addAuditLog, colleges, findByEmail]
  );

  const approveUser = useCallback(
    (userId: string, assignedRole: Role): AuthResult => {
      const applicant = pendingUsers.find((u) => u.id === userId);
      if (!applicant) return { ok: false, error: 'Registration request not found.' };

      const approved: User = {
        ...applicant,
        role: assignedRole,
        status: 'active',
        joinedAt: applicant.joinedAt || dateNow(),
      };

      setState((prev) => ({
        ...prev,
        pendingUsers: prev.pendingUsers.filter((u) => u.id !== userId),
        users: [...prev.users, approved],
      }));

      addAuditLog({
        actor: currentUser?.name ?? 'Super Admin',
        action: 'Approved User Registration',
        target: `${approved.name} (${assignedRole.toUpperCase()})`,
      });

      return { ok: true, user: approved };
    },
    [addAuditLog, currentUser, pendingUsers]
  );

  const rejectUser = useCallback(
    (userId: string): AuthResult => {
      const applicant = pendingUsers.find((u) => u.id === userId);
      if (!applicant) return { ok: false, error: 'Registration request not found.' };

      setState((prev) => ({
        ...prev,
        pendingUsers: prev.pendingUsers.filter((u) => u.id !== userId),
      }));

      addAuditLog({
        actor: currentUser?.name ?? 'Super Admin',
        action: 'Declined User Registration',
        target: applicant.name,
        status: 'warning',
      });

      return { ok: true, user: applicant };
    },
    [addAuditLog, currentUser, pendingUsers]
  );

  const updateUserStatus = useCallback(
    (userId: string, status: UserStatus): AuthResult => {
      const user = users.find((u) => u.id === userId);
      if (!user) return { ok: false, error: 'User not found.' };

      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        // A suspended user must not keep an active session.
        currentUserId: status === 'active' || prev.currentUserId !== userId ? prev.currentUserId : null,
      }));

      addAuditLog({
        actor: currentUser?.name ?? 'Super Admin',
        action: status === 'suspended' ? 'Suspended User Account' : 'Reactivated User Account',
        target: user.name,
        status: status === 'suspended' ? 'warning' : 'success',
      });

      return { ok: true, user: { ...user, status } };
    },
    [addAuditLog, currentUser, users]
  );

  const updateUserRole = useCallback(
    (userId: string, role: Role): AuthResult => {
      const user = users.find((u) => u.id === userId);
      if (!user) return { ok: false, error: 'User not found.' };
      if (user.role === role) return { ok: false, error: `${user.name} already has the ${role} role.` };

      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === userId ? { ...u, role } : u)),
      }));

      addAuditLog({
        actor: currentUser?.name ?? 'Super Admin',
        action: 'Changed User Role',
        target: `${user.name}: ${user.role.toUpperCase()} → ${role.toUpperCase()}`,
      });

      return { ok: true, user: { ...user, role } };
    },
    [addAuditLog, currentUser, users]
  );

  const updateProfile = useCallback((patch: Partial<User>) => {
    setState((prev) =>
      prev.currentUserId
        ? {
            ...prev,
            users: prev.users.map((u) => (u.id === prev.currentUserId ? { ...u, ...patch } : u)),
          }
        : prev
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        role: currentUser?.role ?? 'student',
        users,
        pendingUsers,
        login,
        logout,
        register,
        approveUser,
        rejectUser,
        updateUserStatus,
        updateUserRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
