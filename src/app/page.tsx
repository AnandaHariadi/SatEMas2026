"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { evaluatePolicyImpact } from '@/lib/econometrics-engine';
import { useAuth } from '@/lib/AuthContext';
import { NEWS_DATA } from '@/lib/data';
import GradientButton from '@/components/ui/GradientButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { 
  ArrowRight, ShieldCheck, Cpu, TrendingUp, Sparkles, 
  Sprout, CheckCircle, Award, ShieldAlert, BarChart3, 
  Map, DollarSign, Activity, AlertTriangle, Globe, Calendar, User, Database
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  
  // Quick Simulator states inside the Hero form
  const [pupukSlider, setPupukSlider] = useState(40);
  const [importSlider, setImportSlider] = useState(0.8);
  const [bulogSlider, setBulogSlider] = useState(55);
  const policy = evaluatePolicyImpact(pupukSlider, importSlider, bulogSlider);

  // Interactive Price Impact Simulator states
  const [priceRise, setPriceRise] = useState(10); // in percent

  // Live calculation of social impact
  const getSocialImpact = (rise: number) => {
    const power = Math.max(50, 100 - rise * 1.2);
    const inflation = (rise * 0.28).toFixed(2);
    let status: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    let recommendation = 'Kondisi harga stabil. Pantau distribusi logistik rutin.';
    
    if (rise > 20) {
      status = 'Kritis';
      recommendation = 'STATUS DARURAT: Harga melambung tinggi. Perum BULOG wajib melepas cadangan pemerintah (CBP) sebanyak 50 ribu ton dan Kemenkeu mengalokasikan dana darurat pangan.';
    } else if (rise > 8) {
      status = 'Waspada';
      recommendation = 'STATUS WASPADA: Harga mulai mahal. BULOG disarankan melakukan operasi pasar SPHP di retail tradisional untuk menekan spekulasi pedagang.';
    }

    return { power, inflation, status, recommendation };
  };

  const social = getSocialImpact(priceRise);

  const PARTNERS = [
    { name: 'Badan Pusat Statistik', initial: 'BPS' },
    { name: 'Perum BULOG', initial: 'BULOG' },
    { name: 'Bank Indonesia', initial: 'BI' },
    { name: 'Kementerian Keuangan', initial: 'KEMENKEU' },
    { name: 'Kementerian Pertanian', initial: 'KEMENTAN' }
  ];

  const handleOpenLogin = () => {
    const loginBtn = document.querySelector('button[class*="Masuk Portal"]') as HTMLButtonElement;
    if (loginBtn) loginBtn.click();
  };

  return (
    <div className="flex flex-col gap-24 pb-24 bg-white relative">
      
      {/* Premium Engineering Dot Grid Overlay for the entire body */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-50 z-0" />

      {/* 1. HERO SECTION (Victory/SaaS Rounded Card Layout with Forest Green Gradient & Coordinates Grid) */}
      <SectionWrapper id="hero" className="w-full relative z-10">
        <div className="bg-gradient-to-tr from-[#021f13] to-[#0a5c36] text-white p-8 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:items-center border border-emerald-950">
          
          {/* Engineering coordinate lines ornament */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Left Column: Headline */}
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-black tracking-wider uppercase text-emerald-455 self-start shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              Sistem Penunjang Keputusan Terpadu BPS & Bank Indonesia
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
              Ketahanan Pangan Kuat.<br />
              Stabilitas Ekonomi Terjamin.
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold max-w-lg font-sans">
              SATRISNA mengintegrasikan pemodelan ekonometrika time-series ARIMA/GARCH terkalibrasi dengan simulasi Monte Carlo untuk mengoptimalkan anggaran subsidi pupuk APBN, kuota impor pangan, dan logistik SPHP Bulog secara terukur.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {user ? (
                <Link href="/dashboard">
                  <GradientButton variant="emerald" className="px-6 py-3 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20">
                    Masuk Dashboard Utama &rarr;
                  </GradientButton>
                </Link>
              ) : (
                <GradientButton 
                  variant="emerald" 
                  onClick={handleOpenLogin}
                  className="px-6 py-3 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20"
                >
                  Masuk Portal Penstabil &rarr;
                </GradientButton>
              )}
              <a href="#fitur" className="text-xs text-slate-300 hover:text-emerald-450 font-bold transition-colors">
                Eksplorasi Fitur Pangan &darr;
              </a>
            </div>
          </div>

          {/* Right Column: Quick Simulation Form Card */}
          <div className="w-full lg:w-[380px] bg-white text-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-200 relative z-10 flex flex-col gap-5">
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

            {user ? (
              <Link href="/dashboard/simulation" className="w-full">
                <GradientButton variant="indigo" className="w-full text-xs font-bold py-3 shadow-md shadow-emerald-950/10">
                  Detail Simulasi Monte Carlo
                </GradientButton>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full">
                <GradientButton variant="indigo" className="w-full text-xs font-bold py-3 shadow-md shadow-emerald-950/10">
                  Masuk Untuk Akses Detail
                </GradientButton>
              </button>
            )}
          </div>

        </div>
      </SectionWrapper>

      {/* 2. PARTNERS LOGO RIBBON */}
      <SectionWrapper id="mitra" className="-mt-14 border-b border-slate-150 pb-10 relative z-10">
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

      {/* 3. REDESIGNED ABOUT US: Premium Layout Grid (Keunggulan Kuantitatif Ekonometrika) */}
      <SectionWrapper id="tentang" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Editorial forest-green statement block */}
        <div className="lg:col-span-1 bg-gradient-to-tr from-[#021f13] to-[#0a5c36] text-white p-8 rounded-3xl flex flex-col justify-between border border-emerald-950 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">SATRISNA Filosofi</span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Mengapa Kuantitatif<br />
              Ekonometrika Pangan?
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-6 relative z-10">
            Di tengah ketidakpastian geopolitik global yang memicu lonjakan biaya logistik energi internasional serta anomali iklim el-nino, stabilitas harga pangan pokok menjadi garis pertahanan utama dalam menjaga daya beli masyarakat.
          </p>
        </div>

        {/* Right Side: Dual-card grid with data-credibility and APBN synergy details */}
        <div className="lg:col-span-2 flex flex-col gap-6 justify-between">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#022c1b] mb-1">
              <Database className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-black">Kredibilitas Keputusan Berbasis Data Terintegrasi</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              SATRISNA hadir sebagai instrumen digital pendukung keputusan kebijakan pangan nasional yang kredibel dan objektif. Dengan memetakan jalur transmisi fiskal belanja negara secara real-time, kami menyelaraskan target stabilitas inflasi pangan volatile food di rentang aman 2.0% - 4.2% demi mendukung kemandirian pangan nasional.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#022c1b] mb-1">
              <Sprout className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-black">Optimalisasi Anggaran Subsidi & Penyangga Pasar</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Menghubungkan elastisitas alokasi subsidi input pertanian dengan kecukupan pasok pergudangan eceran secara ilmiah. Penyelarasan ini meminimalisir deviasi anggaran belanja fiskal dan memaksimalkan efektivitas penyaluran beras stabilisasi Bulog.
            </p>
          </div>

        </div>

      </SectionWrapper>

      {/* 4. INTERACTIVE PRICE IMPACT SIMULATOR */}
      <SectionWrapper className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-20" />
        
        <div className="border-b border-slate-200 pb-4 relative z-10">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">Edukasi Transmisi Sosial</span>
          <h3 className="text-lg font-black text-slate-800">Simulator Dampak Harga Pangan Terhadap Daya Beli</h3>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Geser slider untuk melihat bagaimana lonjakan harga beras di pasar eceran secara langsung memicu inflasi volatile food dan memengaruhi daya beli dompet rakyat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          
          {/* Left Column: Sliders */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">Harga Komoditas Eceran</span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Kenaikan Harga Beras Premium:</span>
                <span className="text-red-655 font-black">+{priceRise}%</span>
              </div>
              <input 
                type="range" min="0" max="30" step="1" value={priceRise}
                onChange={(e) => setPriceRise(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#ef4444]"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                <span>0% Stabil (Normal)</span>
                <span>30% Shock Pasok (Krisis)</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Live Indicators */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold">
              
              {/* Power gauge */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 uppercase">Daya Beli Dompet Rakyat</span>
                <span className="text-xl font-black text-slate-800">{social.power.toFixed(0)}%</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full self-start ${
                  social.status === 'Kritis' ? 'bg-red-50 text-red-700 border border-red-200' :
                  social.status === 'Waspada' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  Status: {social.status}
                </span>
              </div>

              {/* Inflation gauge */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 uppercase">Dampak Laju Inflasi IHK</span>
                <span className="text-xl font-black text-red-650">+{social.inflation}%</span>
                <span className="text-[8px] text-slate-400 font-medium">Volatile Food Basket</span>
              </div>

              {/* Points equivalency logic */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 uppercase">Voucher Subsidi Mitra</span>
                <span className="text-xl font-black text-[#022c1b]">
                  {priceRise > 15 ? 'Voucher 10kg Gratis' : 'Voucher 5kg Gratis'}
                </span>
                <span className="text-[8px] text-slate-400 font-medium">Melalui Dompet Poin Kuis</span>
              </div>

            </div>

            {/* Recommendation panel */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-3 text-xs text-slate-655 font-semibold leading-relaxed shadow-sm">
              <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#022c1b] block mb-1">Rekomendasi Respons Kebijakan:</span>
                <p>{social.recommendation}</p>
              </div>
            </div>

          </div>

        </div>
      </SectionWrapper>

      {/* 5. PREVIEW SHOWCASE TWO-COLUMNS (Avian Grid Style with SVG vector mocks in Forest Green background) */}
      <SectionWrapper id="fitur" className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Card 1: ARIMA */}
        <div className="bg-[#021f13] border border-emerald-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-[#10b981] transition-all duration-300 group text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-850 text-emerald-400 self-start shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-2">Studio Peramalan & Pemodelan Volatilitas Harga</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Menganalisis pergerakan harga komoditas pangan pokok secara harian dan bulanan dengan presisi tinggi. Menggunakan filter lag ARIMA untuk menangkap tren struktural jangka panjang dan GARCH untuk memetakan kluster volatilitas.
              </p>
            </div>
          </div>

          {/* SVG Mockup of TimeSeries ARIMA Line graph */}
          <div className="w-full h-24 bg-[#01140c] rounded-xl border border-emerald-950 relative overflow-hidden flex items-center justify-center p-2 z-10">
            <svg className="w-full h-full text-emerald-600" viewBox="0 0 200 60" fill="none">
              <path d="M10 40 Q 30 20, 50 35 T 90 20 T 130 38 T 170 15 T 190 25" stroke="#10b981" strokeWidth="2.5" fill="none" />
              <path d="M130 38 T 170 15 T 190 25 L 190 45 L 130 45 Z" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="130" y1="5" x2="130" y2="55" stroke="#05321f" strokeWidth="1" strokeDasharray="3,3" />
              <text x="135" y="12" className="fill-emerald-650 font-mono text-[7px]">Awal Peramalan</text>
            </svg>
          </div>

          {user ? (
            <Link href="/dashboard/prediction" className="self-start relative z-10">
              <GradientButton variant="emerald" className="text-xs px-4 font-bold">
                Eksplorasi Hasil Prediksi &rarr;
              </GradientButton>
            </Link>
          ) : (
            <button onClick={handleOpenLogin} className="self-start relative z-10">
              <GradientButton variant="emerald" className="text-xs px-4 font-bold">
                Eksplorasi Hasil Prediksi (Masuk) &rarr;
              </GradientButton>
            </button>
          )}
        </div>

        {/* Card 2: Monte Carlo */}
        <div className="bg-[#021f13] border border-emerald-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-[#10b981] transition-all duration-300 group text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-850 text-emerald-400 self-start shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-2">Simulasi Risiko Stokastik Monte Carlo</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Memproyeksikan 50 jalur ketidakpastian harga pangan eceran secara dinamis untuk mengukur probabilitas keberhasilan stabilisasi pasar serta dampaknya terhadap defisit neraca anggaran fiskal APBN.
              </p>
            </div>
          </div>

          {/* SVG Mockup of Monte Carlo stochastic paths */}
          <div className="w-full h-24 bg-[#01140c] rounded-xl border border-emerald-950 relative overflow-hidden flex items-center justify-center p-2 z-10">
            <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
              <path d="M10 30 Q 50 25, 100 20 T 190 10" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 35, 100 40 T 190 50" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 28, 100 25 T 190 22" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 32, 100 35 T 190 38" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
              <path d="M10 30 Q 50 30, 100 30 T 190 30" stroke="#10b981" strokeWidth="2.5" />
              <line x1="10" y1="18" x2="190" y2="18" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="10" y1="42" x2="190" y2="42" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
              <text x="140" y="14" className="fill-red-500 font-mono text-[6px]">Batas Koridor Target</text>
            </svg>
          </div>

          {user ? (
            <Link href="/dashboard/simulation" className="self-start relative z-10">
              <GradientButton variant="emerald" className="text-xs px-4 font-bold">
                Eksplorasi Hasil Simulasi &rarr;
              </GradientButton>
            </Link>
          ) : (
            <button onClick={handleOpenLogin} className="self-start relative z-10">
              <GradientButton variant="emerald" className="text-xs px-4 font-bold">
                Eksplorasi Hasil Simulasi (Masuk) &rarr;
              </GradientButton>
            </button>
          )}
        </div>

      </SectionWrapper>

      {/* 6. SITABA REGIONAL WARNING SYSTEM PREVIEW */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">Integrasi Peta Digital Keamanan Pangan</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#022c1b] leading-tight">
            Pemantauan Geografis Kerawanan Pasokan Daerah
          </h2>
          <p className="text-xs sm:text-sm text-slate-505 leading-relaxed font-medium">
            SATRISNA memetakan alarm status kerawanan pangan (Aman, Waspada, Darurat) secara dinamis di seluruh pulau besar Indonesia. Memudahkan regulator memantau titik defisit pasokan secara cepat.
          </p>
          {user ? (
            <Link href="/dashboard">
              <GradientButton variant="indigo" className="text-xs self-start">
                Buka Peta Stabilitas &rarr;
              </GradientButton>
            </Link>
          ) : (
            <button onClick={handleOpenLogin} className="self-start">
              <GradientButton variant="indigo" className="text-xs font-bold">
                Masuk Untuk Buka Peta &rarr;
              </GradientButton>
            </button>
          )}
        </div>

        {/* Mini geographical mock map widget */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4 relative overflow-hidden h-[240px] items-center justify-center">
          <Map className="w-8 h-8 text-emerald-700/60 absolute top-4 left-4" />
          <svg className="w-full max-w-[360px] h-[160px] text-slate-400" viewBox="0 0 180 80">
            {/* Sumatra */}
            <path d="M15 25 L35 45 L40 55 L35 60 L25 50 L10 35 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.5" />
            {/* Java */}
            <path d="M40 60 L50 60 L70 65 L85 67 L80 70 L60 67 L40 62 Z" fill="#d1fae5" stroke="#10b981" strokeWidth="0.5" />
            {/* Kalimantan */}
            <path d="M60 28 L80 25 L90 35 L85 48 L70 50 L60 40 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.5" />
            {/* Sulawesi */}
            <path d="M100 32 L115 32 L115 36 L105 40 L112 50 L100 46 L95 38 Z" fill="#d1fae5" stroke="#10b981" strokeWidth="0.5" />
            {/* Papua */}
            <path d="M140 35 L160 33 L175 40 L175 55 L155 53 L140 42 Z" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.5" />
            <text x="145" y="46" className="fill-red-800 text-[5.5px] font-black uppercase">PAPUA: DARURAT</text>
            <text x="45" y="75" className="fill-emerald-800 text-[5.5px] font-black uppercase">JAWA: AMAN</text>
          </svg>
        </div>
      </SectionWrapper>

      {/* NEW: 7. KILAS BERITA MAKRO & PANGAN (Editorial DPR Feed style - Dynamic news linking) */}
      <SectionWrapper className="flex flex-col gap-8 relative z-10 border-t border-slate-100 pt-16">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">Informasi Kebijakan</span>
            <h2 className="text-2xl font-black text-[#022c1b]">Kilas Berita Makro & Analisis Pangan</h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Kompilasi artikel publikasi analitis terkait gejolak pangan global, stabilitas harga, dan fiskal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {NEWS_DATA.slice(0, 2).map((news, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-5 shadow-sm hover:border-[#10b981] transition-all duration-300 group">
              <div className="flex flex-col gap-3">
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-850 self-start">
                  {news.tag}
                </span>
                
                {/* Dynamic routing gate: requires login check */}
                <h3 className="text-base font-black text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                  {user ? (
                    <Link href={`/dashboard/news/${news.slug}`}>{news.title}</Link>
                  ) : (
                    <button onClick={handleOpenLogin} className="text-left font-black">
                      {news.title}
                    </button>
                  )}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">
                  {news.summary}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-bold">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-700" /> {news.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {news.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 8. FULL-WIDTH TEXT & FEATURES */}
      <SectionWrapper className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 items-center text-center relative z-10">
        <div className="max-w-2xl flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
            Akurasi Ilmiah. Pemodelan Profesional yang Dapat Diandalkan.
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
