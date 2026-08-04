"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { evaluatePolicyImpact } from '@/lib/econometrics-engine';
import { useAuth } from '@/lib/AuthContext';
import { NEWS_DATA } from '@/lib/data';
import GradientButton from '@/components/ui/GradientButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import dynamic from 'next/dynamic';
import { REGIONS, RegionalData } from '@/components/visualization/IndonesiaMap';
import { 
  ShieldCheck, TrendingUp, Activity, Map, BarChart3, 
  Info, AlertTriangle, Rss, Lock, Database, Zap, 
  CheckCircle2, Layers, Cpu, Radio, ArrowUpRight, ChevronRight, Scale, LayoutDashboard,
  ArrowRight, Sparkles, Sliders
} from 'lucide-react';

// Dynamically load Leaflet OpenStreetMap to prevent SSR build errors
const IndonesiaOSMMap = dynamic(() => import('@/components/visualization/IndonesiaOSMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-900/40 border border-slate-800 rounded-3xl flex items-center justify-center text-xs text-slate-500 font-mono animate-pulse">
      Memuat Peta Geospasial (OpenStreetMap)...
    </div>
  )
});

export default function Home() {
  const { user } = useAuth();
  
  // Hero Interactive Tab state
  const [activeHeroTab, setActiveHeroTab] = useState<'status' | 'arima' | 'fiskal'>('status');

  // Quick Simulator states
  const [pupukSlider, setPupukSlider] = useState(40);
  const [importSlider, setImportSlider] = useState(0.8);
  const [bulogSlider, setBulogSlider] = useState(55);
  const policy = evaluatePolicyImpact(pupukSlider, importSlider, bulogSlider);

  // Price Transmission Simulator state
  const [priceRise, setPriceRise] = useState(10);

  // Selected region state for the map
  const [selectedRegion, setSelectedRegion] = useState<RegionalData>(REGIONS[1]); // Default Java

  // Live calculation of social impact
  const getSocialImpact = (rise: number) => {
    const power = Math.max(50, 100 - rise * 1.2);
    const inflation = (rise * 0.28).toFixed(2);
    let status: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    let recommendation = 'Kondisi harga eceran nasional stabil. Pemantauan pasok logistik rutin di tingkat pasar tradisional.';
    
    if (rise > 20) {
      status = 'Kritis';
      recommendation = 'STATUS DARURAT PANGAN: Terjadi lonjakan harga kritis. BULOG wajib mengintervensi cadangan beras pemerintah (CBP) minimal 50 ribu ton dan Kemenkeu merilis dana insentif daerah.';
    } else if (rise > 8) {
      status = 'Waspada';
      recommendation = 'STATUS WASPADA INFLASI: Harga berangsur naik. BULOG disarankan melakukan penyeimbangan pasokan SPHP di 14 pasar eceran utama untuk menekan spekulasi agen.';
    }

    return { power, inflation, status, recommendation };
  };

  const social = getSocialImpact(priceRise);

  const PARTNERS = [
    { name: 'Badan Pusat Statistik', initial: 'BPS RI', role: 'SP2KP & IHK Data' },
    { name: 'Perum BULOG', initial: 'BULOG', role: 'CBP & Logistik SPHP' },
    { name: 'Bank Indonesia', initial: 'BANK INDONESIA', role: 'TPIP Inflation Control' },
    { name: 'Kementerian Keuangan', initial: 'KEMENKEU RI', role: 'Pengawas APBN & Subsidi' },
    { name: 'Kementerian Pertanian', initial: 'KEMENTAN RI', role: 'Data Panen & Tani' }
  ];

  const handleOpenLogin = () => {
    const loginBtn = document.querySelector('button[class*="Masuk Portal"]') as HTMLButtonElement;
    if (loginBtn) loginBtn.click();
  };

  return (
    <div className="flex flex-col gap-24 pb-24 bg-white relative font-sans text-slate-800 overflow-hidden">
      
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40 z-0" />

      {/* ------------------------------------------------------------- */}
      {/* 0. LIVE RUNNING TICKER RIBBON */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0b0f19] text-white py-2.5 px-4 border-b border-slate-800 text-[10px] font-mono relative z-20 overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-emerald-400 uppercase tracking-widest">[ LIVE DATA RADAR ]</span>
          </div>

          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">STOK CBP:</span>
              <span className="text-emerald-400 font-black">1.450.000 TON (CUKUP)</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">VOLATILE FOOD CPI:</span>
              <span className="text-amber-400 font-black">+2.80% (WASPADA)</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">HARGA SPHP RATA-RATA:</span>
              <span className="text-white font-black">Rp 12.500 / KG</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">STATUS PAPUA:</span>
              <span className="text-red-400 font-black">DEFISIT LOGISTIK</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">PRESI-STAT:</span>
              <span className="text-emerald-400 font-black">ARIMA R² 94.2%</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-bold shrink-0">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SURVEI SP2KP BPS</span>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. NEXT-GEN ASYMMETRIC COMMAND CENTER HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper id="hero" className="w-full relative z-10 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (7-Cols): Editorial Headline & Positioning */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex items-center gap-2.5 self-start">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-[9px] font-mono tracking-widest uppercase text-emerald-800 font-bold shadow-2xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                PORTAL RESMI STABILITAS PANGAN NASIONAL
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
              Sistem Informasi <br />
              <span className="bg-gradient-to-r from-[#022c1b] via-[#047857] to-[#10b981] bg-clip-text text-transparent">
                Ekonometrika &amp; Fiskal.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold max-w-2xl">
              SATRISNA mengintegrasikan peramalan time-series ARIMA/GARCH dengan simulasi stokastik Monte Carlo untuk mengukur kecukupan cadangan beras pemerintah, menekan volatilitas harga eceran, dan mengamankan anggaran APBN secara ilmiah.
            </p>

            {/* Quick Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Link href="/dashboard">
                  <GradientButton variant="emerald" className="px-7 py-4 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 rounded-2xl flex items-center gap-2">
                    <LayoutDashboard className="w-4.5 h-4.5" /> Jelajahi Dashboard Utama
                  </GradientButton>
                </Link>
              ) : (
                <GradientButton 
                  variant="emerald" 
                  onClick={handleOpenLogin}
                  className="px-7 py-4 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 rounded-2xl flex items-center gap-2"
                >
                  <ShieldCheck className="w-4.5 h-4.5" /> Masuk Portal Penstabil
                </GradientButton>
              )}

              <Link href="/dashboard/map">
                <button className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-lg">
                  <Map className="w-4.5 h-4.5 text-emerald-400" /> Peta Geospasial SITABA
                </button>
              </Link>
            </div>

            {/* Micro Feature Bullet Points */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500 border-t border-slate-150">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Terintegrasi SP2KP BPS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Intervensi SPHP BULOG
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Model GARCH Terkalibrasi
              </span>
            </div>

          </div>

          {/* Right Column (5-Cols): Interactive Command Terminal Glass Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-[#0b0f19] text-white p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col gap-6">
            
            {/* Terminal Top Accent */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-400 font-bold ml-2">SATRISNA COMMAND TERMINAL</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">v2.4 ONLINE</span>
            </div>

            {/* Interactive Tab Controller */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveHeroTab('status')}
                className={`py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                  activeHeroTab === 'status' ? 'bg-[#10b981] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kerawanan
              </button>
              <button
                onClick={() => setActiveHeroTab('arima')}
                className={`py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                  activeHeroTab === 'arima' ? 'bg-[#10b981] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ARIMA
              </button>
              <button
                onClick={() => setActiveHeroTab('fiskal')}
                className={`py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                  activeHeroTab === 'fiskal' ? 'bg-[#10b981] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fiskal APBN
              </button>
            </div>

            {/* Tab Views */}
            {activeHeroTab === 'status' && (
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-white">Status Kerawanan Regional</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Deteksi cepat defisit pasok eceran</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[8px] font-mono font-bold">1 PROV DEFISIT</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-300">Jawa &amp; Bali</span>
                    <span className="text-emerald-400 font-bold text-[10px]">AMAN (CBP 550rb Ton)</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-300">Sumatera Utara</span>
                    <span className="text-amber-400 font-bold text-[10px]">WASPADA (Rp 14.800/Kg)</span>
                  </div>
                  <div className="p-2.5 bg-red-950/40 rounded-xl border border-red-800/60 flex justify-between items-center">
                    <span className="text-red-300 font-bold">Papua Timur</span>
                    <span className="text-red-400 font-bold text-[10px]">DARURAT (Cuaca Ombak)</span>
                  </div>
                </div>

                <Link href="/dashboard/map" className="mt-1">
                  <button className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Map className="w-3.5 h-3.5" /> Buka Peta SITABA Terpadu
                  </button>
                </Link>
              </div>
            )}

            {activeHeroTab === 'arima' && (
              <div className="flex flex-col gap-3.5">
                <div>
                  <h4 className="text-xs font-black text-white">Model ARIMA(1,1,1) &amp; GARCH(1,1)</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Proyeksi harga eceran Beras 30 hari</p>
                </div>

                <div className="w-full h-28 bg-[#01140c] rounded-xl border border-emerald-900/60 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full text-emerald-400" viewBox="0 0 200 60" fill="none">
                    <path d="M10 42 Q 40 25, 80 35 T 130 20 T 190 15" stroke="#10b981" strokeWidth="2.5" fill="none" />
                    <path d="M130 20 T 190 15 L 190 50 L 130 50 Z" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="130" y1="5" x2="130" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="135" y="14" className="fill-emerald-400 font-mono text-[7px]">Batas Prediksi</text>
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700 font-bold">
                  <span>RMSE: 42.80</span>
                  <span>GARCH Volatilitas: 1.14%</span>
                </div>
              </div>
            )}

            {activeHeroTab === 'fiskal' && (
              <div className="flex flex-col gap-3.5">
                <div>
                  <h4 className="text-xs font-black text-white">Simulator Kebijakan APBN</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Alokasi subsidi pupuk &amp; kuota impor</p>
                </div>

                <div className="flex flex-col gap-3 text-xs font-semibold">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-300">Subsidi Pupuk Tani:</span>
                      <span className="text-emerald-400 font-black">+{pupukSlider}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5" value={pupukSlider} 
                      onChange={(e) => setPupukSlider(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-300">Kuota Impor CBP:</span>
                      <span className="text-emerald-400 font-black">{importSlider} Jt Ton</span>
                    </div>
                    <input 
                      type="range" min="0.0" max="2.5" step="0.1" value={importSlider} 
                      onChange={(e) => setImportSlider(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">Volatile Food CPI:</span>
                  <span className="text-emerald-400 font-black text-sm">{policy.foodInflationRate.toFixed(2)}%</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 2. INSTITUTIONAL IMPACT METRICS RIBBON */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-white hover:border-emerald-500 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Cadangan Beras Govt</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">1,45</span>
              <span className="text-xs font-bold text-emerald-600">Juta Ton</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Dikelola Perum BULOG untuk operasi stabilisasi pasar SPHP.</p>
          </div>

          <div className="bg-white hover:border-amber-500 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Target Volatile Food</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">3,82%</span>
              <span className="text-xs font-bold text-amber-600">CPI Max</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Batas koridor kestabilan harga pangan yang diawasi Bank Indonesia.</p>
          </div>

          <div className="bg-white hover:border-blue-500 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Cakupan Geospasial</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">38</span>
              <span className="text-xs font-bold text-blue-600">Provinsi</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Terhubung dengan jaringan pemantauan eceran SP2KP BPS RI.</p>
          </div>

          <div className="bg-white hover:border-red-500 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Akurasi Peramalan</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors">94,2%</span>
              <span className="text-xs font-bold text-red-600">R-Squared</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Model ARIMA &amp; GARCH terkalibrasi data historis 10 tahun.</p>
          </div>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 3. STRATEGIC INSTITUTIONAL ACCREDITATION GRID */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper id="mitra" className="border-y border-slate-150 py-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-400">
              TERINTEGRASI DENGAN INFRASTRUKTUR DATA NASIONAL
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PARTNERS.map((p, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 hover:bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition-all duration-200 shadow-2xs group cursor-default"
              >
                <span className="text-xs font-black text-slate-800 group-hover:text-[#022c1b] transition-colors">{p.initial}</span>
                <span className="text-[9px] text-slate-400 font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 4. ASYMMETRIC PORTAL CAPABILITIES SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper id="fitur" className="flex flex-col gap-10 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-150 pb-6">
          <div>
            <span className="text-[9px] font-mono font-black text-emerald-800 uppercase tracking-widest block mb-1">[ PILAR KEUNGGULAN UTAMA ]</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#022c1b]">Kapabilitas Ekonometrika &amp; Pengambilan Keputusan</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1 max-w-2xl">
              Tiga pilar kuantitatif terintegrasi yang dirancang untuk mengawal kestabilan harga beras eceran dan ketahanan stok nasional.
            </p>
          </div>

          <span className="text-[10px] font-mono text-slate-400 font-bold border border-slate-200 px-3.5 py-2 rounded-2xl bg-slate-50">
            METODOLOGI KEMENKEU &amp; BPS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border-t-4 border-t-emerald-600 border-x border-b border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#022c1b] font-black text-xs">
                01
              </div>
              <h3 className="text-base font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                Peramalan ARIMA &amp; GARCH
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Menganalisis pergerakan harga eceran harian dan bulanan. Menggunakan filter ARIMA untuk tren panjang dan GARCH untuk kluster volatilitas.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col gap-1 font-mono text-[9px] text-slate-600">
              <span className="text-emerald-800 font-bold">Persamaan Volatilitas:</span>
              <span className="text-slate-800 font-bold">&sigma;²_t = &omega; + &alpha;&epsilon;²_{`{t-1}`} + &beta;&sigma;²_{`{t-1}`}</span>
            </div>

            {user ? (
              <Link href="/dashboard/prediction">
                <button className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Studio Peramalan <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Studio Peramalan <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 2 */}
          <div className="bg-white border-t-4 border-t-blue-600 border-x border-b border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-black text-xs">
                02
              </div>
              <h3 className="text-base font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                Simulasi Monte Carlo (50 Jalur)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Memproyeksikan 50 skenario ketidakpastian stokastik untuk mengukur efektivitas subsidi pupuk APBN dan kuota impor SPHP Bulog.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col gap-1 font-mono text-[9px] text-slate-600">
              <span className="text-blue-800 font-bold">Koridor Kepercayaan:</span>
              <span className="text-slate-800 font-bold">Interval 95% Confidence Level</span>
            </div>

            {user ? (
              <Link href="/dashboard/simulation">
                <button className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Simulator Fiskal <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Simulator Fiskal <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 3 */}
          <div className="bg-white border-t-4 border-t-red-500 border-x border-b border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-900 font-black text-xs">
                03
              </div>
              <h3 className="text-base font-black text-slate-800 group-hover:text-red-700 transition-colors">
                Transmisi Daya Beli &amp; Edukasi
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Menghitung dampak inflasi volatile food terhadap dompet rumah tangga serta program kuis poin edukasi sembako gratis.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col gap-1 font-mono text-[9px] text-slate-600">
              <span className="text-red-800 font-bold">Redeem Poin Kuis:</span>
              <span className="text-slate-800 font-bold">Voucher Beras 5Kg - 10Kg Mitra Retail</span>
            </div>

            {user ? (
              <Link href="/dashboard/learning">
                <button className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Edukasi Pangan <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-[#022c1b] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Edukasi Pangan <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE PRICE TRANSMISSION CALCULATOR */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="bg-slate-50 p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-md relative z-10 overflow-hidden">
        <div className="border-b border-slate-200 pb-6 relative z-10 flex flex-col gap-1.5">
          <span className="text-[9px] font-mono font-black text-emerald-800 uppercase tracking-widest">[ SIMULATOR TRANSMISI SOSIAL ]</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Dampak Harga Pangan Terhadap Daya Beli Masyarakat</h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl">
            Simulasi interaktif pengaruh lonjakan harga Beras Premium di pasar eceran terhadap volatile food CPI nasional dan penyusutan daya beli ril rumah tangga.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 relative z-10">
          
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 flex flex-col gap-6 justify-between shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[8px] font-mono uppercase tracking-widest font-black text-slate-400">Variabel Bebas</span>
              <h4 className="text-xs font-black text-slate-800">Harga Eceran Komoditas</h4>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-xs font-bold items-end">
                <span className="text-slate-600 font-medium">Kenaikan Beras Premium:</span>
                <span className="text-2xl font-black text-red-600">+{priceRise}%</span>
              </div>
              <input 
                type="range" min="0" max="30" step="1" value={priceRise}
                onChange={(e) => setPriceRise(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-[#ef4444]"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-mono font-bold">
                <span>0% STABIL</span>
                <span>30% KELANGKAAN PASOKAN</span>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 leading-normal font-mono border-t border-slate-100 pt-4">
              Koefisien elastisitas dihitung berdasarkan integrasi regresi data time-series historis BPS.
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[140px] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#022c1b] text-white px-2.5 py-0.5 text-[7px] font-mono uppercase tracking-wider rounded-bl-xl">
                  Hasil Ril
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Daya Beli Dompet Rakyat</span>
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{social.power.toFixed(0)}%</span>
                </div>
                <span className={`text-[8px] px-2.5 py-1 rounded-xl font-mono uppercase font-black text-center mt-3 ${
                  social.status === 'Kritis' ? 'bg-red-50 text-red-700 border border-red-200' :
                  social.status === 'Waspada' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  KONDISI: {social.status}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[140px] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#022c1b] text-white px-2.5 py-0.5 text-[7px] font-mono uppercase tracking-wider rounded-bl-xl">
                  CPI IHK
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Dampak Laju Inflasi</span>
                  <span className="text-3xl font-black text-red-600 tracking-tight">+{social.inflation}%</span>
                </div>
                <span className="text-[8px] text-slate-400 font-medium font-mono tracking-wider block mt-3">
                  KERANJANG VOLATILE FOOD
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[140px] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#022c1b] text-white px-2.5 py-0.5 text-[7px] font-mono uppercase tracking-wider rounded-bl-xl">
                  Voucher Retail
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Subsidi Beras Kuis</span>
                  <span className="text-base font-black text-[#022c1b] tracking-tight block mt-1">
                    {priceRise > 15 ? 'VOUCHER BERAS 10KG' : 'VOUCHER BERAS 5KG'}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-medium font-mono tracking-wider block mt-3">
                  MITRA CSR RETAILER BULOG
                </span>
              </div>

            </div>

            <div className="bg-white p-5 rounded-3xl border-l-4 border-l-[#022c1b] border-y border-r border-slate-200 shadow-sm flex flex-col gap-1.5">
              <span className="text-[9px] font-mono tracking-widest font-black uppercase text-[#022c1b]">Rekomendasi Kebijakan (Regulator)</span>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {social.recommendation}
              </p>
            </div>

          </div>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 6. OPENSTREETMAP GIS COMMAND CENTER CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="flex flex-col gap-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-150 pb-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-emerald-800">[ INTEGRASI PETA GEOSPASIAL NASIONAL ]</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#022c1b] leading-tight mt-1">
              Pemantauan Geografis Kerawanan Pasokan Daerah
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1 max-w-3xl">
              SATRISNA memetakan alarm status kerawanan pangan (Aman, Waspada, Darurat) secara dinamis di seluruh provinsi Indonesia menggunakan visualisasi geospasial OpenStreetMap terintegrasi.
            </p>
          </div>
          <Link href="/dashboard/map">
            <GradientButton variant="indigo" className="text-xs px-6 py-3 rounded-2xl font-bold shrink-0">
              Buka Peta Analisis Utama
            </GradientButton>
          </Link>
        </div>

        {/* OpenStreetMap Container */}
        <div className="w-full min-h-[500px] border border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative group">
          <Link href="/dashboard/map">
            <div className="pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
              <IndonesiaOSMMap 
                onRegionSelect={() => {}} 
                selectedRegionId={selectedRegion.id} 
              />
            </div>
            <div className="absolute inset-0 bg-[#022c1b]/10 group-hover:bg-[#022c1b]/0 flex items-center justify-center transition-all duration-350 pointer-events-none">
              <span className="bg-[#0b0f19]/90 border border-slate-800 px-5 py-2.5 rounded-2xl text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase shadow-xl backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                Klik untuk Membuka Peta Interaktif SITABA
              </span>
            </div>
          </Link>
        </div>

        {/* Selected region analytics drawer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200 text-xs font-semibold leading-relaxed font-mono shadow-sm">
          <div className="flex flex-col gap-1 border-r border-slate-200/80 pr-4">
            <span className="text-[9px] text-slate-400 uppercase">Wilayah Terpantau</span>
            <span className="text-sm font-black text-slate-800">{selectedRegion.name}</span>
          </div>
          <div className="flex flex-col gap-1 border-r border-slate-200/80 pr-4">
            <span className="text-[9px] text-slate-400 uppercase">Status Kerawanan</span>
            <span className={`text-xs font-black uppercase ${
              selectedRegion.status === 'Darurat' ? 'text-red-600' :
              selectedRegion.status === 'Waspada' ? 'text-amber-600' :
              'text-emerald-700'
            }`}>
              {selectedRegion.status}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-r border-slate-200/80 pr-4">
            <span className="text-[9px] text-slate-400 uppercase">Indeks Harga Beras</span>
            <span className="text-xs font-black text-slate-800">Rp {selectedRegion.berasPrice.toLocaleString('id-ID')} / kg</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 uppercase">Rekomendasi BPS</span>
            <p className="text-[10px] text-slate-500 font-sans font-semibold leading-normal">
              {selectedRegion.status === 'Darurat' ? 'Operasi pasar CBP intensif dan percepatan distribusi beras penolong.' :
               selectedRegion.status === 'Waspada' ? 'Pantau pergerakan harga eceran dan batasi spekulasi tingkat agen.' :
               'Wilayah terpantau aman dan pasokan gudang lokal memadai.'}
            </p>
          </div>
        </div>

      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 7. KILAS BERITA MAKRO & PANGAN FEED */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="flex flex-col gap-8 relative z-10 border-t border-slate-150 pt-16">
        <div className="flex justify-between items-end border-b border-slate-150 pb-4">
          <div>
            <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest block mb-1">[ INFORMASI KEBIJAKAN ]</span>
            <h2 className="text-2xl font-black text-[#022c1b]">Kilas Berita Makro &amp; Analisis Pangan</h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Kompilasi artikel publikasi analitis terkait gejolak pangan global, stabilitas harga, dan fiskal.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold hidden sm:inline-block">PUBLIKASI KEMENKEU &amp; BPS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {NEWS_DATA.slice(0, 2).map((news, idx) => (
            <div key={idx} className="bg-white border-t-4 border-t-emerald-600 border-x border-b border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-5 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex flex-col gap-3">
                <span className="text-[8px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 self-start">
                  {news.tag}
                </span>
                
                <h3 className="text-base font-black text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                  {user ? (
                    <Link href={`/dashboard/news/${news.slug}`}>{news.title}</Link>
                  ) : (
                    <button onClick={handleOpenLogin} className="text-left font-black cursor-pointer">
                      {news.title}
                    </button>
                  )}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">
                  {news.summary}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono font-bold">
                <span>Penulis: {news.author}</span>
                <span>Rilis: {news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 8. SLATE/CHARCOAL TATA KELOLA MATRIX SECTION */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="w-full relative z-10">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 text-white p-8 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col gap-10 border border-slate-800">
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-2 max-w-2xl border-b border-slate-800 pb-6">
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-emerald-400">[ MATRIKS STANDAR TATA KELOLA ]</span>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-snug">
              Akurasi Ilmiah &amp; Tata Kelola Keuangan Negara Berkelanjutan
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
              Metodologi integrasi data ekonometrika pangan eceran BPS-SP2KP diselaraskan untuk mengawal batas aman belanja APBN.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 min-h-[180px] shadow-sm">
              <div className="flex flex-col gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                  01
                </span>
                <h3 className="text-sm font-black text-white">Stabilitas Cadangan Pangan</h3>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-4">
                Menjaga kecukupan cadangan beras pemerintah (CBP) minimal 1 juta ton sebagai instrumen utama stabilisasi pasokan pasar nasional.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 min-h-[180px] shadow-sm">
              <div className="flex flex-col gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                  02
                </span>
                <h3 className="text-sm font-black text-white">Mitigasi Volatilitas Pasar</h3>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-4">
                Meredam dampak heteroskedastisitas harga musiman dan volatilitas pasokan global dengan pemodelan time-series GARCH terkalibrasi.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 min-h-[180px] shadow-sm">
              <div className="flex flex-col gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                  03
                </span>
                <h3 className="text-sm font-black text-white">Literasi Keuangan Pangan</h3>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-4">
                Edu-kuis interaktif bernilai poin sembako yang dapat ditukarkan langsung di jaringan mitra retail CSR guna meningkatkan literasi pangan pokok.
              </p>
            </div>

          </div>

        </div>
      </SectionWrapper>

    </div>
  );
}
