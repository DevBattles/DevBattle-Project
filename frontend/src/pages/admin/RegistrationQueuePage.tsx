import React from 'react';
import { UserCheck, Check, X, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const RegistrationQueuePage: React.FC = () => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const { addToast } = useToast();

  const handleApprove = (id: string, name: string, role: any) => {
    approveUser(id, role);
    addToast('success', 'User Approved!', `${name} has been activated as ${role.toUpperCase()}. Notification email dispatched.`);
  };

  const handleReject = (id: string, name: string) => {
    rejectUser(id);
    addToast('info', 'User Application Rejected', `${name}'s request was declined.`);
  };

  const columns = [
    { key: 'name', header: 'Applicant Name', render: (row: any) => <span className="font-bold text-slate-200">{row.name}</span> },
    { key: 'email', header: 'College Email' },
    { key: 'collegeName', header: 'College Campus' },
    { key: 'role', header: 'Requested Role', render: (row: any) => <Badge variant="indigo">{row.role.toUpperCase()}</Badge> },
    {
      key: 'actions',
      header: 'Admin Verification Action',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={<Check className="w-3.5 h-3.5" />}
            onClick={() => handleApprove(row.id, row.name, row.role)}
          >
            Approve & Assign
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<X className="w-3.5 h-3.5" />}
            onClick={() => handleReject(row.id, row.name)}
          >
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
          <p className="text-xs text-slate-400">Super admin approval required for every new student and mentor account.</p>
        </div>
      </div>

      <Table columns={columns} data={pendingUsers} emptyMessage="No pending registrations in queue. All user requests verified." />
    </div>
  );
};
