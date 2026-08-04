import React, { useState } from 'react';
import { Check, X, UserCheck } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Role, User } from '../../types';

export const RegistrationQueuePage: React.FC = () => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const { addToast } = useToast();

  /** Role the admin wants to grant, per applicant (defaults to the requested role). */
  const [roleOverrides, setRoleOverrides] = useState<Record<string, Role>>({});

  const resolveRole = (user: User): Role => roleOverrides[user.id] ?? user.role;

  const handleApprove = async (user: User) => {
    const assignedRole = resolveRole(user);
    const result = await approveUser(user.id, assignedRole);

    if (!result.ok) {
      addToast('error', 'Approval Failed', result.error);
      return;
    }

    addToast(
      'success',
      'User Approved!',
      `${user.name} is now an active ${assignedRole.toUpperCase()} and can sign in. Added to User Management.`
    );
  };

  const handleReject = async (user: User) => {
    const result = await rejectUser(user.id);
    if (!result.ok) {
      addToast('error', 'Action Failed', result.error);
      return;
    }
    addToast('info', 'User Application Rejected', `${user.name}'s request was declined.`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Applicant',
      render: (row: User) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
          <div>
            <span className="font-bold text-slate-200 block">{row.name}</span>
            <span className="text-[11px] text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'collegeName',
      header: 'College Campus',
      render: (row: User) => (
        <div>
          <span className="block text-slate-300">{row.collegeName || '—'}</span>
          <span className="text-[11px] text-slate-500">{row.branchName || 'Branch not set'}</span>
        </div>
      ),
    },
    { key: 'joinedAt', header: 'Applied On', render: (row: User) => <span className="text-slate-400">{row.joinedAt}</span> },
    {
      key: 'role',
      header: 'Requested Role',
      render: (row: User) => <Badge variant="indigo">{row.role.toUpperCase()}</Badge>,
    },
    {
      key: 'assign',
      header: 'Assign Role',
      render: (row: User) => (
        <select
          value={resolveRole(row)}
          onChange={(e) => setRoleOverrides((prev) => ({ ...prev, [row.id]: e.target.value as Role }))}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      key: 'actions',
      header: 'Admin Verification Action',
      render: (row: User) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" icon={<Check className="w-3.5 h-3.5" />} onClick={() => handleApprove(row)}>
            Approve & Assign
          </Button>
          <Button size="sm" variant="danger" icon={<X className="w-3.5 h-3.5" />} onClick={() => handleReject(row)}>
            Decline
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Registration Approval Queue</h1>
          <p className="text-xs text-slate-400">
            Super admin approval required for every new student and mentor account. Approved users move straight into
            User Management and can sign in immediately.
          </p>
        </div>
        <Badge variant={pendingUsers.length ? 'amber' : 'emerald'} icon={<UserCheck className="w-3.5 h-3.5" />}>
          {pendingUsers.length} Awaiting Review
        </Badge>
      </div>

      <Table
        columns={columns}
        data={pendingUsers}
        emptyMessage="No pending registrations in queue. All user requests verified."
      />
    </div>
  );
};
