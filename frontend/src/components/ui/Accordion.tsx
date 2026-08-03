import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/60 light:bg-white light:border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-white transition-colors light:text-slate-800 light:hover:text-slate-950"
      >
        <span>{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-0 text-sm text-slate-400 border-t border-slate-800/50 light:border-slate-100 light:text-slate-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};
