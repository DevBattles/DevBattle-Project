import React from 'react';
import { FolderGit2, Play, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 'proj-1',
      title: 'Interactive Kanban Board with Framer Motion',
      type: 'Frontend Challenge',
      difficulty: 'Medium',
      tech: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      description: 'Build a production-grade drag and drop task management board with smooth animations, priority filters, and keyboard accessibility.',
      status: 'In Progress',
    },
    {
      id: 'proj-2',
      title: 'Virtual Scrollable Table with 100k Rows',
      type: 'Performance Challenge',
      difficulty: 'Hard',
      tech: ['React', 'DOM Virtualization', 'TypeScript'],
      description: 'Implement DOM windowing to render 100,000 tabular items at 60 FPS with zero layout thrashing.',
      status: 'Not Started',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100">Frontend & Fullstack Projects Arena</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-world web application challenges evaluated by automated Chrome DevTools & Lighthouse audits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <Card key={proj.id} hoverElevate glow className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{proj.type}</Badge>
                <Badge variant={proj.difficulty === 'Hard' ? 'rose' : 'amber'}>{proj.difficulty}</Badge>
              </div>

              <h3 className="text-lg font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {proj.tech.map((t) => (
                  <Badge key={t} variant="neutral" size="sm">{t}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Status: <strong className="text-indigo-400">{proj.status}</strong></span>
              <Button size="sm" variant="glow" icon={<ArrowUpRight className="w-3.5 h-3.5" />} onClick={() => navigate('/workspace/q-102')}>
                Open Web Sandbox
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
