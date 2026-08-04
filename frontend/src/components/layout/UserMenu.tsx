import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { roleLabel } from '../../utils/roles';

/** Avatar + dropdown containing profile shortcuts and the Log Out action. */
export const UserMenu: React.FC = () => {
  const { currentUser, role, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!currentUser) return null;

  const handleLogout = () => {
    const name = currentUser.name;
    setIsOpen(false);
    logout();
    addToast('success', 'Signed Out', `See you soon, ${name}! Your session has been closed.`);
    navigate('/login', { replace: true });
  };

  const go = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900 transition-colors light:hover:bg-slate-100"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover border border-slate-700"
        />
        <div className="hidden lg:flex flex-col text-left text-xs">
          <span className="font-bold text-slate-200 light:text-slate-900 leading-none max-w-[140px] truncate">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-slate-400 capitalize">{roleLabel(role)}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden z-50 light:bg-white light:border-slate-200"
        >
          <div className="px-4 py-3 border-b border-slate-800 light:border-slate-200">
            <p className="text-sm font-bold text-slate-100 light:text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3" />
              {roleLabel(role)}
            </span>
          </div>

          <div className="p-1.5">
            <button
              role="menuitem"
              onClick={() => go('/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors light:text-slate-700 light:hover:bg-slate-100"
            >
              <UserIcon className="w-4 h-4" />
              My Profile
            </button>
            <button
              role="menuitem"
              onClick={() => go('/settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors light:text-slate-700 light:hover:bg-slate-100"
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </button>
          </div>

          <div className="p-1.5 border-t border-slate-800 light:border-slate-200">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
