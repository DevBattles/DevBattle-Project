import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Code2,
  Trophy,
  BookOpen,
  Layers,
  User,
  Settings,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Users,
  Building2,
  FileText,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface PaletteAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  run: () => void;
}

export const CommandPalette: React.FC = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, role, logout } = useAuth();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleLogout = () => {
    const name = currentUser?.name ?? 'Developer';
    logout();
    addToast('success', 'Signed Out', `See you soon, ${name}! Your session has been closed.`);
    navigate('/login', { replace: true });
  };

  const studentActions: PaletteAction[] = [
    { id: 'p-dashboard', name: 'Go to Dashboard', icon: <Layers className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/dashboard') },
    { id: 'p-questions', name: 'Explore Question Bank', icon: <Code2 className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/questions') },
    { id: 'p-homework', name: 'View Daily Homework', icon: <BookOpen className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/homework') },
    { id: 'p-contests', name: 'Join Coding Contests', icon: <Trophy className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/contests') },
    { id: 'p-ide', name: 'Open Coding Workspace (IDE)', icon: <Code2 className="w-4 h-4 text-emerald-400" />, category: 'IDE', run: () => navigate('/workspace/q-101') },
  ];

  const mentorActions: PaletteAction[] = [
    { id: 'm-overview', name: 'Go to Mentor Overview', icon: <Layers className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/mentor') },
    { id: 'm-homework', name: 'Open Homework Builder', icon: <BookOpen className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/mentor/homework-builder') },
    { id: 'm-students', name: 'View Students Roster', icon: <Users className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/mentor/students') },
    { id: 'm-analytics', name: 'Batch Analytics', icon: <Trophy className="w-4 h-4" />, category: 'Navigation', run: () => navigate('/mentor/analytics') },
  ];

  const adminActions: PaletteAction[] = [
    { id: 'a-dashboard', name: 'Go to Admin Console', icon: <Shield className="w-4 h-4 text-rose-400" />, category: 'Navigation', run: () => navigate('/admin') },
    { id: 'a-approvals', name: 'Review Approval Queue', icon: <Users className="w-4 h-4" />, category: 'Administration', run: () => navigate('/admin/approvals') },
    { id: 'a-users', name: 'Manage Users & Roles', icon: <Users className="w-4 h-4" />, category: 'Administration', run: () => navigate('/admin/users') },
    { id: 'a-colleges', name: 'College Hierarchy', icon: <Building2 className="w-4 h-4" />, category: 'Administration', run: () => navigate('/admin/colleges') },
    { id: 'a-logs', name: 'Audit Trail Logs', icon: <FileText className="w-4 h-4" />, category: 'Administration', run: () => navigate('/admin/audit-logs') },
  ];

  const accountActions: PaletteAction[] = currentUser
    ? [
        { id: 'p-profile', name: 'View My Profile', icon: <User className="w-4 h-4" />, category: 'Account', run: () => navigate('/profile') },
        { id: 'p-settings', name: 'Account Settings', icon: <Settings className="w-4 h-4" />, category: 'Account', run: () => navigate('/settings') },
        { id: 'p-logout', name: 'Log Out', icon: <LogOut className="w-4 h-4 text-rose-400" />, category: 'Account', run: handleLogout },
      ]
    : [
        { id: 'p-login', name: 'Sign In', icon: <LogIn className="w-4 h-4" />, category: 'Account', run: () => navigate('/login') },
        { id: 'p-register', name: 'Create an Account', icon: <UserPlus className="w-4 h-4" />, category: 'Account', run: () => navigate('/register') },
      ];

  const roleActions = !currentUser
    ? []
    : role === 'admin'
    ? adminActions
    : role === 'mentor'
    ? mentorActions
    : studentActions;

  const actions: PaletteAction[] = [
    ...roleActions,
    ...accountActions,
    { id: 'p-theme', name: `Toggle Theme (Current: ${theme})`, icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, category: 'Preferences', run: () => toggleTheme() },
  ];

  const filteredActions = actions.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: PaletteAction) => {
    action.run();
    closePalette();
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePalette}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-xl rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden z-10 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"
        >
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 light:border-slate-200">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, questions, or jump to page... (e.g., IDE, Homework)"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-500 text-slate-100 light:text-slate-900"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-800 rounded border border-slate-700 light:bg-slate-100 light:border-slate-300">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No matching command found. Try searching "IDE", "Profile" or "Log Out".
              </div>
            ) : (
              filteredActions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors group text-left light:text-slate-800 light:hover:bg-indigo-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-md bg-slate-800 text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 light:bg-slate-100 light:text-slate-600">
                      {item.icon}
                    </span>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-xs text-slate-500">· {item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center light:bg-slate-50 light:border-slate-200">
            <span>DevBattles Command Launcher</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Cmd K</kbd> anytime</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
