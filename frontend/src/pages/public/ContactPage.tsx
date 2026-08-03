import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { Footer } from '../../components/layout/Footer';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Message Sent!', 'Our engineering team will respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="cyan">Get in Touch</Badge>
          <h1 className="text-4xl font-black text-white">Contact DevBattles Engineering</h1>
          <p className="text-slate-400 text-sm">
            Have questions about college enterprise onboarding, mentor access, or platform features?
          </p>
        </div>

        <Card className="p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Thank You for Reaching Out</h2>
              <p className="text-slate-400 text-sm">
                Your inquiry has been logged in our support desk.
              </p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Aarav Patel"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aarav@krmangalam.edu.in"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="College Enterprise Subscription / Support"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your college department or question..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Button type="submit" variant="glow" icon={<Send className="w-4 h-4" />}>
                Submit Inquiry
              </Button>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};
