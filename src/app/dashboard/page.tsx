"use client";

import React from 'react';
import InflationPredictor from '@/components/ai/InflationPredictor';
import AIChatbot from '@/components/ai/AIChatbot';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Layers, Bot, Activity, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const generalStats = [
    { title: 'Volatile Food CPI', value: 5.4, decimals: 1, suffix: '%', desc: 'Baseline volatile food BPS' },
    { title: 'Volatilitas Minyak Brent', value: 85.5, decimals: 1, suffix: ' USD', desc: 'Harga komoditas energi global' },
    { title: 'Cadangan CBP Bulog', value: 1.45, decimals: 2, suffix: ' Jt Ton', desc: 'Stok beras pemerintah aktif' },
    { title: 'Indeks Stabilitas Fiskal', value: 82.0, decimals: 1, suffix: '%', desc: 'Batas toleransi belanja APBN' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Page Title Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Dashboard Utama SATRISNA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau peramalan komoditas pangan pokok dan ajukan simulasi intervensi fiskal BPS/BI.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">Terkoneksi Engine Python (ARIMA/GARCH)</span>
        </div>
      </SectionWrapper>

      {/* KPI Cards Row */}
      <SectionWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {generalStats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-850 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
              {stat.title}
            </span>
            <div className="text-xl font-black text-slate-100">
              <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </div>
            <span className="text-[9px] text-slate-600 block">{stat.desc}</span>
          </div>
        ))}
      </SectionWrapper>

      {/* Main Section: Forecaster and Chatbot */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecaster component spans 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Predictive Analysis Workspace
                </h2>
                <p className="text-[10px] text-slate-500">
                  Ubah parameter untuk meramalkan tren pergerakan harga eceran pangan pokok.
                </p>
              </div>
            </div>

            <InflationPredictor />
          </div>
        </div>

        {/* AI Assistant Chatbot */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
            <div className="border-b border-slate-900 pb-3 mb-4">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Bot className="w-4.5 h-4.5 text-emerald-400" />
                Asisten Analisis Fiskal AI
              </h2>
              <p className="text-[10px] text-slate-500">
                Konsultasikan hasil peramalan atau mintalah saran perumusan mitigasi gejolak harga.
              </p>
            </div>

            <div className="flex-1 min-h-0">
              <AIChatbot />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-900 flex gap-2 text-[10px] text-slate-500 leading-normal">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
              <span>
                Engine AI dilatih menggunakan data komparatif makro untuk memitigasi el-nino dan krisis distribusi logistik.
              </span>
            </div>
          </div>
        </div>

      </SectionWrapper>

    </div>
  );
}
