import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Footer } from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Free Student',
      description: 'Ideal for individual practice and self-paced DSA learning.',
      price: '$0',
      period: 'forever',
      features: [
        'Access to 250+ Question Bank problems',
        'Basic AI Code Reviews (10/day)',
        'Global Leaderboard ranking',
        'Standard Monaco IDE Workspace',
      ],
      cta: 'Start Free',
      variant: 'secondary' as const,
    },
    {
      name: 'Pro Developer',
      description: 'For competitive coders aiming for top tech placements.',
      price: billingCycle === 'yearly' ? '$12' : '$15',
      period: 'per month',
      popular: true,
      features: [
        'Unlimited Question Bank access',
        'Unlimited Deep AI Structural Reviews',
        'Frontend Challenge Live Web Inspector',
        'Fullstack Project Sandboxes',
        'Detailed Skill Progress Radar & Roadmaps',
      ],
      cta: 'Upgrade to Pro',
      variant: 'glow' as const,
    },
    {
      name: 'College Enterprise',
      description: 'Full campus licensing for universities & CS departments.',
      price: '$499',
      period: 'per college / month',
      features: [
        'Unlimited Students, Mentors & Batches',
        'College -> Branch -> Batch Hierarchy',
        'Mentor Homework Builder & Auto-Grading',
        'Custom College Battles & Internal Leaderboards',
        'Exportable Accreditation Analytics & CSV Reports',
      ],
      cta: 'Contact Enterprise Sales',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="amber">Transparent Pricing</Badge>
          <h1 className="text-4xl font-black text-white">Simple Plans for Students & Colleges</h1>
          <p className="text-slate-400 text-sm">
            Choose the right tier to supercharge coding skills or equip your university department.
          </p>

          <div className="inline-flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              hoverElevate
              glow={plan.popular}
              className={`p-8 flex flex-col justify-between relative ${
                plan.popular ? 'border-indigo-500/50 bg-indigo-950/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  ★ MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  size="md"
                  variant={plan.variant}
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
