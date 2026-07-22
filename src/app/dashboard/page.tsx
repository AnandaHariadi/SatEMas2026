"use client";

import React from 'react';
import InflationPredictor from '@/components/ai/InflationPredictor';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Layers, Activity, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const generalStats = [
    { title: 'Volatile Food CPI', value: 5.4, decimals: 1, suffix: '%', desc: 'Indeks volatile food BPS terkini' },
    { title: 'Volatilitas Minyak Brent', value: 85.5, decimals: 1, suffix: ' USD', desc: 'Harga komoditas energi global' },
    { title: 'Cadangan CBP Bulog', value: 1.45, decimals: 2, suffix: ' Jt Ton', desc: 'Stok beras pemerintah aktif' },
    { title: 'Indeks Keberlanjutan Fiskal', value: 82.0, decimals: 1, suffix: '%', desc: 'Batas toleransi belanja APBN' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Page Title Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-800" />
            Dashboard Statistik Pangan Nasional
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Pantau peramalan komoditas pangan pokok dan ajukan simulasi intervensi fiskal BPS/BI.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-emerald-800 font-bold uppercase tracking-wider">Engine ARIMA/GARCH Aktif</span>
        </div>
      </SectionWrapper>

      {/* KPI Cards Row (SITABA Dashboard style) */}
      <SectionWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {generalStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              {stat.title}
            </span>
            <div className="text-2xl font-black text-slate-850">
              <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </div>
            <span className="text-[9px] text-slate-400 block font-medium mt-0.5">{stat.desc}</span>
          </div>
        ))}
      </SectionWrapper>

      {/* Main Section: Forecaster Workspace (Full Width, no sidebar) */}
      <SectionWrapper className="w-full">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-emerald-700" />
                Predictive Analysis Workspace (BPS/BI)
              </h2>
              <p className="text-[10px] text-slate-455">
                Ubah parameter lag untuk meramalkan tren pergerakan harga eceran komoditas pangan.
              </p>
            </div>
          </div>

          <InflationPredictor />
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex gap-2 text-[10px] text-slate-500 leading-normal font-medium">
            <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Integrasi engine analitik time-series terkalibrasi secara dinamis untuk mengantisipasi gejolak anomali pasokan hortikultura dan logistik energi global.
            </span>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
