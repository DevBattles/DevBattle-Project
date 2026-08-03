import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  glass?: boolean;
  glow?: boolean;
  hoverElevate?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  glow = false,
  hoverElevate = true,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverElevate ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl border transition-all duration-200 p-5',
        glass
          ? 'bg-slate-900/80 backdrop-blur-md border-slate-800/80 light:bg-white/90 light:border-slate-200'
          : 'bg-slate-900 border-slate-800 light:bg-white light:border-slate-200',
        glow && 'hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10',
        'shadow-md shadow-black/20 light:shadow-slate-200/50',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
