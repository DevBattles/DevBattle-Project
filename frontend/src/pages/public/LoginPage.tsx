import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DEMO_ACCOUNTS, useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { roleHome } from '../../utils/roles';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = login(email, password);

    if (!result.ok || !result.user) {
      setIsSubmitting(false);
      setError(result.error ?? 'Unable to sign in. Please try again.');
      addToast('error', 'Sign In Failed', result.error);
      return;
    }

    addToast('success', `Welcome back, ${result.user.name.split(' ')[0]}!`, `Signed in as ${result.user.role.toUpperCase()}.`);

    const home = roleHome(result.user.role);
    navigate(redirectTo && redirectTo !== '/login' ? redirectTo : home, { replace: true });
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
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
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@college.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" variant="glow" className="w-full" icon={<ArrowRight className="w-4 h-4" />} isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        {/* Demo credentials - remove once the real identity backend is connected */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Demo accounts (click to autofill)
          </p>
          <div className="grid gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email, acc.password)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-500/50 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-[11px] font-bold text-slate-200">{acc.label}</span>
                <span className="block text-[10px] text-slate-500 truncate">
                  {acc.email} · {acc.password}
                </span>
              </button>
            ))}
          </div>
        </div>

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
