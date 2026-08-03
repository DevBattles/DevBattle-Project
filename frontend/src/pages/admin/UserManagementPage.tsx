import React, { useMemo, useState } from 'react';
import { Users, RefreshCcw, Lock, Search, Ban, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { StatCard } from '../../components/ui/StatCard';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Role, User, UserStatus } from '../../types';

const statusVariant: Record<UserStatus, 'emerald' | 'amber' | 'rose' | 'neutral'> = {
  active: 'emerald',
  pending: 'amber',
  suspended: 'rose',
  rejected: 'neutral',
};

export const UserManagementPage: React.FC = () => {
  const { users, currentUser, updateUserRole, updateUserStatus } = useAuth();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [pendingSuspension, setPendingSuspension] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter))
      .filter((u) =>
        term
          ? [u.name, u.email, u.collegeName, u.branchName].some((field) => field?.toLowerCase().includes(term))
          : true
      )
      .slice()
      .sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1));
  }, [users, roleFilter, search]);

  const counts = useMemo(
    () => ({
      total: users.length,
      students: users.filter((u) => u.role === 'student').length,
      mentors: users.filter((u) => u.role === 'mentor').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    }),
    [users]
  );

  const handleSwitchRole = (user: User) => {
    // Students and mentors flip between each other; admins are left untouched here.
    const nextRole: Role = user.role === 'student' ? 'mentor' : 'student';

    if (user.role === 'admin') {
      addToast('warning', 'Action Blocked', 'Super Admin roles cannot be downgraded from this screen.');
      return;
    }

    const result = updateUserRole(user.id, nextRole);
    if (!result.ok) {
      addToast('error', 'Role Update Failed', result.error);
      return;
    }
    addToast('success', 'Role Updated', `${user.name} is now a ${nextRole.toUpperCase()}.`);
  };

  const handleToggleStatus = (user: User) => {
    if (user.status === 'suspended') {
      const result = updateUserStatus(user.id, 'active');
      if (!result.ok) {
        addToast('error', 'Action Failed', result.error);
        return;
      }
      addToast('success', 'Account Reactivated', `${user.name} can sign in again.`);
      return;
    }
    setPendingSuspension(user);
  };

  const confirmSuspension = () => {
    if (!pendingSuspension) return;
    const result = updateUserStatus(pendingSuspension.id, 'suspended');
    if (!result.ok) {
      addToast('error', 'Action Failed', result.error);
    } else {
      addToast('warning', 'Account Suspended', `${pendingSuspension.name} can no longer sign in.`);
    }
    setPendingSuspension(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (row: User) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
          <div>
            <span className="font-bold text-slate-200 block">
              {row.name}
              {row.id === currentUser?.id && <span className="ml-1.5 text-[10px] text-indigo-400">(you)</span>}
            </span>
            <span className="text-[11px] text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row: User) => (
        <Badge variant={row.role === 'admin' ? 'rose' : row.role === 'mentor' ? 'amber' : 'indigo'}>
          {row.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: User) => <Badge variant={statusVariant[row.status]}>{row.status.toUpperCase()}</Badge>,
    },
    {
      key: 'collegeName',
      header: 'College',
      render: (row: User) => (
        <div>
          <span className="block text-slate-300">{row.collegeName || '— Platform Staff —'}</span>
          <span className="text-[11px] text-slate-500">{row.batchName || row.branchName || ''}</span>
        </div>
      ),
    },
    { key: 'joinedAt', header: 'Joined', render: (row: User) => <span className="text-slate-400">{row.joinedAt}</span> },
    {
      key: 'actions',
      header: 'Admin Management',
      render: (row: User) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<RefreshCcw className="w-3.5 h-3.5" />}
            onClick={() => handleSwitchRole(row)}
          >
            {row.role === 'mentor' ? 'Make Student' : 'Make Mentor'}
          </Button>
          <Button
            size="sm"
            variant={row.status === 'suspended' ? 'primary' : 'ghost'}
            icon={row.status === 'suspended' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
            onClick={() => handleToggleStatus(row)}
            disabled={row.id === currentUser?.id}
          >
            {row.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={<Lock className="w-3.5 h-3.5" />}
            onClick={() => addToast('info', 'Reset Link Sent', `A password reset link was emailed to ${row.email}.`)}
          >
            Reset Pass
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">Global User Role Management</h1>
        <p className="text-xs text-slate-400">
          Every approved account lands here. Switch Student ↔ Mentor, suspend, or reactivate access.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Accounts" value={counts.total} icon={<Users className="w-5 h-5 text-indigo-400" />} subtitle="Active platform users" />
        <StatCard title="Students" value={counts.students} icon={<Users className="w-5 h-5 text-cyan-400" />} subtitle="Learner accounts" />
        <StatCard title="Mentors" value={counts.mentors} icon={<Users className="w-5 h-5 text-amber-400" />} subtitle="Faculty accounts" />
        <StatCard title="Suspended" value={counts.suspended} icon={<Ban className="w-5 h-5 text-rose-400" />} subtitle="Blocked from sign in" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or college..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'student', 'mentor', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        emptyMessage="No users match the current filters."
      />

      <ConfirmDialog
        isOpen={Boolean(pendingSuspension)}
        onClose={() => setPendingSuspension(null)}
        onConfirm={confirmSuspension}
        title={`Suspend ${pendingSuspension?.name ?? 'user'}?`}
        description="The account will be blocked from signing in until an admin reactivates it. This action is recorded in the audit trail."
        confirmLabel="Suspend Account"
      />
    </div>
  );
};
