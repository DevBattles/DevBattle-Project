import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface RosterRow {
  id: string;
  name: string;
  email: string;
  solved: number;
  xp: number;
  streak: number;
  aiScore: string;
  status: 'Top Performer' | 'Healthy' | 'At Risk' | 'Not Started';
}

const deriveStatus = (student: User): RosterRow['status'] => {
  if (student.problemsSolved === 0) return 'Not Started';
  if (student.problemsSolved >= 250) return 'Top Performer';
  if (student.streak <= 3 || student.problemsSolved < 60) return 'At Risk';
  return 'Healthy';
};

const statusVariant: Record<RosterRow['status'], 'amber' | 'emerald' | 'rose' | 'neutral'> = {
  'Top Performer': 'amber',
  Healthy: 'emerald',
  'At Risk': 'rose',
  'Not Started': 'neutral',
};

export const MentorStudentsPage: React.FC = () => {
  const { users, currentUser } = useAuth();
  const [search, setSearch] = useState('');

  /** Real registered students on the mentor's campus (includes newly approved accounts). */
  const students: RosterRow[] = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => u.role === 'student')
      .filter((u) => (currentUser?.collegeId ? u.collegeId === currentUser.collegeId : true))
      .filter((u) => (term ? [u.name, u.email].some((f) => f?.toLowerCase().includes(term)) : true))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        solved: u.problemsSolved,
        xp: u.xp,
        streak: u.streak,
        aiScore: u.problemsSolved === 0 ? '—' : `${Math.min(99, 60 + Math.round(u.problemsSolved / 8))}/100`,
        status: deriveStatus(u),
      }))
      .sort((a, b) => b.solved - a.solved);
  }, [users, currentUser, search]);

  const columns = [
    { key: 'name', header: 'Student Name', render: (row: RosterRow) => <span className="font-bold text-slate-200">{row.name}</span> },
    { key: 'email', header: 'College Email' },
    { key: 'solved', header: 'Problems Solved' },
    { key: 'xp', header: 'Earned XP', render: (row: RosterRow) => row.xp.toLocaleString() },
    { key: 'streak', header: 'Streak', render: (row: RosterRow) => `${row.streak} days` },
    { key: 'aiScore', header: 'Avg AI Quality Score' },
    {
      key: 'status',
      header: 'Status Indicator',
      render: (row: RosterRow) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Batch Student Roster</h1>
          <p className="text-xs text-slate-400">
            Track individual student performance and AI health indicators for {currentUser?.collegeName ?? 'your campus'}.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={students}
        emptyMessage="No students enrolled on this campus yet. Approved registrations will appear here automatically."
      />
    </div>
  );
};
