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
      case 'emerald': // Hijau Muda
        return 'from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white font-semibold shadow-md shadow-emerald-500/10';
      case 'indigo': // Hijau Tua
        return 'from-emerald-850 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-white font-semibold shadow-md shadow-emerald-900/10';
      case 'amber': // Amber/Gold Alert
        return 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold shadow-md shadow-amber-600/10';
      case 'glass':
        return 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300';
      default:
        return 'from-emerald-600 to-teal-700 text-white';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${getGradient()} transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${className}`}
    >
      {children}
    </motion.button>
  );
}
