import React from 'react';
import { Award, Trophy, Zap, Flame, Cpu } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/StatCard';
import { mockAchievements } from '../../data/mockData';

export const AchievementsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Achievements & Trophy Gallery</h1>
          </div>
          <p className="text-xs text-slate-400">
            Unlock badges and earn XP rewards by solving challenges and building streaks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAchievements.map((ach) => (
          <Card key={ach.id} hoverElevate glow className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${ach.isUnlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500'}`}>
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{ach.title}</h3>
                  <p className="text-xs text-slate-400">{ach.description}</p>
                </div>
              </div>
              <Badge variant={ach.isUnlocked ? 'amber' : 'neutral'}>
                +{ach.xpReward} XP
              </Badge>
            </div>

            <ProgressBar value={ach.progress} label={ach.isUnlocked ? 'Unlocked' : `Progress (${ach.progress}%)`} color={ach.isUnlocked ? 'bg-amber-500' : 'bg-indigo-500'} />
          </Card>
        ))}
      </div>
    </div>
  );
};
