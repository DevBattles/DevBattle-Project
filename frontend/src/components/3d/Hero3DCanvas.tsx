import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Cpu, Trophy, Sparkles, BookOpen, CheckCircle2, Terminal, Shield, Zap } from 'lucide-react';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values for parallax floating 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center justify-center perspective-1000 py-8 select-none"
    >
      {/* Aurora Ambient Background Glowing Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      {/* 3D Floating Scene Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-4xl h-[520px] flex items-center justify-center"
      >
        {/* Central 3D Floating Laptop Canvas Container */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-[340px] sm:w-[480px] md:w-[560px] rounded-2xl p-1 bg-gradient-to-b from-slate-700/80 via-slate-800/80 to-slate-950 border border-slate-600/50 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl z-20"
        >
          {/* Laptop Screen Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 rounded-t-xl border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>devbattles-ide.tsx — Active Session</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              O(n) OPTIMAL
            </span>
          </div>

          {/* Code Editor Body inside 3D Laptop */}
          <div className="p-4 sm:p-6 bg-slate-950/95 font-mono text-xs sm:text-sm text-slate-200 rounded-b-xl space-y-2 border-t border-slate-900 overflow-hidden">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
              <span className="text-purple-400 font-bold">import</span> React, &#123; useState &#125; <span className="text-purple-400 font-bold">from</span> <span className="text-emerald-300">'react'</span>;
            </div>
            <div className="text-indigo-300 font-bold">
              <span className="text-purple-400 font-bold">export default function</span> SolveTwoSum(nums, target) &#123;
            </div>
            <div className="pl-4 text-slate-300">
              <span className="text-purple-400 font-bold">const</span> map = <span className="text-purple-400 font-bold">new</span> Map();
            </div>
            <div className="pl-4 text-slate-300">
              <span className="text-purple-400 font-bold">for</span> (<span className="text-purple-400 font-bold">let</span> i = 0; i &lt; nums.length; i++) &#123;
            </div>
            <div className="pl-8 text-cyan-300">
              <span className="text-purple-400 font-bold">const</span> diff = target - nums[i];
            </div>
            <div className="pl-8 text-cyan-300">
              <span className="text-purple-400 font-bold">if</span> (map.has(diff)) <span className="text-emerald-400 font-bold">return [map.get(diff), i];</span>
            </div>
            <div className="pl-8 text-slate-400">map.set(nums[i], i);</div>
            <div className="pl-4 text-slate-300">&#125;</div>
            <div className="pl-4 text-slate-400"><span className="text-purple-400 font-bold">return</span> [];</div>
            <div className="text-indigo-300 font-bold">&#125;</div>

            {/* Test Execution Output Banner */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All 3 Test Cases Passed</span>
              </div>
              <span className="text-slate-400 text-[11px]">Runtime: 38ms | Memory: 41.2MB</span>
            </div>
          </div>
        </motion.div>

        {/* FLOATING 3D CARD 1: AI Assistant Intelligence Card (Top Right) */}
        <motion.div
          animate={{ y: [-8, 8, -8], x: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -top-6 -right-2 sm:right-6 w-56 sm:w-64 p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-xl shadow-indigo-500/10 backdrop-blur-md z-30 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-100">AI Review Score</span>
            <span className="ml-auto text-xs font-black text-emerald-400">98/100</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            "Optimal O(n) hash table lookups detected. Minimal memory footprint."
          </p>
        </motion.div>

        {/* FLOATING 3D CARD 2: Live Contest Countdown (Top Left) */}
        <motion.div
          animate={{ y: [8, -8, 8], x: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-2 -left-2 sm:left-4 w-52 sm:w-60 p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-xl shadow-amber-500/10 backdrop-blur-md z-30 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-100">Global AI Cup #42</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>3,890 Registered</span>
            <span className="text-amber-400 font-bold">● Starts in 2d</span>
          </div>
        </motion.div>

        {/* FLOATING 3D CARD 3: Student Progress Tracker (Bottom Left) */}
        <motion.div
          animate={{ y: [-10, 6, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute -bottom-8 -left-4 sm:left-8 w-60 sm:w-68 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 backdrop-blur-md z-30 pointer-events-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Weekly Goal Progress
            </span>
            <span className="text-xs font-bold text-cyan-400">14/15 Solved</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[93%] bg-gradient-to-r from-cyan-500 to-indigo-500" />
          </div>
        </motion.div>

        {/* FLOATING 3D CARD 4: Homework Alert (Bottom Right) */}
        <motion.div
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-6 -right-2 sm:right-8 w-56 sm:w-64 p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-xl shadow-purple-500/10 backdrop-blur-md z-30 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-100 block">KRMU CS Batch 2025</span>
              <span className="text-[10px] text-slate-400">Homework #4 Due Aug 8</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
