import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  Trophy,
  FolderGit2,
  CheckSquare,
  BarChart3,
  Cpu,
  Award,
  Calendar,
  Bell,
  User,
  Settings,
  ShieldCheck,
  Users,
  Building2,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { role, currentUser } = useAuth();

  const studentNav = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Question Bank', path: '/questions', icon: <Code2 className="w-4 h-4" /> },
    { label: 'Daily Homework', path: '/homework', icon: <BookOpen className="w-4 h-4" />, badge: '1 Due' },
    { label: 'Coding Workspace', path: '/workspace/q-101', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { label: 'Coding Contests', path: '/contests', icon: <Trophy className="w-4 h-4" />, badge: 'LIVE' },
    { label: 'Projects Arena', path: '/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'My Submissions', path: '/submissions', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Progress Radar', path: '/progress', icon: <Award className="w-4 h-4" /> },
    { label: 'AI Review Center', path: '/ai-reviews', icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
    { label: 'Achievements', path: '/achievements', icon: <Award className="w-4 h-4" /> },
    { label: 'Calendar', path: '/calendar', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'My Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const mentorNav = [
    { label: 'Mentor Overview', path: '/mentor', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Homework Builder', path: '/mentor/homework-builder', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Question Builder', path: '/mentor/question-builder', icon: <Code2 className="w-4 h-4" /> },
    { label: 'Contests Manager', path: '/mentor/contests', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Students Roster', path: '/mentor/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Batch Analytics', path: '/mentor/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: <ShieldCheck className="w-4 h-4 text-rose-400" /> },
    { label: 'Approval Queue', path: '/admin/approvals', icon: <Users className="w-4 h-4" />, badge: '2 Pending' },
    { label: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'College Hierarchy', path: '/admin/colleges', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Audit Trail Logs', path: '/admin/audit-logs', icon: <FileText className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentNav = role === 'student' ? studentNav : role === 'mentor' ? mentorNav : adminNav;

  return (
    <aside
      className={cn(
        'relative border-r border-slate-800 bg-slate-950/90 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 flex flex-col justify-between select-none z-30 light:bg-white light:border-slate-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {!isCollapsed && (
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center justify-between">
            <span>{role} workspace</span>
            {currentUser.collegeName && <span className="text-indigo-400 font-bold truncate max-w-[100px]">{currentUser.collegeName}</span>}
          </div>
        )}

        {currentNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/mentor' || item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold light:bg-indigo-50 light:text-indigo-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 light:text-slate-600 light:hover:bg-slate-100'
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="truncate">{item.label}</span>}
            {!isCollapsed && item.badge && (
              <span className="ml-auto text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800 light:border-slate-200">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors light:bg-slate-100 light:border-slate-200"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
