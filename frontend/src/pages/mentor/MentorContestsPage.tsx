import React from 'react';
import { Trophy, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ContestCard } from '../../components/domain/ContestCard';
import { mockContests } from '../../data/mockData';

export const MentorContestsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Batch Contests Manager</h1>
          <p className="text-xs text-slate-400">Schedule and monitor speed coding clashes for your batches.</p>
        </div>
        <Button variant="glow" icon={<Plus className="w-4 h-4" />}>Schedule Battle</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContests.map((c) => (
          <ContestCard key={c.id} contest={c} />
        ))}
      </div>
    </div>
  );
};
