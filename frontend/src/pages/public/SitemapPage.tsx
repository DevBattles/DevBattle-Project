import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, Code2, Users, Building2, BookOpen, Trophy, Cpu } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Footer } from '../../components/layout/Footer';

export const SitemapPage: React.FC = () => {
  const publicPages = [
    { name: 'Landing Page (Hero & 3D Canvas)', path: '/' },
    { name: 'Features Matrix', path: '/features' },
    { name: 'About Mission', path: '/about' },
    { name: 'Contact Engineering', path: '/contact' },
    { name: 'Tiered Pricing', path: '/pricing' },
    { name: 'FAQ Accordions', path: '/faq' },
    { name: 'Login Portal', path: '/login' },
    { name: 'Register Portal', path: '/register' },
    { name: 'Forgot Password', path: '/forgot-password' },
    { name: 'Email Verification', path: '/email-verification' },
  ];

  const studentPages = [
    { name: 'Student Dashboard', path: '/dashboard' },
    { name: 'Question Bank (DSA + Frontend)', path: '/questions' },
    { name: 'Monaco Coding IDE', path: '/workspace/q-101' },
    { name: 'Daily Homework', path: '/homework' },
    { name: 'Coding Contests', path: '/contests' },
    { name: 'Projects Arena', path: '/projects' },
    { name: 'Submissions History', path: '/submissions' },
    { name: 'Global Leaderboard', path: '/leaderboard' },
    { name: 'Progress & Skill Radar', path: '/progress' },
    { name: 'AI Review Reports', path: '/ai-reviews' },
    { name: 'Achievements & Badges', path: '/achievements' },
    { name: 'Calendar Schedule', path: '/calendar' },
    { name: 'Notifications Feed', path: '/notifications' },
    { name: 'User Profile', path: '/profile' },
    { name: 'Account Settings', path: '/settings' },
  ];

  const mentorPages = [
    { name: 'Mentor Overview', path: '/mentor' },
    { name: 'Homework Builder', path: '/mentor/homework-builder' },
    { name: 'Question Builder', path: '/mentor/question-builder' },
    { name: 'Contests Manager', path: '/mentor/contests' },
    { name: 'Students Roster', path: '/mentor/students' },
    { name: 'Batch Analytics', path: '/mentor/analytics' },
  ];

  const adminPages = [
    { name: 'Super Admin Overview', path: '/admin' },
    { name: 'Registration Approval Queue', path: '/admin/approvals' },
    { name: 'User Role Management', path: '/admin/users' },
    { name: 'College Branch Hierarchy', path: '/admin/colleges' },
    { name: 'Audit Trail Logs', path: '/admin/audit-logs' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="indigo">Platform Architecture Map</Badge>
          <h1 className="text-4xl font-black text-white">Sitemap & Information Architecture</h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Interactive map of every route, workflow, and role-restricted portal in the DevBattles platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 space-y-3 border-indigo-500/30">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> Public Website
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {publicPages.map((p, i) => (
                <li key={i}>
                  <Link to={p.path} className="hover:text-indigo-300 hover:underline">
                    • {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 space-y-3 border-cyan-500/30">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Student Portal
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {studentPages.map((p, i) => (
                <li key={i}>
                  <Link to={p.path} className="hover:text-cyan-300 hover:underline">
                    • {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 space-y-3 border-amber-500/30">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Mentor Portal
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {mentorPages.map((p, i) => (
                <li key={i}>
                  <Link to={p.path} className="hover:text-amber-300 hover:underline">
                    • {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 space-y-3 border-rose-500/30">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> Super Admin Portal
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {adminPages.map((p, i) => (
                <li key={i}>
                  <Link to={p.path} className="hover:text-rose-300 hover:underline">
                    • {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};
