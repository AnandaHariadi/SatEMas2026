"use client";

import React from 'react';
import Link from 'next/link';
import { Award, ShieldAlert, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 backdrop-blur-sm py-12 relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-wider">SATRISNA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Integrasi Analitik Digital Berbasis Model Ekonometrika Time-Series dalam Prediksi Inflasi Pangan dan Simulasi Kebijakan Fiskal untuk Stabilitas Ekonomi Nasional Menuju Indonesia Emas 2045.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Project Inovasi Gemastik 2026 - Divisi Smart City / DSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Platform</span>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
              <Link href="/dashboard/prediction" className="hover:text-emerald-400 transition-colors">ARIMA & GARCH Predictor</Link>
              <Link href="/dashboard/simulation" className="hover:text-emerald-400 transition-colors">Monte Carlo Simulator</Link>
              <Link href="/dashboard/learning" className="hover:text-emerald-400 transition-colors">Modul Edukasi</Link>
            </div>
          </div>

          {/* Technology & Compliance */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Sistem & data</span>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next.js 16 + TypeScript</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Data historis diperoleh dari interpolasi data publik BPS & BI. Model simulasi bersifat representatif.</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} SATRISNA Platform. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span>Dibuat untuk Indonesia Emas 2045 dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>oleh Tim Gemastik</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
