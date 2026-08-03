import React from 'react';
import { Cpu } from 'lucide-react';
import { AIReviewCard } from '../../components/domain/AIReviewCard';
import { mockAIReviewSample } from '../../data/mockData';

export const AIReviewsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">AI Code Review Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-dimensional code diagnostics, refactoring suggestions, and personalized learning roadmaps.
          </p>
        </div>
      </div>

      <AIReviewCard report={mockAIReviewSample} />
    </div>
  );
};
