"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NEWS_DATA } from '@/lib/data';
import { runARIMAForecast } from '@/lib/econometrics-engine';
import TimeSeriesChart from '@/components/visualization/TimeSeriesChart';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import GradientButton from '@/components/ui/GradientButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { TrendingUp, Cpu, BookOpen, ArrowRight, ShieldCheck, Flame, BarChart2, Globe, Sparkles } from 'lucide-react';

export default function Home() {
  const [previewCommId, setPreviewCommId] = useState('beras');
  const previewForecast = runARIMAForecast(previewCommId);
  const previewCommData = {
    id: previewCommId,
    name: previewCommId === 'beras' ? 'Beras Premium' : 'Cabai Rawit Merah',
    category: previewCommId === 'beras' ? 'Karbohidrat' : 'Hortikultura',
    currentPrice: previewCommId === 'beras' ? 15400 : 62000,
    unit: 'Kg',
    volatilityRating: previewCommId === 'beras' ? 'Low' as const : 'High' as const,
    description: '',
    historical: previewCommId === 'beras' 
      ? [{ month: '2025-10', price: 15450 }, { month: '2025-11', price: 15400 }, { month: '2025-12', price: 15400 }]
      : [{ month: '2025-10', price: 65000 }, { month: '2025-11', price: 63500 }, { month: '2025-12', price: 62000 }]
  };

  const macroStats = [
    { title: 'Inflasi Umum (CPI)', value: 2.85, decimals: 2, suffix: '% yoy', color: 'text-indigo-400' },
    { title: 'Inflasi Pangan (Volatile Food)', value: 5.40, decimals: 2, suffix: '% yoy', color: 'text-amber-400' },
    { title: 'Cadangan CBP Bulog', value: 1.45, decimals: 2, suffix: ' Jt Ton', color: 'text-emerald-400' },
    { title: 'Indeks Stabilitas Pangan', value: 85.2, decimals: 1, suffix: '/100', color: 'text-purple-400' }
  ];

  return (
    <div className="flex flex-col gap-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <SectionWrapper className="text-center max-w-4xl mx-auto py-10 flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sistem Pendukung Keputusan Kebijakan Fiskal</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-100">
          SATRISNA
        </h1>
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Integrasi analitik digital berbasis model ekonometrika time-series <span className="text-indigo-400 font-semibold">ARIMA</span> & <span className="text-emerald-400 font-semibold">GARCH</span> dalam memprediksi inflasi pangan dan mensimulasikan kebijakan fiskal untuk stabilitas ekonomi menuju Indonesia Emas 2045.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/dashboard">
            <GradientButton variant="emerald">
              Buka Dashboard Analisis <ArrowRight className="w-4 h-4" />
            </GradientButton>
          </Link>
          <Link href="/dashboard/learning">
            <GradientButton variant="glass">
              Pelajari Ekonometrika Pangan
            </GradientButton>
          </Link>
        </div>
      </SectionWrapper>

      {/* 2. MACRO STATISTIC RIBBON (Reference: Nexora / Skyline) */}
      <SectionWrapper className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {macroStats.map((stat, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-850 flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {stat.title}
              </span>
              <div className={`text-2xl font-black ${stat.color}`}>
                <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <span className="text-[9px] text-slate-500">Kondisi Terkini Real-Time</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 3. POLICY AND PREVIEW WIDGET */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
            Peramalan Digital & Simulasi Dampak Global
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Menghadapi era volatilitas global yang dipicu shock harga energi dan cuaca ekstrem, instrumen fiskal konvensional memerlukan landasan analitik berbasis data presisi tinggi. 
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            SATRISNA menggabungkan model time-series autoregressive dengan simulasi dampak Monte Carlo guna memberikan rekomendasi kuantitatif kuota impor, subsidi pupuk tani, dan penyaluran Bulog CBP.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Ekonometrika Presisi</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Prediksi bias-terkoreksi ARIMA/GARCH.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Simulasi Monte Carlo</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Pemetaan risiko fiskal multi-skenario.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live chart preview container */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-[320px]">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4.5 h-4.5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Preview Engine Analitik</span>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900 text-[10px]">
              <button 
                onClick={() => setPreviewCommId('beras')}
                className={`px-2 py-1 rounded cursor-pointer ${previewCommId === 'beras' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Beras Premium
              </button>
              <button 
                onClick={() => setPreviewCommId('cabai')}
                className={`px-2 py-1 rounded cursor-pointer ${previewCommId === 'cabai' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Cabai Rawit
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 relative">
            <TimeSeriesChart commodity={previewCommData as any} forecast={previewForecast} showCI={false} />
          </div>
        </div>
      </SectionWrapper>

      {/* 4. NEWS & INSIGHTS (Reference: Infotek / BrightBuild) */}
      <SectionWrapper className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Kilas Insight Makro & Pangan</h2>
            <p className="text-xs text-slate-500 mt-1">
              Catatan analitik terkait dinamika harga energi global dan intervensi APBN domestik
            </p>
          </div>
          <Link href="/dashboard" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_DATA.map((news, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border self-start ${
                  news.tag === 'Global' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  news.tag === 'Fiskal' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {news.tag}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug hover:text-indigo-400 transition-colors">
                  <Link href={`/dashboard/news/${news.slug}`}>{news.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {news.summary}
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900 pt-3">
                <span>{news.author}</span>
                <span>{news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 5. CONTACT / TEAM INNOVATOR */}
      <SectionWrapper className="glass-panel p-8 rounded-3xl border border-slate-850 text-center max-w-4xl mx-auto flex flex-col items-center gap-5 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-emerald-500/5 opacity-40 pointer-events-none" />

        <h2 className="text-xl sm:text-2xl font-black text-slate-100">
          Tim Inovasi Gemastik 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
          SATRISNA dirancang sebagai prototype decision support system Smart City untuk mempermudah perumusan kebijakan fiskal pangan nasional secara objektif berbasis kekuatan sains ekonometrika.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center mt-2 border-t border-slate-900 pt-6 w-full text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            <span>Kategori: Smart City & DSS</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4.5 h-4.5 text-indigo-400" />
            <span>Fokus: Ketahanan Pangan Nasional</span>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
