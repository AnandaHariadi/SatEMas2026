"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { evaluatePolicyImpact } from '@/lib/econometrics-engine';
import GradientButton from '@/components/ui/GradientButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { 
  ArrowRight, ShieldCheck, Cpu, TrendingUp, Sparkles, 
  HelpCircle, Sprout, BarChart2, CheckCircle, Globe
} from 'lucide-react';

export default function Home() {
  // Quick Simulator states inside the Hero form
  const [pupukSlider, setPupukSlider] = useState(40);
  const [importSlider, setImportSlider] = useState(0.8);
  const [bulogSlider, setBulogSlider] = useState(55);

  const policy = evaluatePolicyImpact(pupukSlider, importSlider, bulogSlider);

  // Partners ribbon list
  const PARTNERS = [
    { name: 'Badan Pusat Statistik', initial: 'BPS' },
    { name: 'Perum BULOG', initial: 'BULOG' },
    { name: 'Bank Indonesia', initial: 'BI' },
    { name: 'Kementerian Keuangan', initial: 'KEMENKEU' },
    { name: 'Kementerian Pertanian', initial: 'KEMENTAN' }
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      
      {/* 1. HERO SECTION (Iceberg Rounded Card Layout) */}
      <SectionWrapper className="w-full">
        <div className="bg-gradient-to-tr from-[#032215] via-[#05321f] to-[#0a5c36] text-white p-6 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:items-center">
          
          {/* Background vector graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

          {/* Left Column: Headline */}
          <div className="flex-1 flex flex-col gap-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 self-start">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Keputusan Penstabil Pangan Nasional
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Power You Can Rely On.<br />
              Food Security You Can Trust.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-lg">
              Integrasi analitik ekonometrika time-series ARIMA/GARCH dengan simulasi fiskal Monte Carlo. Membantu perumusan intervensi subsidi tani, impor pangan, dan logistik beras Bulog secara akurat.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link href="/dashboard">
                <GradientButton variant="emerald">
                  Mulai Analisis <ArrowRight className="w-4 h-4" />
                </GradientButton>
              </Link>
              <Link href="/dashboard/learning" className="text-xs text-emerald-400 hover:text-emerald-350 font-bold flex items-center gap-0.5">
                Modul Edukasi Pangan &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Quick Simulation Form Card (Iceberg Style) */}
          <div className="w-full lg:w-[380px] bg-white text-slate-850 p-6 rounded-2xl shadow-2xl border border-white/20 relative z-10 flex flex-col gap-4">
            <div>
              <span className="text-[8px] uppercase tracking-widest font-black text-slate-400 block">Kalkulator Cepat</span>
              <h3 className="text-sm font-black text-slate-800">Simulasi Stabilitas Pangan</h3>
            </div>

            {/* Slider 1 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Subsidi Pupuk:</span>
                <span className="text-emerald-700">+{pupukSlider}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5" value={pupukSlider} 
                onChange={(e) => setPupukSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
            </div>

            {/* Slider 2 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Kuota Impor Beras:</span>
                <span className="text-emerald-700">{importSlider} Jt Ton</span>
              </div>
              <input 
                type="range" min="0.0" max="2.5" step="0.1" value={importSlider} 
                onChange={(e) => setImportSlider(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
            </div>

            {/* Output metrics inside the form */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>Proyeksi Volatile Food CPI:</span>
                <span className="text-slate-800">{policy.foodInflationRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>Peluang Stabilitas Pasar:</span>
                <span className="text-emerald-700">{policy.stabilityIndex}% (Aman)</span>
              </div>
            </div>

            <Link href="/dashboard" className="w-full">
              <GradientButton variant="indigo" className="w-full text-xs">
                Detail Simulasi Monte Carlo
              </GradientButton>
            </Link>
          </div>

        </div>
      </SectionWrapper>

      {/* 2. PARTNERS LOGO RIBBON (Iceberg Marquee Style) */}
      <SectionWrapper className="-mt-10 border-b border-slate-100 pb-8">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-slate-400 font-black text-sm tracking-wider uppercase">
          {PARTNERS.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
              <span>{p.initial}</span>
              <span className="hidden lg:inline text-[9px] text-slate-400 normal-case font-medium">- {p.name}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 3. ABOUT US / POLICY DESCRIPTION */}
      <SectionWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-2">SATRISNA Platform</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
            Trusted Econometrics.<br />
            Cool Under Volatility. 🌾
          </h2>
        </div>
        <div className="md:col-span-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium flex flex-col gap-4">
          <p>
            Di era guncangan logistik global dan anomali iklim el-nino, stabilitas pangan menjadi pilar pertahanan daya beli masyarakat. SATRISNA menyediakan decision support system (DSS) terpadu bagi pembuat kebijakan untuk menganalisis peramalan harga eceran.
          </p>
          <p>
            Dengan meminimalisir tebakan dalam penyusunan stimulus fiskal, kami menyelaraskan target stabilitas inflasi pangan volatile food nasional di rentang ideal 2.0% - 4.2%, mendukung kemandirian pangan menuju visi Indonesia Emas 2045.
          </p>
        </div>
      </SectionWrapper>

      {/* 4. PREVIEW SHOWCASE TWO-COLUMNS (Avian Grid Style) */}
      <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:border-emerald-350 transition-all duration-300">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#064e3b] self-start shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 mb-1.5">ARIMA & GARCH Forecasting</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Uji peramalan time-series harga eceran beras premium dan cabai rawit merah secara objektif dengan parameter autoregressive dan conditional heteroskedasticity.
            </p>
          </div>
          <Link href="/dashboard/prediction">
            <GradientButton variant="glass" className="text-xs self-start px-4">
              Explore Predictions &rarr;
            </GradientButton>
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:border-emerald-350 transition-all duration-300">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#064e3b] self-start shadow-sm">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 mb-1.5">Monte Carlo Simulation</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Simulasikan 50 sebaran acak masa depan terhadap gejolak pasokan untuk menghitung tingkat keyakinan target dan mitigasi risiko deficit belanja APBN.
            </p>
          </div>
          <Link href="/dashboard/simulation">
            <GradientButton variant="glass" className="text-xs self-start px-4">
              Explore Simulations &rarr;
            </GradientButton>
          </Link>
        </div>

      </SectionWrapper>

      {/* 5. FULL-WIDTH TEXT & FEATURES (Iceberg checklist style) */}
      <SectionWrapper className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 items-center text-center">
        <div className="max-w-2xl flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            No shortcuts. Just expert economic forecasting you can count on.
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Dibangun dengan standar pemodelan BPS dan koordinasi fiskal kementerian pusat.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-200 pt-6 mt-2 text-xs font-bold text-slate-655">
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Stabilitas CBP</span>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Menjaga stok pemerintah minimal 1 juta ton.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Mitigasi Volatilitas</span>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Meredam heteroskedastisitas musiman.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-800 font-black block mb-0.5">Literasi Poin</span>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Edu-kuis berhadiah sembako gratis dari retail.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
