import React, { useState } from 'react';
import { BarChart3, Trophy, Flame } from 'lucide-react';
import { LeaderboardCard } from '../../components/domain/LeaderboardCard';
import { mockLeaderboard } from '../../data/mockData';
import { Tabs } from '../../components/ui/Tabs';

export const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Global & College Arena Leaderboards</h1>
          </div>
          <p className="text-xs text-slate-400">
            Rankings updated live based on problem XP, speed, and streak consistency.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'global', label: 'Global Arena' },
            { id: 'college', label: 'KR Mangalam Univ' },
            { id: 'batch', label: 'Batch 2025 - Sec A' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <LeaderboardCard entries={mockLeaderboard} />
    </div>
  );
};
