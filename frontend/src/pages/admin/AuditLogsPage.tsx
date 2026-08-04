import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';
import { AuditLog } from '../../types';

const statusVariant: Record<AuditLog['status'], 'emerald' | 'rose' | 'amber'> = {
  success: 'emerald',
  failed: 'rose',
  warning: 'amber',
};

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useData();

  const columns = [
    { key: 'timestamp', header: 'Timestamp' },
    {
      key: 'actor',
      header: 'Actor / User',
      render: (row: AuditLog) => <span className="font-bold text-slate-200">{row.actor}</span>,
    },
    { key: 'action', header: 'Action Performed' },
    { key: 'target', header: 'Target Entity' },
    { key: 'ipAddress', header: 'IP Address' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AuditLog) => <Badge variant={statusVariant[row.status] ?? 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">System Audit Trail Logs</h1>
        <p className="text-xs text-slate-400">
          Security audit log tracking sign-ins, approvals, role changes, and hierarchy mutations.
        </p>
      </div>

      <Table columns={columns} data={auditLogs} emptyMessage="No audit activity recorded yet." />
    </div>
  );
};
