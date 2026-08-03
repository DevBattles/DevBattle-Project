import React from 'react';
import { Users, BarChart3, Mail } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { mockUsers } from '../../data/mockData';

export const MentorStudentsPage: React.FC = () => {
  const students = [
    { id: '1', name: 'Aarav Patel', email: 'aarav@krmangalam.edu.in', solved: 142, xp: 4850, streak: 28, aiScore: '92/100', status: 'Healthy' },
    { id: '2', name: 'Neha Gupta', email: 'neha@krmangalam.edu.in', solved: 341, xp: 12850, streak: 62, aiScore: '96/100', status: 'Top Performer' },
    { id: '3', name: 'Vikram Mehta', email: 'vikram@krmangalam.edu.in', solved: 48, xp: 1200, streak: 2, aiScore: '68/100', status: 'At Risk' },
  ];

  const columns = [
    { key: 'name', header: 'Student Name', render: (row: any) => <span className="font-bold text-slate-200">{row.name}</span> },
    { key: 'email', header: 'College Email' },
    { key: 'solved', header: 'Problems Solved' },
    { key: 'xp', header: 'Earned XP' },
    { key: 'aiScore', header: 'Avg AI Quality Score' },
    {
      key: 'status',
      header: 'Status Indicator',
      render: (row: any) => (
        <Badge variant={row.status === 'At Risk' ? 'rose' : row.status === 'Top Performer' ? 'amber' : 'emerald'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Batch Student Roster</h1>
          <p className="text-xs text-slate-400">Track individual student performance and AI health indicators.</p>
        </div>
      </div>

      <Table columns={columns} data={students} />
    </div>
  );
};
