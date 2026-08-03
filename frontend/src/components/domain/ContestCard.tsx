import React from 'react';
import { Trophy, Users, Clock, Flame, Award } from 'lucide-react';
import { Contest } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ContestCard: React.FC<{ contest: Contest; onRegister?: () => void }> = ({
  contest,
  onRegister,
}) => {
  const isLive = contest.status === 'live';
  const isUpcoming = contest.status === 'upcoming';

  return (
    <Card hoverElevate glow className="flex flex-col justify-between h-full relative overflow-hidden">
      {isLive && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md animate-pulse">
          ● LIVE NOW
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant={isLive ? 'rose' : isUpcoming ? 'amber' : 'neutral'}
            icon={isLive ? <Flame className="w-3 h-3 text-rose-400" /> : <Trophy className="w-3 h-3" />}
          >
            {contest.status.toUpperCase()}
          </Badge>
          {contest.batchSpecific && (
            <Badge variant="indigo" size="sm">
              {contest.batchSpecific}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2 light:text-slate-900">{contest.title}</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 light:text-slate-600">{contest.description}</p>

        {contest.prizes && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Prize Pool: {contest.prizes}</span>
          </div>
        )}
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{contest.durationMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{contest.registeredCount} Registered</span>
          </div>
        </div>

        <Button
          size="md"
          variant={isLive ? 'glow' : contest.isRegistered ? 'secondary' : 'primary'}
          className="w-full"
          onClick={onRegister}
        >
          {isLive ? 'Enter Arena Now' : contest.isRegistered ? 'Registered (View Details)' : 'Register for Contest'}
        </Button>
      </div>
    </Card>
  );
};
