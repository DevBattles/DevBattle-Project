import React from 'react';
import { Difficulty } from '../../types';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'expert' | 'neutral' | 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  icon,
}) => {
  const variantStyles = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-100 light:text-emerald-700',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20 light:bg-amber-100 light:text-amber-800',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-100 light:text-rose-700',
    expert: 'bg-purple-500/10 text-purple-400 border-purple-500/20 light:bg-purple-100 light:text-purple-700',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60 light:bg-slate-200 light:text-slate-700',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 light:bg-indigo-100 light:text-indigo-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 light:bg-cyan-100 light:text-cyan-700',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-100 light:text-emerald-700',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 light:bg-amber-100 light:text-amber-800',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-100 light:text-rose-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: Difficulty; className?: string }> = ({
  difficulty,
  className,
}) => {
  const map: Record<Difficulty, 'easy' | 'medium' | 'hard' | 'expert'> = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard',
    Expert: 'expert',
  };
  return (
    <Badge variant={map[difficulty]} className={className}>
      {difficulty}
    </Badge>
  );
};
