import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Footer } from '../../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="indigo">Our Mission</Badge>
          <h1 className="text-4xl font-black text-white">Empowering the Next Generation of Developers</h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            DevBattles was founded to bridge the gap between academic computer science theory and real-world production engineering through AI-guided deliberate practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Card className="p-6">
            <span className="text-3xl font-black text-cyan-400 block mb-1">2024</span>
            <span className="text-xs text-slate-400 uppercase font-bold">Founded</span>
          </Card>
          <Card className="p-6">
            <span className="text-3xl font-black text-indigo-400 block mb-1">180+</span>
            <span className="text-xs text-slate-400 uppercase font-bold">College Campuses</span>
          </Card>
          <Card className="p-6">
            <span className="text-3xl font-black text-emerald-400 block mb-1">2.4M</span>
            <span className="text-xs text-slate-400 uppercase font-bold">Submissions Reviewed</span>
          </Card>
        </div>

        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">The DevBattles Philosophy</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Traditional grading systems rely solely on pass/fail unit tests or manual mentor review backlogs. DevBattles transforms learning by combining instantaneous neural code reviews with peer competition and batch-aligned curriculum.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
