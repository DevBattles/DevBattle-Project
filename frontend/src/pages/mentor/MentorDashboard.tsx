import React from 'react';
import { BookOpen, Users, AlertTriangle, Plus, BarChart3, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { mockHomework } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, users } = useAuth();

  const batchStudents = users.filter(
    (u) => u.role === 'student' && (!currentUser?.collegeId || u.collegeId === currentUser.collegeId)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* MENTOR WELCOME */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber">Faculty Mentor Portal</Badge>
            <span className="text-xs text-slate-400">
              {currentUser?.collegeName ?? 'DevBattles'} · {currentUser?.branchName ?? 'All Departments'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100">{currentUser?.name ?? 'Mentor'}'s Dashboard</h1>
          <p className="text-xs text-slate-400">
            Managing {currentUser?.batchName ?? 'your batches'} ({batchStudents.length} Enrolled Students)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glow" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/mentor/homework-builder')}>
            Create Homework
          </Button>
          <Button variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/mentor/question-builder')}>
            Create Custom Question
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Batch Students" value={batchStudents.length} icon={<Users className="w-5 h-5 text-indigo-400" />} subtitle="Registered on your campus" />
        <StatCard title="Assigned Homework" value="3 Active" icon={<BookOpen className="w-5 h-5 text-amber-400" />} subtitle="Avg Completion 82%" />
        <StatCard title="AI Risk Alerts" value="2 Students" icon={<AlertTriangle className="w-5 h-5 text-rose-400" />} subtitle="Falling behind in DP" />
        <StatCard title="Batch Avg AI Score" value="88/100" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} subtitle="+4% vs last sprint" />
      </div>

      {/* ACTIVE HOMEWORK LIST & AI RISK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Batch Homework Status</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/mentor/homework-builder')}>+ Assign New</Button>
          </div>

          <div className="space-y-3">
            {mockHomework.map((hw) => (
              <div key={hw.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{hw.title}</h4>
                  <p className="text-xs text-slate-400">Due: {new Date(hw.dueDate).toLocaleDateString()} · {hw.submittedCount}/{hw.totalStudents} submitted</p>
                </div>
                <Badge variant={hw.status === 'graded' ? 'emerald' : 'amber'}>
                  {hw.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* AI RISK ALERT CARD */}
        <Card className="p-6 space-y-4 border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>AI At-Risk Student Warning</span>
          </div>
          <p className="text-xs text-slate-400">
            DevBattles AI identified 2 students struggling with Dynamic Programming recursion stack limits.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Vikram Mehta</span>
                <span className="text-slate-500">3 consecutive failed submissions</span>
              </div>
              <Button size="sm" variant="outline">Intervene</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
