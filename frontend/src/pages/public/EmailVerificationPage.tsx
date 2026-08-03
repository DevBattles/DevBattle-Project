import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const EmailVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-4">
        <MailCheck className="w-12 h-12 text-indigo-400 mx-auto" />
        <h1 className="text-2xl font-black text-white">Email Verification</h1>
        <p className="text-xs text-slate-400">
          Your college email address has been verified successfully. Your account request is in queue.
        </p>
        <Link to="/login">
          <Button variant="glow">Proceed to Sign In</Button>
        </Link>
      </Card>
    </div>
  );
};
