import React, { useState } from 'react';
import { CheckSquare, Cpu, ExternalLink } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { mockSubmissions, mockAIReviewSample } from '../../data/mockData';
import { AIReviewCard } from '../../components/domain/AIReviewCard';

export const SubmissionsPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const columns = [
    {
      key: 'questionTitle',
      header: 'Problem',
      render: (row: any) => <span className="font-bold text-slate-200">{row.questionTitle}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={row.status === 'Accepted' ? 'emerald' : 'rose'}>{row.status}</Badge>
      ),
    },
    { key: 'language', header: 'Language' },
    { key: 'runtimeMs', header: 'Runtime', render: (row: any) => `${row.runtimeMs} ms` },
    { key: 'memoryMb', header: 'Memory', render: (row: any) => `${row.memoryMb} MB` },
    {
      key: 'aiScore',
      header: 'AI Review',
      render: (row: any) => (
        <button
          onClick={() => setSelectedReview(row.aiReview || mockAIReviewSample)}
          className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
        >
          <Cpu className="w-3.5 h-3.5" /> View Report ({row.aiReview?.overallScore || 92}/100)
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Submission Audit History</h1>
          </div>
          <p className="text-xs text-slate-400">
            Log of all executed code submissions and automated AI review diagnostics.
          </p>
        </div>
      </div>

      <Table columns={columns} data={mockSubmissions} />

      <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} maxWidth="4xl">
        {selectedReview && <AIReviewCard report={selectedReview} />}
      </Modal>
    </div>
  );
};
