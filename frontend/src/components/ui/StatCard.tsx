import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  gradient?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  className,
}) => {
  return (
    <Card hoverElevate className={cn('relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 text-indigo-400 border border-slate-700/50 group-hover:scale-110 transition-transform light:bg-indigo-50 light:border-indigo-100">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white light:text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
              trend.isPositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-rose-400 bg-rose-500/10'
            )}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 light:text-slate-500">{subtitle}</p>
      )}
    </Card>
  );
};

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  className?: string;
}> = ({ value, max = 100, label, showPercent = true, color = 'bg-indigo-500', className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showPercent && <span className="font-bold text-slate-200">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden light:bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
};
