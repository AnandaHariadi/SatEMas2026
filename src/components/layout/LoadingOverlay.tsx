"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function LoadingOverlay() {
  const { isLoadingScreen } = useAuth();

  return (
    <AnimatePresence>
      {isLoadingScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] text-white p-4"
        >
          {/* Animated Glowing Ring */}
          <div className="relative flex items-center justify-center">
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-24 h-24 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 border-r-emerald-400"
            />
            
            <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#022c1b] via-[#05321f] to-[#10b981] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20">
              S
            </div>

          </div>

          <div className="flex flex-col items-center gap-1.5 mt-6 text-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-white uppercase">SATRISNA</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <Cpu className="w-3 h-3 animate-spin text-emerald-400" /> PROSES MEMUAT MODUL &amp; ENKRIPSI DATA BPS
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-emerald-600 to-[#10b981]"
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
