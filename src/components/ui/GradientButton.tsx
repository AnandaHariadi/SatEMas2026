"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'emerald' | 'indigo' | 'amber' | 'glass';
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
      case 'emerald':
        return 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25';
      case 'indigo':
        return 'from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25';
      case 'amber':
        return 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/25';
      case 'glass':
        return 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20';
      default:
        return 'from-emerald-500 to-teal-600 text-slate-950';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${getGradient()} transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}
