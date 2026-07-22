"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { evaluatePolicyImpact } from '@/lib/econometrics-engine';
import GradientButton from '@/components/ui/GradientButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { 
  ArrowRight, ShieldCheck, Cpu, TrendingUp, Sparkles, 
  Sprout, CheckCircle, Award, Database, BarChart3
} from 'lucide-react';

export default function Home() {
  const [pupukSlider, setPupukSlider] = useState(40);
  const [importSlider, setImportSlider] = useState(0.8);
  const [bulogSlider, setBulogSlider] = useState(55);

  const policy = evaluatePolicyImpact(pupukSlider, importSlider, bulogSlider);

  const PARTNERS = [
    { name: 'Badan Pusat Statistik', initial: 'BPS' },
    { name: 'Perum BULOG', initial: 'BULOG' },
    { name: 'Bank Indonesia', initial: 'BI' },
    { name: 'Kementerian Keuangan', initial: 'KEMENKEU' },
    { name: 'Kementerian Pertanian', initial: 'KEMENTAN' }
  ];

  return (
    <div className="flex flex-col gap-24 pb-24 bg-white">
      
      {/* 1. HERO SECTION (Iceberg Rounded Card Layout) */}
      <SectionWrapper className="w-full">
        <div className="bg-gradient-to-tr from-[#021f13] via-[#05321f] to-[#0a5c36] text-white p-8 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:items-center">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Left Column: Headline */}
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-wider uppercase text-emerald-400 self-start shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Keputusan Penstabil Pangan Nasional BPS/BI
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
              Mengawal Stabilitas Pangan.<br />
              Menopang Ekonomi Nasional.
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold max-w-lg">
              SATRISNA mengintegrasikan model kuantitatif ekonometrika time-series ARIMA/GARCH dan simulasi Monte Carlo untuk mengoptimalkan efisiensi anggaran belanja subsidi pupuk APBN, kuota impor beras, dan logistik SPHP Bulog secara terukur.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link href="/dashboard">
                <GradientButton variant="emerald" className="px-6 py-3 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20">
                  Buka Dashboard Utama <ArrowRight className="w-4 h-4" />
                </GradientButton>
              </Link>
              <Link href="/dashboard/learning" className="text-xs text-slate-300 hover:text-emerald-400 font-bold flex items-center gap-0.5 transition-colors">
                Modul Edukasi Pangan &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Quick Simulation Form Card */}
          <div className="w-full lg:w-[380px] bg-white text-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 relative z-10 flex flex-col gap-5">
            <div>
              <span className="text-[8px] uppercase tracking-widest font-black text-slate-400 block">Kalkulator Kebijakan Cepat</span>
              <h3 className="text-sm font-black text-[#022c1b]">Simulasi Stabilitas Pangan</h3>
            </div>

            {/* Slider 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Alokasi Subsidi Pupuk:</span>
                <span className="text-emerald-700 font-black">+{pupukSlider}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5" value={pupukSlider} 
                onChange={(e) => setPupukSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
            </div>

            {/* Slider 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Kuota Impor Beras CBP:</span>
                <span className="text-emerald-700 font-black">{importSlider} Jt Ton</span>
              </div>
              <input 
                type="range" min="0.0" max="2.5" step="0.1" value={importSlider} 
                onChange={(e) => setImportSlider(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
            </div>

            {/* Output metrics inside the form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2 font-bold text-xs">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Proyeksi Volatile Food CPI:</span>
                <span className="text-slate-800 font-black">{policy.foodInflationRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Peluang Stabilitas Pasar:</span>
                <span className="text-emerald-700 font-black">{policy.stabilityIndex}% (Aman)</span>
              </div>
            </div>

            <Link href="/dashboard" className="w-full">
              <GradientButton variant="indigo" className="w-full text-xs font-bold py-3 shadow-md shadow-emerald-900/10">
                Detail Simulasi Monte Carlo
              </GradientButton>
            </Link>
          </div>

        </div>
      </SectionWrapper>

      {/* 2. PARTNERS LOGO RIBBON */}
      <SectionWrapper className="-mt-14 border-b border-slate-100 pb-10">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-slate-400 font-black text-sm tracking-wider uppercase">
          {PARTNERS.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
              <span>{p.initial}</span>
              <span className="hidden lg:inline text-[9px] text-slate-400 normal-case font-semibold">- {p.name}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 3. ABOUT US / POLICY DESCRIPTION */}
      <SectionWrapper className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-2">SATRISNA Platform</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#022c1b] leading-tight">
            Keunggulan Kuantitatif<br />
            Ekonometrika Pangan. 🌾
          </h2>
        </div>
        <div className="md:col-span-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold flex flex-col gap-4">
          <p>
            Di tengah ketidakpastian geopolitik global yang memicu lonjakan biaya logistik energi internasional serta anomali iklim el-nino, stabilitas harga pangan pokok menjadi garis pertahanan utama dalam menjaga daya beli masyarakat. SATRISNA hadir sebagai instrumen digital pendukung keputusan kebijakan pangan nasional yang kredibel dan objektif.
          </p>
          <p>
            Dengan memetakan jalur transmisi fiskal belanja negara secara real-time, kami menyelaraskan target stabilitas inflasi pangan volatile food di rentang aman 2.0% - 4.2% demi mendukung kemandirian pangan nasional menuju Indonesia Emas 2045.
          </p>
        </div>
      </SectionWrapper>

      {/* 4. PREVIEW SHOWCASE TWO-COLUMNS (Avian Grid Style with SVG vector mocks) */}
      <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: ARIMA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-emerald-350 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#022c1b] self-start shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Forecasting Studio & Volatility Modeling</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Menganalisis pergerakan harga komoditas pangan pokok secara harian dan bulanan dengan presisi tinggi. Menggunakan filter lag ARIMA untuk menangkap tren struktural jangka panjang dan GARCH untuk memetakan kluster volatilitas.
              </p>
            </div>
          </div>

          {/* SVG Mockup of TimeSeries ARIMA Line graph */}
          <div className="w-full h-24 bg-slate-50 rounded-xl border border-slate-150 relative overflow-hidden flex items-center justify-center p-2">
            <svg className="w-full h-full text-emerald-600" viewBox="0 0 200 60" fill="none">
              <path d="M10 40 Q 30 20, 50 35 T 90 20 T 130 38 T 170 15 T 190 25" stroke="#064e3b" strokeWidth="2" fill="none" />
              <path d="M130 38 T 170 15 T 190 25 L 190 45 L 130 45 Z" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="130" y1="5" x2="130" y2="55" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
              <text x="135" y="12" className="fill-slate-400 font-mono text-[7px]">Forecast Start</text>
            </svg>
          </div>

          <Link href="/dashboard/prediction" className="self-start">
            <GradientButton variant="glass" className="text-xs px-4 font-bold">
              Explore Predictions &rarr;
            </GradientButton>
          </Link>
        </div>

        {/* Card 2: Monte Carlo */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-emerald-350 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#022c1b] self-start shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Simulasi Stokastik Risiko & Kecukupan Anggaran</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Memproyeksikan 50 jalur ketidakpastian harga pangan eceran secara dinamis untuk mengukur probabilitas keberhasilan stabilisasi pasar serta dampaknya terhadap defisit neraca anggaran fiskal APBN.
              </p>
            </div>
          </div>

          {/* SVG Mockup of Monte Carlo stochastic paths */}
          <div className="w-full h-24 bg-slate-50 rounded-xl border border-slate-150 relative overflow-hidden flex items-center justify-center p-2">
            <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
              {/* Paths */}
              <path d="M10 30 Q 50 25, 100 20 T 190 10" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 35, 100 40 T 190 50" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 28, 100 25 T 190 22" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 32, 100 35 T 190 38" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              {/* Median */}
              <path d="M10 30 Q 50 30, 100 30 T 190 30" stroke="#064e3b" strokeWidth="2.5" />
              {/* Corridor bounds */}
              <line x1="10" y1="18" x2="190" y2="18" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="10" y1="42" x2="190" y2="42" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
              <text x="140" y="14" className="fill-red-500 font-mono text-[6px]">Target Bounds</text>
            </svg>
          </div>

          <Link href="/dashboard/simulation" className="self-start">
            <GradientButton variant="glass" className="text-xs px-4 font-bold">
              Explore Simulations &rarr;
            </GradientButton>
          </Link>
        </div>

      </SectionWrapper>

      {/* 5. FULL-WIDTH TEXT & FEATURES */}
      <SectionWrapper className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 items-center text-center">
        <div className="max-w-2xl flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            No shortcuts. Just expert economic forecasting you can count on.
          </h2>
          <p className="text-xs text-slate-455 font-bold uppercase tracking-wider">
            Standar Keamanan Pangan & Tata Kelola Keuangan Negara Berkelanjutan
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-200 pt-6 mt-2 text-xs font-bold text-slate-600">
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Stabilitas CBP</span>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Menjaga stok pemerintah minimal 1 juta ton.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Mitigasi Volatilitas</span>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Meredam heteroskedastisitas musiman.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Literasi Poin</span>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Edu-kuis berhadiah sembako gratis dari retail.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
