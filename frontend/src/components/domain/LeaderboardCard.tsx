import React from 'react';
import { Trophy, Flame, Award, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const LeaderboardCard: React.FC<{ entries: any[] }> = ({ entries }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between light:bg-slate-100 light:border-slate-200">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Top Developers Arena</h3>
        </div>
        <Badge variant="amber" icon={<Flame className="w-3 h-3 text-amber-400" />}>
          Weekly Ranked
        </Badge>
      </div>

      <div className="divide-y divide-slate-800/60 light:divide-slate-200">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              'p-3.5 flex items-center justify-between transition-colors',
              entry.isCurrentUser
                ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500 light:bg-indigo-50/80'
                : 'hover:bg-slate-800/30'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                  entry.rank === 1
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : entry.rank === 2
                    ? 'bg-slate-300 text-slate-950 font-black'
                    : entry.rank === 3
                    ? 'bg-amber-700 text-white font-black'
                    : 'bg-slate-800 text-slate-400 light:bg-slate-200 light:text-slate-700'
                )}
              >
                {entry.rank}
              </span>

              <img
                src={entry.avatar}
                alt={entry.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              />

              <div>
                <h4 className="text-sm font-bold text-slate-200 light:text-slate-900 flex items-center gap-1.5">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">
                      YOU
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400">{entry.college}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="font-bold text-indigo-400 block">{entry.xp.toLocaleString()} XP</span>
                <span className="text-slate-500">{entry.solved} solved</span>
              </div>
              <div className="flex items-center text-amber-400 font-bold gap-1 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {entry.streak}d
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
