import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Search, Sun, Moon, Bell, User, Sparkles, Terminal, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, currentUser } = useAuth();
  const { openPalette } = useCommandPalette();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicPage = ['/', '/features', '/about', '/contact', '/pricing', '/faq', '/login', '/register', '/sitemap'].includes(
    location.pathname
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl light:bg-white/80 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={role === 'student' ? '/dashboard' : role === 'mentor' ? '/mentor' : '/admin'} className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white light:text-slate-900 flex items-center gap-1">
              DevBattles
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-extrabold bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                AI
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 hidden sm:inline">
              Practice. Build. Compete.
            </span>
          </div>
        </Link>

        {/* Navigation Links for Public Pages */}
        {isPublicPage && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300 light:text-slate-700">
            <Link to="/features" className="hover:text-indigo-400 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link to="/faq" className="hover:text-indigo-400 transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-indigo-400 transition-colors">
              Contact
            </Link>
            <Link to="/sitemap" className="hover:text-indigo-400 transition-colors text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
              Sitemap & IA
            </Link>
          </nav>
        )}

        {/* Global Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Cmd + K Search Trigger */}
          <button
            onClick={openPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors light:bg-slate-100 light:border-slate-200 light:text-slate-600"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search or Cmd + K</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 light:bg-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors light:bg-slate-100 light:border-slate-200 light:text-slate-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* App Access Buttons vs User Profile */}
          {isPublicPage ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="glow" size="sm">
                  Launch Platform
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors light:bg-slate-100 light:border-slate-200 light:text-slate-700"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              {/* User Avatar & Profile Quick Trigger */}
              <div
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-900 transition-colors light:hover:bg-slate-100"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="hidden lg:flex flex-col text-left text-xs">
                  <span className="font-bold text-slate-200 light:text-slate-900 leading-none">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">{role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
