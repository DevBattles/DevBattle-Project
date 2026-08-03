import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { AIReviewReport } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/StatCard';
import { Badge } from '../ui/Badge';

export const AIReviewCard: React.FC<{ report: AIReviewReport }> = ({ report }) => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 light:text-slate-900">DevBattles AI Code Intelligence</h3>
              <Badge variant="indigo" icon={<Sparkles className="w-3 h-3" />}>
                v3.4 Neural Engine
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Deep structural, security & performance analysis</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {report.overallScore}/100
          </div>
          <span className="text-xs text-emerald-400 font-semibold">Overall Quality Index</span>
        </div>
      </div>

      <p className="text-sm text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed light:bg-slate-50 light:border-slate-200 light:text-slate-700">
        "{report.summary}"
      </p>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Multi-Dimensional Metrics Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ProgressBar value={report.metrics.architecture} label="Architecture & Design" color="bg-indigo-500" />
          <ProgressBar value={report.metrics.performance} label="Algorithmic Performance" color="bg-emerald-500" />
          <ProgressBar value={report.metrics.readability} label="Code Readability" color="bg-cyan-500" />
          <ProgressBar value={report.metrics.security} label="Security & Safety" color="bg-purple-500" />
          <ProgressBar value={report.metrics.accessibility} label="Accessibility (WCAG)" color="bg-amber-500" />
          <ProgressBar value={report.metrics.reactBestPractices} label="React Best Practices" color="bg-sky-500" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400" />
          Actionable Code Refactoring Suggestions ({report.improvements.length})
        </h4>
        <div className="space-y-3">
          {report.improvements.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 light:bg-white light:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 light:text-slate-900">{item.title}</span>
                <Badge variant={item.severity === 'high' ? 'rose' : 'amber'} size="sm">
                  {item.category}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{item.description}</p>
              {item.suggestedCodeSnippet && (
                <div className="mt-2 text-xs font-mono p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 overflow-x-auto light:bg-slate-900 light:text-emerald-400">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-bold mb-1">
                    Suggested Code:
                  </span>
                  <code>{item.suggestedCodeSnippet}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
