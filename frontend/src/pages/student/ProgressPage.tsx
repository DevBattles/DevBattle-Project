import React from 'react';
import { Award, Zap, TrendingUp, Cpu, Flame } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';

export const ProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const radarData = [
    { subject: 'Arrays & Maps', score: 95 },
    { subject: 'Two Pointers', score: 88 },
    { subject: 'Trees & Graphs', score: 72 },
    { subject: 'Dynamic Prog', score: 65 },
    { subject: 'React & UI', score: 92 },
    { subject: 'System Design', score: 80 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Skill Proficiency Radar & Roadmap</h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-subject technical assessment based on completed challenges and AI diagnostics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-100 mb-2">Technical Skill Matrix Radar</h3>
          <p className="text-xs text-slate-400 mb-4">Strength across core computer science competencies</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#64748b" />
                <Radar name={currentUser?.name.split(' ')[0] ?? 'You'} dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Topic Mastery Breakdown</h3>
          <div className="space-y-3">
            <ProgressBar value={95} label="Arrays & Hash Tables" color="bg-emerald-500" />
            <ProgressBar value={88} label="Two Pointers & Sliding Window" color="bg-cyan-500" />
            <ProgressBar value={92} label="React Architecture & State" color="bg-indigo-500" />
            <ProgressBar value={80} label="System Design & Rate Limiters" color="bg-purple-500" />
            <ProgressBar value={65} label="Dynamic Programming & Memoization" color="bg-amber-500" />
          </div>
        </Card>
      </div>
    </div>
  );
};
