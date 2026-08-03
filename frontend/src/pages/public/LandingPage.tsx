import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Trophy,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  BarChart3,
  BookOpen,
  Building2,
  Star,
  Terminal,
  Play,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roleHome } from '../../utils/roles';
import { Hero3DCanvas } from '../../components/3d/Hero3DCanvas';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('editor');

  /** Signed-in visitors jump straight to their workspace, everyone else signs up first. */
  const enterPlatform = () => navigate(currentUser ? roleHome(role) : '/register');

  const stats = [
    { value: '150,000+', label: 'Active Developers' },
    { value: '2,400,000+', label: 'Code Submissions' },
    { value: '180+', label: 'Partner Colleges' },
    { value: '99.4%', label: 'AI Review Accuracy' },
  ];

  const collegeLogos = [
    'KR Mangalam University',
    'IIT Delhi',
    'BITS Pilani',
    'DTU Delhi',
    'IIT Bombay',
    'IIIT Hyderabad',
  ];

  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-cyan-400" />,
      title: 'VS Code-Grade IDE',
      description: 'Integrated Monaco Editor with multi-language execution, custom test case runners, and real-time execution stats.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      title: 'AI Code Review Engine',
      description: 'Instant multi-dimensional code diagnostics assessing Architecture, Readability, Performance, Security, and WCAG AA Accessibility.',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'Live College Arena',
      description: 'Real-time competitive battles with automated anti-cheat, global leaderboards, and college batch rivalries.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: 'Batch Homework & Workflows',
      description: 'Mentors assign batch-specific homework with due date enforcement and automated AI preliminary grading.',
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      title: '4-Tier College Hierarchy',
      description: 'Structured mapping from Platform -> College -> Branch -> Batch -> Mentor -> Student.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-400" />,
      title: 'Skill Progress Radar',
      description: 'Track topic mastery over time with 100-day activity heatmaps and AI-curated personalized learning roadmaps.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300 shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next-Generation Developer Learning & Battle Platform</span>
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                NEW v3.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
            >
              Practice. Build.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Compete. Grow.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              DevBattles combines VS Code-grade IDE, automated AI code reviews, batch homework assignments, live competitive battles, and college hierarchy management into one unified developer platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-4 pt-2 flex-wrap"
            >
              <Button size="lg" variant="glow" icon={<Play className="w-4 h-4" />} onClick={enterPlatform}>
                {currentUser ? 'Go to My Workspace' : 'Launch Arena Free'}
              </Button>
              <Button size="lg" variant="secondary" icon={<Code2 className="w-4 h-4" />} onClick={() => navigate('/workspace/q-101')}>
                Try IDE Demo
              </Button>
            </motion.div>
          </div>

          {/* Interactive 3D Product Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Hero3DCanvas />
          </motion.div>
        </div>
      </section>

      {/* PARTNER COLLEGE LOGOS */}
      <section className="py-8 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Trusted by top engineering departments & global computer science faculties
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            {collegeLogos.map((college, i) => (
              <span key={i} className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                🏛️ {college}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATED STATISTICS COUNTER */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 block mb-1">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT PREVIEW TABS */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="indigo">Interactive Platform Showcase</Badge>
            <h2 className="text-3xl font-bold text-white">Experience the DevBattles Workspace</h2>
            <p className="text-slate-400 text-sm">
              Switch between key feature views below to preview the live experience.
            </p>
          </div>

          <div className="flex justify-center">
            <Tabs
              tabs={[
                { id: 'editor', label: 'Monaco IDE Workspace' },
                { id: 'review', label: 'AI Review Engine' },
                { id: 'dashboard', label: 'Student Dashboard' },
              ]}
              activeTab={activePreviewTab}
              onChange={setActivePreviewTab}
            />
          </div>

          <Card className="p-6 bg-slate-950 border-slate-800">
            {activePreviewTab === 'editor' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">⚡ twoSum.ts — TypeScript</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate('/workspace/q-101')}>
                      Open Full Screen IDE
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-xl space-y-1.5 border border-slate-800">
                  <span className="text-purple-400">function</span> <span className="text-indigo-300">twoSum</span>(nums: <span className="text-cyan-400">number[]</span>, target: <span className="text-cyan-400">number</span>): <span className="text-cyan-400">number[]</span> &#123;
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> Map&lt;<span className="text-cyan-400">number, number</span>&gt;();
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; nums.length; i++) &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">const</span> diff = target - nums[i];
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (map.has(diff)) <span className="text-emerald-400">return [map.get(diff)!, i];</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;map.set(nums[i], i);
                  <br />
                  &nbsp;&nbsp;&#125;
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> [];
                  <br />
                  &#125;
                </div>
              </div>
            )}

            {activePreviewTab === 'review' && (
              <div className="p-4 bg-slate-900 rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-slate-200">AI Code Review Diagnostics</span>
                  <span className="text-emerald-400 font-extrabold text-sm">Overall Score: 92/100</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  "Submission achieves optimal O(n) runtime complexity. Hashmap lookups avoid nested O(n²) iterations. Zero memory leak vectors detected."
                </p>
                <Button size="sm" variant="primary" onClick={() => navigate('/ai-reviews')}>
                  Explore Deep Review Reports
                </Button>
              </div>
            )}

            {activePreviewTab === 'dashboard' && (
              <div className="p-4 bg-slate-900 rounded-xl space-y-4 text-xs">
                <div className="flex justify-between items-center text-slate-200 font-bold border-b border-slate-800 pb-3">
                  <span>Aarav Patel (KR Mangalam University)</span>
                  <span className="text-indigo-400">Rank #14 Global</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <span className="text-lg font-bold text-white block">142</span>
                    <span className="text-slate-500 text-[10px]">Problems Solved</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <span className="text-lg font-bold text-amber-400 block">28 Days</span>
                    <span className="text-slate-500 text-[10px]">Current Streak</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <span className="text-lg font-bold text-cyan-400 block">4,850</span>
                    <span className="text-slate-500 text-[10px]">Total XP</span>
                  </div>
                </div>
                <Button size="sm" variant="glow" className="w-full" onClick={enterPlatform}>
                  {currentUser ? 'Go to My Dashboard' : 'Start Free - Create Account'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* FEATURE CARDS GRID */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="cyan">Platform Architecture</Badge>
            <h2 className="text-3xl font-bold text-white">Engineered for Enterprise Academic Excellence</h2>
            <p className="text-slate-400 text-sm">
              Everything students, mentors, and administrators need in one cohesive ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <Card key={i} hoverElevate glow className="p-6 space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/80 w-fit">{feat.icon}</div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Accelerate Your Developer Journey?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Join thousands of engineering students and faculty mentors on DevBattles today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <Button size="lg" variant="glow" onClick={enterPlatform}>
              {currentUser ? 'Go to My Workspace' : 'Create Free Account'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              View College Plans
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
