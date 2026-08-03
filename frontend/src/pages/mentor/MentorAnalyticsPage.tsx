import React from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { useToast } from '../../context/ToastContext';

export const MentorAnalyticsPage: React.FC = () => {
  const { addToast } = useToast();

  const handleExport = () => {
    addToast('success', 'Report Exported!', 'Batch Analytics PDF report generated and downloaded.');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Batch Analytics & Accreditation Reports</h1>
          <p className="text-xs text-slate-400">High-level insights on batch velocity, topic mastery, and AI quality scores.</p>
        </div>
        <Button variant="glow" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
          Export PDF Accreditation Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Batch Submission Velocity" value="482 / wk" icon={<TrendingUp className="w-5 h-5 text-indigo-400" />} subtitle="+18% month over month" />
        <StatCard title="Avg Time to Resolution" value="24.2 mins" icon={<BarChart3 className="w-5 h-5 text-cyan-400" />} subtitle="Optimal O(n) threshold" />
        <StatCard title="AI Diagnostic Pass Rate" value="91.4%" icon={<BarChart3 className="w-5 h-5 text-emerald-400" />} subtitle="WCAG AA Compliant" />
      </div>
    </div>
  );
};
