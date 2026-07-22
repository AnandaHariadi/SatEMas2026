"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'emerald' | 'indigo' | 'amber' | 'glass'; // 'emerald' acts as Hijau Muda, 'indigo' acts as Hijau Tua
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function GradientButton({
  children,
  onClick,
  className = '',
  variant = 'emerald',
  type = 'button',
  disabled = false
}: GradientButtonProps) {
  const getGradient = () => {
    switch (variant) {
      case 'emerald': // Hijau Muda (emerald-400 to teal-600)
        return 'from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white font-black shadow-md shadow-emerald-500/10';
      case 'indigo': // Hijau Tua (deep dark green #022c1b to emerald-950)
        return 'from-[#022c1b] to-emerald-950 hover:from-[#05321f] hover:to-emerald-900 text-white font-black shadow-md shadow-emerald-950/20';
      case 'amber': // Amber Alert
        return 'from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-black shadow-md shadow-amber-600/10';
      case 'glass':
        return 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-350';
      default:
        return 'from-emerald-500 to-teal-650 text-white';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${getGradient()} transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm border border-transparent ${className}`}
    >
      {children}
    </motion.button>
  );
}
