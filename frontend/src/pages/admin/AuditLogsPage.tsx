import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { mockAuditLogs } from '../../data/mockData';

export const AuditLogsPage: React.FC = () => {
  const columns = [
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'actor', header: 'Actor / User', render: (row: any) => <span className="font-bold text-slate-200">{row.actor}</span> },
    { key: 'action', header: 'Action Performed' },
    { key: 'target', header: 'Target Entity' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'status', header: 'Status', render: (row: any) => <Badge variant="emerald">{row.status}</Badge> },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-slate-100">System Audit Trail Logs</h1>
        <p className="text-xs text-slate-400">Security audit log tracking administrative role changes, approvals, and data mutations.</p>
      </div>

      <Table columns={columns} data={mockAuditLogs} />
    </div>
  );
};
