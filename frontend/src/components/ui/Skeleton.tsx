import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-800/60 light:bg-slate-200',
        className
      )}
    />
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-b-cyan-500 animate-spin flex items-center justify-center" />
      </div>
      <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 light:border-slate-300 light:bg-slate-50', className)}>
      {icon && (
        <div className="p-4 rounded-full bg-slate-800/80 text-indigo-400 mb-4 border border-slate-700/60 light:bg-indigo-50 light:border-indigo-100">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-200 light:text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 light:text-slate-600">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  description = 'Failed to load content. Please verify your connection or try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-center">
      <div className="p-3 rounded-full bg-rose-900/30 text-rose-400 mb-3">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-rose-200 mb-1">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-md mb-4">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
