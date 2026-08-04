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
  ArrowRight, Sparkles, Sliders, Search, Star, PlayCircle
} from 'lucide-react';

// Dynamically load Leaflet OpenStreetMap to prevent SSR build errors
const IndonesiaOSMMap = dynamic(() => import('@/components/visualization/IndonesiaOSMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900/40 border border-slate-800 rounded-3xl flex items-center justify-center text-xs text-slate-500 font-mono animate-pulse">
      Memuat Peta Geospasial SITABA...
    </div>
  )
});

export default function Home() {
  const { user } = useAuth();
  
  // Hero Interactive Filter Form State (Modeled after Reference Image 2 Search Bar)
  const [selectedProv, setSelectedProv] = useState('Semua Provinsi (38)');
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Medium SPHP');
  const [selectedScenario, setSelectedScenario] = useState('Simulasi Normal 2026');

  // Price Transmission Simulator state
  const [priceRise, setPriceRise] = useState(10);
  const [selectedRegion, setSelectedRegion] = useState<RegionalData>(REGIONS[1]);

  const getSocialImpact = (rise: number) => {
    const power = Math.max(50, 100 - rise * 1.2);
    const inflation = (rise * 0.28).toFixed(2);
    let status: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    let recommendation = 'Kondisi harga eceran nasional stabil. Pemantauan pasok logistik rutin di tingkat pasar tradisional.';
    
    if (rise > 20) {
      status = 'Kritis';
      recommendation = 'STATUS DARURAT PANGAN: Lonjakan harga kritis. BULOG wajib rilis 50rb ton CBP dan Kemenkeu menerbitkan insentif penyeimbang.';
    } else if (rise > 8) {
      status = 'Waspada';
      recommendation = 'STATUS WASPADA INFLASI: BULOG disarankan menyeimbangkan pasokan SPHP di 14 pasar eceran utama.';
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
    <div className="flex flex-col pb-24 bg-white relative font-sans text-slate-800 overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (MODELED DIRECTLY AFTER REFERENCE IMAGE 2 & 3) */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full relative pt-4 pb-16 bg-gradient-to-b from-orange-50/40 via-emerald-50/20 to-white overflow-hidden">
        
        {/* Background Decorative Curve (Image 2 style) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (6-Cols): Large Bold Headline & CTA Buttons */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Orange Tag Line (Image 2 Style) */}
              <div className="flex items-center gap-2 self-start">
                <span className="text-[10px] font-mono tracking-widest font-black uppercase text-amber-700 bg-amber-100/80 border border-amber-250 px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  EKONOMETRIKA &amp; STABILITAS PANGAN NASIONAL
                </span>
              </div>

              {/* Huge Bold Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
                Kelola Inflasi &amp; <br />
                <span className="bg-gradient-to-r from-[#022c1b] via-[#047857] to-[#10b981] bg-clip-text text-transparent">
                  Stabilitas APBN.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold max-w-xl">
                Platform penstabil ekonometrika terpadu yang memadukan peramalan time-series ARIMA/GARCH dengan simulasi Monte Carlo untuk mengamankan stok beras pemerintah dan daya beli rakyat Indonesia.
              </p>

              {/* CTA Buttons (Image 2 style) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {user ? (
                  <Link href="/dashboard">
                    <button className="px-7 py-4 rounded-full bg-[#022c1b] hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer">
                      Jelajahi Portal Utama <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <button 
                    onClick={handleOpenLogin}
                    className="px-7 py-4 rounded-full bg-[#022c1b] hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Eksplorasi Portal <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                )}

                <Link href="/dashboard/map">
                  <button className="px-6 py-4 rounded-full bg-white border border-slate-250 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                    <PlayCircle className="w-4.5 h-4.5 text-emerald-600" /> Peta Geospasial SITABA
                  </button>
                </Link>
              </div>

            </div>

            {/* Right Column (6-Cols): Curved Hero Visual Container + Floating Rating Card (Image 2 Style) */}
            <div className="lg:col-span-6 relative">
              
              <div className="w-full h-[420px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative group">
                <IndonesiaOSMMap 
                  onRegionSelect={() => {}} 
                  selectedRegionId={selectedRegion.id} 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-white text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold">RADAR GEOSPASIAL 38 PROVINSI</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold text-[10px]">LIVE SP2KP BPS</span>
                </div>
              </div>

              {/* Floating Rating Badge Card (Image 2 Style: 4.9/5 Rating Card) */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl hidden sm:flex items-center gap-3.5 z-20">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">Akurasi 94.2% R²</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Terverifikasi BPS &amp; BI</span>
                </div>
              </div>

            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* FLOATING INTERACTIVE CONTROL FILTER BAR CARD (IMAGE 2 STYLE) */}
          {/* ------------------------------------------------------------- */}
          <div className="mt-12 bg-white border border-slate-250 p-4 sm:p-5 rounded-3xl shadow-xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            
            <div className="flex flex-col gap-1 px-2 border-r border-slate-200/80">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Cakupan Wilayah</label>
              <select 
                value={selectedProv}
                onChange={(e) => setSelectedProv(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option>Semua Provinsi (38)</option>
                <option>Jawa Barat</option>
                <option>Jawa Timur</option>
                <option>Sumatera Utara</option>
                <option>Papua Timur</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 px-2 border-r border-slate-200/80">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Pilih Komoditas</label>
              <select 
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option>Beras Medium SPHP</option>
                <option>Beras Premium Eceran</option>
                <option>Cabai Merah Keriting</option>
                <option>Minyak Goreng Kita</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 px-2">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Model Skenario</label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option>Simulasi Normal 2026</option>
                <option>Syok Musim El Nino (+20%)</option>
                <option>Subsidi Pupuk Maksimal</option>
              </select>
            </div>

            <button 
              onClick={() => alert(`Memuat data untuk ${selectedProv} - ${selectedCommodity} (${selectedScenario})`)}
              className="py-3 px-6 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Search className="w-4 h-4 text-emerald-400" /> Filter Data Portal
            </button>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. OVERLAPPING 4-COLUMN STAT COUNTER BAR (IMAGE 3 STYLE) */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="-mt-8 relative z-20">
        <div className="bg-white border border-slate-250 p-6 sm:p-8 rounded-3xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col items-center gap-1 border-r border-slate-150 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-[#022c1b]">1,45 Jt</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stok CBP Govt BULOG</span>
          </div>

          <div className="flex flex-col items-center gap-1 border-r border-slate-150 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-amber-600">3,82%</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Target Volatile Food</span>
          </div>

          <div className="flex flex-col items-center gap-1 border-r border-slate-150 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-blue-600">38 Prov</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Geospasial SP2KP BPS</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl sm:text-4xl font-black text-[#10b981]">94,2%</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Akurasi ARIMA R²</span>
          </div>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 3. PILAR KEUNGGULAN LAYANAN (IMAGE 1 & 2 STYLE CARDS) */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper id="fitur" className="flex flex-col gap-10 mt-16">
        
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-[10px] font-mono tracking-widest font-black uppercase text-emerald-800">
            [ KAPABILITAS PEMODELAN EKONOMETRIKA ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Tiga Pilar Utama Pengambilan Keputusan
          </h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Metodologi kuantitatif terstandarisasi untuk mengawal kestabilan harga beras eceran dan ketahanan anggaran APBN.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 (Image 1 Style Card) */}
          <div className="bg-white border border-slate-250 rounded-3xl p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#022c1b] font-black text-sm">
                01
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[9px] font-mono font-bold uppercase self-start">
                TIME-SERIES MODELING
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Peramalan ARIMA &amp; GARCH
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Menganalisis pergerakan harga eceran harian dan bulanan. Menggunakan filter ARIMA untuk tren panjang dan GARCH untuk kluster volatilitas.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-mono text-[9px] text-slate-700">
              <span className="font-bold text-[#022c1b]">Volatilitas:</span> &sigma;²_t = &omega; + &alpha;&epsilon;²_{`{t-1}`} + &beta;&sigma;²_{`{t-1}`}
            </div>

            {user ? (
              <Link href="/dashboard/prediction">
                <button className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Studio Peramalan <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Studio Peramalan <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-250 rounded-3xl p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-black text-sm">
                02
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[9px] font-mono font-bold uppercase self-start">
                STOCHASTIC SIMULATION
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Simulasi Monte Carlo (50 Jalur)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Memproyeksikan 50 skenario ketidakpastian stokastik untuk mengukur efektivitas subsidi pupuk APBN dan kuota impor SPHP Bulog.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-mono text-[9px] text-slate-700">
              <span className="font-bold text-blue-900">Kepercayaan:</span> Interval 95% Confidence Level
            </div>

            {user ? (
              <Link href="/dashboard/simulation">
                <button className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Simulator Fiskal <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Simulator Fiskal <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-250 rounded-3xl p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 font-black text-sm">
                03
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-[9px] font-mono font-bold uppercase self-start">
                CONSUMER IMPACT
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                Transmisi Daya Beli &amp; Edukasi
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Menghitung dampak inflasi volatile food terhadap dompet rumah tangga serta program kuis poin edukasi sembako gratis.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-mono text-[9px] text-slate-700">
              <span className="font-bold text-amber-900">Voucher Retail:</span> Redeem Beras 5Kg - 10Kg
            </div>

            {user ? (
              <Link href="/dashboard/learning">
                <button className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  Akses Edukasi Pangan <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </button>
              </Link>
            ) : (
              <button onClick={handleOpenLogin} className="w-full py-3 rounded-2xl bg-[#022c1b] hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Akses Edukasi Pangan <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>

        </div>

      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 4. INTERACTIVE PRICE TRANSMISSION CALCULATOR */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="mt-16 bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-250 shadow-md">
        <div className="border-b border-slate-200 pb-6 flex flex-col gap-1.5">
          <span className="text-[9px] font-mono font-black text-emerald-800 uppercase tracking-widest">[ SIMULATOR TRANSMISI SOSIAL ]</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Dampak Harga Pangan Terhadap Daya Beli</h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl">
            Simulasi interaktif pengaruh lonjakan harga Beras Premium di pasar eceran terhadap laju inflasi CPI nasional dan penyusutan daya beli rumah tangga.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
          
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
      {/* 5. INSTITUTIONAL STATEMENT BANNER (IMAGE 1 & 2 STYLE QUOTE) */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="mt-16">
        <div className="bg-gradient-to-r from-emerald-900 via-[#022c1b] to-teal-900 text-white p-10 sm:p-14 rounded-3xl shadow-2xl text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          
          <span className="text-[10px] font-mono tracking-widest font-black uppercase text-emerald-400">
            [ KOMITMEN KEDAULATAN PANGAN ]
          </span>

          <h3 className="text-xl sm:text-3xl font-black max-w-3xl leading-snug">
            &ldquo;Ketahanan Pangan Adalah Pondasi Kedaulatan Bangsa. SATRISNA Mengawal APBN demi Kesejahteraan Dompet Rakyat Indonesia.&rdquo;
          </h3>

          <div className="flex items-center gap-3 pt-2 text-xs text-slate-300 font-bold">
            <span>Kementerian Keuangan RI</span>
            <span>&bull;</span>
            <span>Perum BULOG</span>
            <span>&bull;</span>
            <span>Bank Indonesia</span>
          </div>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 6. STRATEGIC INSTITUTIONAL ACCREDITATION GRID */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper id="mitra" className="mt-16 border-t border-slate-150 pt-12">
        <div className="flex flex-col gap-6">
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

    </div>
  );
}
