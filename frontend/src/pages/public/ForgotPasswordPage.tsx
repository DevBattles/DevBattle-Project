import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-xs text-slate-400">Enter your college email to receive reset instructions</p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-300">
              Reset instructions sent to your college inbox!
            </p>
            <Link to="/login">
              <Button variant="secondary" size="sm">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="aarav@krmangalam.edu.in"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Button type="submit" variant="glow" className="w-full">
              Send Recovery Link
            </Button>
          </form>
        )}

        <div className="text-center text-xs">
          <Link to="/login" className="text-slate-400 hover:text-white flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
