import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  return (
    <div className={cn('flex items-center space-x-1 border-b border-slate-800 light:border-slate-200 overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors shrink-0 outline-none',
              isActive
                ? 'text-indigo-400 light:text-indigo-600 font-semibold'
                : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-bold',
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 light:bg-indigo-100 light:text-indigo-700'
                    : 'bg-slate-800 text-slate-400 light:bg-slate-200 light:text-slate-600'
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
