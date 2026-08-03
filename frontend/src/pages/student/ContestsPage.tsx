import React from 'react';
import { Trophy, Flame, Award } from 'lucide-react';
import { ContestCard } from '../../components/domain/ContestCard';
import { mockContests } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const ContestsPage: React.FC = () => {
  const { addToast } = useToast();

  const handleRegister = (title: string) => {
    addToast('success', 'Registration Confirmed!', `You are registered for ${title}. Countdown active.`);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Live Coding Contests & Sprints</h1>
          </div>
          <p className="text-xs text-slate-400">
            Timed algorithmic speed battles, inter-college tournaments, and XP rewards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onRegister={() => handleRegister(contest.title)}
          />
        ))}
      </div>
    </div>
  );
};
