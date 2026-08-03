import React from 'react';
import { Code2, Cpu, Trophy, BookOpen, Building2, BarChart3, Shield, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="indigo">Deep Platform Capabilities</Badge>
          <h1 className="text-4xl font-black text-white">Full Feature Capabilities</h1>
          <p className="text-slate-400 text-sm">
            Discover why DevBattles sets the new standard for AI-powered learning and competitive coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card hoverElevate glow className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Code2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">VS Code + Chrome DevTools IDE</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Featuring full Monaco Editor integration with multi-language linting, custom test case builders, memory execution profilers, and dual-mode support (DSA algorithms vs. Frontend Live Web Preview with Lighthouse metrics).
            </p>
            <Button size="sm" variant="glow" onClick={() => navigate('/workspace/q-101')}>
              Launch IDE
            </Button>
          </Card>

          <Card hoverElevate glow className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Multi-Dimensional AI Diagnostics</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant feedback across 9 distinct technical dimensions including Architecture, Algorithmic Time/Space Complexity, Naming Conventions, React Best Practices, and Security vulnerabilities.
            </p>
            <Button size="sm" variant="primary" onClick={() => navigate('/ai-reviews')}>
              View AI Reports
            </Button>
          </Card>

          <Card hoverElevate glow className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Live College Battles & Contests</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule batch-level or platform-wide competitive coding Sprints. Automated live scoring, anti-cheat detection, and real-time rank updates.
            </p>
            <Button size="sm" variant="secondary" onClick={() => navigate('/contests')}>
              View Live Contests
            </Button>
          </Card>

          <Card hoverElevate glow className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">College Batch Hierarchy & Governance</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured administration connecting Colleges, Branches, Batches, Mentors, and Students with granular role-based permissions and registration queues.
            </p>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/colleges')}>
              Explore College Management
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};
