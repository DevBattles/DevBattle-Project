import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('aarav.patel@krmangalam.edu.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    addToast('success', 'Logged In Successfully!', `Welcome back as ${selectedRole.toUpperCase()}`);
    if (selectedRole === 'student') navigate('/dashboard');
    if (selectedRole === 'mentor') navigate('/mentor');
    if (selectedRole === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 text-white w-fit mx-auto shadow-lg shadow-indigo-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to DevBattles</h1>
          <p className="text-xs text-slate-400">Enter your college credentials to enter the arena</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Select Persona Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'mentor', 'admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 text-xs font-bold rounded-lg border capitalize transition-all ${
                    selectedRole === r
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Sign In as {selectedRole.toUpperCase()}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </Card>
    </div>
  );
};
