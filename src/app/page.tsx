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
import { TrendingUp, Cpu, ArrowRight, ShieldCheck, BarChart2, Globe, Sparkles } from 'lucide-react';

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
    { title: 'Inflasi Umum (CPI)', value: 2.85, decimals: 2, suffix: '% yoy', color: 'text-emerald-800' },
    { title: 'Inflasi Pangan (Volatile Food)', value: 5.40, decimals: 2, suffix: '% yoy', color: 'text-emerald-600' },
    { title: 'Cadangan CBP Bulog', value: 1.45, decimals: 2, suffix: ' Jt Ton', color: 'text-emerald-700' },
    { title: 'Indeks Stabilitas Pangan', value: 85.2, decimals: 1, suffix: '/100', color: 'text-[#064e3b]' }
  ];

  return (
    <div className="flex flex-col gap-20 pb-16">
      
      {/* 1. HERO SECTION (Pertamina/Avian Style) */}
      <SectionWrapper className="text-center max-w-4xl mx-auto py-12 flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portal Pendukung Kebijakan Stabilitas Nasional</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-emerald-950">
          SATRISNA
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-medium">
          Integrasi analitik digital berbasis model ekonometrika time-series <span className="text-[#064e3b] font-bold">ARIMA</span> & <span className="text-emerald-600 font-bold">GARCH</span> dalam memprediksi inflasi pangan dan mensimulasikan kebijakan fiskal untuk stabilitas ekonomi nasional menuju Indonesia Emas 2045 di era volatilitas global.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link href="/dashboard">
            <GradientButton variant="indigo">
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

      {/* 2. MACRO STATISTIC RIBBON (SITABA Dashboard Style) */}
      <SectionWrapper className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {macroStats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                {stat.title}
              </span>
              <div className={`text-2xl font-black ${stat.color}`}>
                <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Data Terkini Real-Time</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 3. POLICY AND PREVIEW WIDGET */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
            Peramalan Presisi & Mitigasi Risiko Pangan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Di tengah ketidakpastian global yang dipicu oleh volatilitas pasar energi internasional dan anomali iklim, perumusan intervensi pangan nasional membutuhkan fondasi kuantitatif yang kokoh. 
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            SATRISNA menggabungkan kekuatan pemodelan time-series autoregressive dengan simulasi Monte Carlo untuk menghadirkan keputusan stabilisasi harga kebutuhan pokok warga secara transparan dan tepat sasaran.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Ekonometrika Presisi</h4>
                <p className="text-[10px] text-slate-455 mt-0.5 leading-normal">Prediksi bias-terkoreksi ARIMA/GARCH BPS.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Simulasi Kebijakan</h4>
                <p className="text-[10px] text-slate-455 mt-0.5 leading-normal">Pemetaan anggaran fiskal & dampak penawaran.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live chart preview container */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col h-[320px] shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4.5 h-4.5 text-emerald-700" />
              <span className="text-xs font-bold text-slate-800">Preview Engine Analitik</span>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-250 text-[10px]">
              <button 
                onClick={() => setPreviewCommId('beras')}
                className={`px-2 py-1 rounded cursor-pointer font-bold ${previewCommId === 'beras' ? 'bg-[#064e3b] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Beras Premium
              </button>
              <button 
                onClick={() => setPreviewCommId('cabai')}
                className={`px-2 py-1 rounded cursor-pointer font-bold ${previewCommId === 'cabai' ? 'bg-[#064e3b] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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

      {/* 4. NEWS & INSIGHTS (Government Portal/DPR Feed style) */}
      <SectionWrapper className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Kilas Berita Makro & Pangan</h2>
            <p className="text-xs text-slate-455 mt-1 font-medium">
              Catatan analitik terkait dinamika harga energi global dan intervensi belanja fiskal APBN.
            </p>
          </div>
          <Link href="/dashboard" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1">
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEWS_DATA.map((news, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:border-emerald-300 transition-all duration-300">
              <div className="flex flex-col gap-2">
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 self-start">
                  {news.tag}
                </span>
                <h3 className="text-sm font-black text-slate-800 leading-snug hover:text-emerald-700 transition-colors">
                  <Link href={`/dashboard/news/${news.slug}`}>{news.title}</Link>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                  {news.summary}
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 font-bold">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-750" /> {news.author}
                </span>
                <span>{news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 5. TEAM INNOVATOR */}
      <SectionWrapper className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center max-w-4xl mx-auto flex flex-col items-center gap-5 relative overflow-hidden shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Tim Inovasi Gemastik 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed font-medium">
          SATRISNA dirancang sebagai rancangan smart city decision support system untuk menyelaraskan kebijakan belanja negara (APBN) pangan secara transparan berbasis pembuktian data (evidence-based policy).
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center mt-2 border-t border-slate-200 pt-6 w-full text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-750" />
            <span>Kategori: Smart City / DSS</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4.5 h-4.5 text-emerald-750" />
            <span>Stabilitas Pangan Nasional</span>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
