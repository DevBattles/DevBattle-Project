import React from 'react';
import { User, Code2, Flame, Trophy, Award, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8 pb-12">
      <Card className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl"
          />
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
              <Badge variant="indigo" icon={<Trophy className="w-3 h-3" />}>
                Rank #{currentUser.rank} Global
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{currentUser.bio}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {currentUser.collegeName}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {currentUser.streak} Day Streak
              </span>
              {currentUser.githubUrl && (
                <a href={currentUser.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                  <Code2 className="w-3.5 h-3.5" />
                  GitHub Profile <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-slate-800 pt-6">
          <div>
            <span className="text-2xl font-bold text-white block">{currentUser.problemsSolved}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Problems Solved</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-400 block">{currentUser.xp.toLocaleString()}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Total XP</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-amber-400 block">{currentUser.streak}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Streak</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
