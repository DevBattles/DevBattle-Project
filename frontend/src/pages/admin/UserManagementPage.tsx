import React from 'react';
import { Users, Shield, RefreshCcw, Lock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { mockUsers } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const UserManagementPage: React.FC = () => {
  const { addToast } = useToast();

  const handleSwitchRole = (name: string) => {
    addToast('success', 'Role Updated', `Role modified for ${name}.`);
  };

  const columns = [
    { key: 'name', header: 'User Name', render: (row: any) => <span className="font-bold text-slate-200">{row.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (row: any) => <Badge variant={row.role === 'admin' ? 'rose' : row.role === 'mentor' ? 'amber' : 'indigo'}>{row.role.toUpperCase()}</Badge> },
    { key: 'collegeName', header: 'College' },
    {
      key: 'actions',
      header: 'Admin Management',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={<RefreshCcw className="w-3.5 h-3.5" />} onClick={() => handleSwitchRole(row.name)}>
            Switch Role
          </Button>
          <Button size="sm" variant="ghost" icon={<Lock className="w-3.5 h-3.5" />}>
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
        <p className="text-xs text-slate-400">Manage user roles, switch Student ↔ Mentor, suspend, or deactivate accounts.</p>
      </div>

      <Table columns={columns} data={mockUsers} />
    </div>
  );
};
