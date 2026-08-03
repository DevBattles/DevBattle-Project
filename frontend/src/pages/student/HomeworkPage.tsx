import React from 'react';
import { BookOpen, Clock, User } from 'lucide-react';
import { HomeworkCard } from '../../components/domain/HomeworkCard';
import { mockHomework } from '../../data/mockData';

export const HomeworkPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Daily & Batch Homework Assignments</h1>
          </div>
          <p className="text-xs text-slate-400">
            Batch-specific problem sets assigned by your faculty mentor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHomework.map((hw) => (
          <HomeworkCard key={hw.id} homework={hw} />
        ))}
      </div>
    </div>
  );
};
