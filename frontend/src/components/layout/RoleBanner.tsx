import React from 'react';
import { Shield, Sparkles, UserCheck, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { useNavigate } from 'react-router-dom';

export const RoleBanner: React.FC = () => {
  const { role, switchRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (newRole: Role) => {
    switchRole(newRole);
    if (newRole === 'student') navigate('/dashboard');
    if (newRole === 'mentor') navigate('/mentor');
    if (newRole === 'admin') navigate('/admin');
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-500/20 px-4 py-2 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2 z-40">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <span className="font-semibold text-slate-200">
          Demo Persona Switcher:
        </span>
        <span className="text-slate-400">
          Currently viewing as <strong className="text-indigo-300 capitalize">{role}</strong> ({currentUser.name})
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-medium">
        <button
          onClick={() => handleSwitch('student')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            role === 'student'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          🎓 Student
        </button>
        <button
          onClick={() => handleSwitch('mentor')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            role === 'mentor'
              ? 'bg-amber-600 text-white font-bold shadow-sm'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          👨‍🏫 Mentor
        </button>
        <button
          onClick={() => handleSwitch('admin')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            role === 'admin'
              ? 'bg-rose-600 text-white font-bold shadow-sm'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          🛡️ Admin
        </button>
      </div>
    </div>
  );
};
