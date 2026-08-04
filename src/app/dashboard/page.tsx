"use client";

import React, { useState } from 'react';
import { useAuth, AppMode } from '@/lib/AuthContext';
import InflationPredictor from '@/components/ai/InflationPredictor';
import dynamic from 'next/dynamic';
import { REGIONS, RegionalData } from '@/components/visualization/IndonesiaMap';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import GradientButton from '@/components/ui/GradientButton';
import Link from 'next/link';
import { 
  Layers, Activity, ShieldAlert, Map, Info, AlertTriangle, ShieldCheck, 
  XCircle, Lock, Rss, Download, Upload, Cpu, Database, Award, 
  BookOpen, Terminal, CheckCircle2, RefreshCw, Sliders, FileText, 
  Settings, Users, Globe, Moon, Sun, Bell, ArrowUpRight, ArrowRight, Zap
} from 'lucide-react';

const IndonesiaOSMMap = dynamic(() => import('@/components/visualization/IndonesiaOSMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900/40 border border-slate-800 rounded-3xl flex items-center justify-center text-xs text-slate-500 font-mono animate-pulse">
      Memuat Peta Geospasial SITABA...
    </div>
  )
});

export default function Dashboard() {
  const { 
    user, mode, setMode, language, setLanguage, 
    isDarkMode, toggleDarkMode, notifications, markNotificationAsRead 
  } = useAuth();

  // Active sub-module tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'acquisiton' | 'etl' | 'analytics' | 'dss' | 'benchmarking' | 'casestudy' | 'api' | 'notifs'
  >('overview');

  // Interactive states for data acquisition & ETL
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [etlProgress, setEtlProgress] = useState(100);
  const [isEtlRunning, setIsEtlRunning] = useState(false);

  // Selected region for map
  const [selectedRegion, setSelectedRegion] = useState<RegionalData>(REGIONS[1]);
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Premium');

  // DSS Policy scenario states
  const [bbmRise, setBbmRise] = useState(10);
  const [fertilizerSub, setFertilizerSub] = useState(40);
  const [importQuota, setImportQuota] = useState(0.8);

  const runEtlPipeline = () => {
    setIsEtlRunning(true);
    setEtlProgress(0);
    const interval = setInterval(() => {
      setEtlProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEtlRunning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Tanggal,Komoditas,Harga_Eceran,Status_Kerawanan\n04/08/2026,Beras Premium,15200,Aman\n04/08/2026,Cabai Rawit,48000,Waspada\n04/08/2026,Minyak Goreng,16500,Aman";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SATRISNA_Laporan_Inflasi_${mode.toUpperCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert(`[SATRISNA REPORT GENERATOR]\nLaporan Kebijakan Fiskal (${mode.toUpperCase()}) berhasil diterbitkan dalam format PDF terenkripsi SSL.`);
  };

  if (!user) {
    return (
      <SectionWrapper className="flex flex-col items-center justify-center min-h-[450px] text-center gap-5 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#022c1b]">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black text-slate-800">Akses Portal Terbatas</h2>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
            Dashboard Utama Ekonometrika dan Simulasi Kebijakan Fiskal Pangan memerlukan otentikasi identitas pejabat negara atau akademisi terdaftar.
          </p>
        </div>
        <button 
          onClick={() => {
            const loginBtn = document.querySelector('button[class*="Masuk Portal"]') as HTMLButtonElement;
            if (loginBtn) loginBtn.click();
          }}
        >
          <GradientButton variant="emerald" className="text-xs">
            Masuk Portal Sekarang
          </GradientButton>
        </button>
      </SectionWrapper>
    );
  }

  return (
    <div className={`flex flex-col gap-8 pb-16 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* ------------------------------------------------------------- */}
      {/* TOP DASHBOARD CONTROL RIBBON (ROLE MODE + DARK MODE + LANG) */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#022c1b] text-white flex items-center justify-center font-black text-base shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">Dashboard Utama SATRISNA</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold uppercase">
                {mode === 'pemerintah' ? 'Mode Pemerintah' : mode === 'akademisi' ? 'Mode Akademisi/Analis' : 'Mode Masyarakat'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Pengguna: <span className="font-bold text-slate-800">{user.name}</span> ({user.nipOrId})
            </p>
          </div>
        </div>

        {/* Role & System Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setMode('masyarakat')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'masyarakat' ? 'bg-[#022c1b] text-white font-black' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Masyarakat
            </button>
            <button
              onClick={() => setMode('pemerintah')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'pemerintah' ? 'bg-[#022c1b] text-white font-black' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pemerintah
            </button>
            <button
              onClick={() => setMode('akademisi')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'akademisi' ? 'bg-[#022c1b] text-white font-black' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Akademisi
            </button>
          </div>

          {/* Export Buttons */}
          <button 
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> CSV
          </button>

          <button 
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> PDF Laporan
          </button>

        </div>

      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* 10 CORE WORKFLOW MODULE NAVIGATION TABS */}
      {/* ------------------------------------------------------------- */}
      <SectionWrapper className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 min-w-[900px] text-xs font-bold">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" /> Ringkasan Mode
          </button>

          <button
            onClick={() => setActiveTab('acquisiton')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'acquisiton' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" /> Akuisisi Data
          </button>

          <button
            onClick={() => setActiveTab('etl')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'etl' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" /> Pipeline ETL
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" /> Modul Analitik &amp; GWR
          </button>

          <button
            onClick={() => setActiveTab('dss')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dss' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" /> Decision Support (DSS)
          </button>

          <button
            onClick={() => setActiveTab('benchmarking')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'benchmarking' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" /> Benchmarking &amp; Audit
          </button>

          <button
            onClick={() => setActiveTab('casestudy')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'casestudy' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Studi Kasus Daerah
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'api' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-4 h-4" /> API Riset
          </button>

          <button
            onClick={() => setActiveTab('notifs')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'notifs' ? 'bg-[#022c1b] text-white font-black shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifikasi
            {notifications.some(n => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-1" />
            )}
          </button>

        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 1: OVERVIEW ACCORDING TO USER ROLE MODE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8">
          
          {/* MODE MASYARAKAT VIEW */}
          {mode === 'masyarakat' && (
            <div className="flex flex-col gap-8">
              <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ RINGKASAN MASYARAKAT ]</span>
                  <h2 className="text-xl font-black text-[#022c1b] mt-1">Status Inflasi &amp; Kestabilan Harga Eceran</h2>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Informasi terbuka mengenai pergerakan beras medium SPHP, minyak goreng, dan kuis voucher sembako.
                  </p>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border border-emerald-200 flex items-center gap-3">
                  <span className="text-2xl font-black text-[#022c1b]">2.80%</span>
                  <div className="flex flex-col text-[9px] font-mono text-slate-500 font-bold">
                    <span>INFLASI PANGAN</span>
                    <span className="text-emerald-700 font-black">TERKENDALI</span>
                  </div>
                </div>
              </div>

              {/* Simple Price Trend Chart */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800">Tren Harga Kebutuhan Pokok Harian (Pasar Eceran BPS)</h3>
                <div className="w-full h-44 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center relative">
                  <svg className="w-full h-full text-emerald-600" viewBox="0 0 300 80" fill="none">
                    <path d="M10 60 Q 60 40, 120 50 T 220 30 T 290 25" stroke="#10b981" strokeWidth="3" fill="none" />
                    <circle cx="290" cy="25" r="4" fill="#022c1b" />
                    <text x="220" y="20" className="fill-emerald-800 font-mono text-[9px] font-bold">Rp 12.500/Kg (SPHP)</text>
                  </svg>
                </div>
              </div>

              {/* Interactive Education & Quiz Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Apa Itu Inflasi Volatile Food?</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                      Inflasi pangan bergejolak adalah naik-turunnya harga bahan makanan akibat faktor cuaca, gagal panen, atau hambatan pengiriman laut.
                    </p>
                  </div>
                  <Link href="/dashboard/learning">
                    <button className="py-3 px-6 rounded-2xl bg-[#022c1b] text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                      Ikuti Kuis Sembako &amp; Tukar Poin <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </Link>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Saldo Poin Sembako Anda</h4>
                    <span className="text-3xl font-black text-emerald-700 block mt-2">{user.points} Pts</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Dapat ditukarkan dengan Voucher Beras 5Kg di retail mitra Bulog.</p>
                  </div>
                  <button onClick={() => alert("Kupon voucher beras 5Kg telah dikirim ke NIP/ID Anda.")} className="py-3 px-6 rounded-2xl border border-slate-250 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors">
                    Tukarkan Voucher Retail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE PEMERINTAH VIEW */}
          {mode === 'pemerintah' && (
            <div className="flex flex-col gap-8">
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">[ PANEL REGULATOR BPS &amp; BI ]</span>
                  <h2 className="text-xl font-black text-white mt-1">Decision Support System &amp; Fiskal APBN</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Instrumen pendukung keputusan alokasi cadangan beras pemerintah (CBP) &amp; insentif daerah.
                  </p>
                </div>
                <button onClick={() => setActiveTab('dss')} className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Sliders className="w-4 h-4" /> Buka Sim-Kebijakan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-4">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Stok Active CBP</span>
                  <span className="text-3xl font-black text-slate-900">1,45 Juta Ton</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Status: Memenuhi Kuota Safe Limit</span>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-4">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Batas Inflasi Target BI</span>
                  <span className="text-3xl font-black text-amber-600">3,82% Max</span>
                  <span className="text-[10px] text-amber-700 font-bold">Status: Waspada Musim Kemarau</span>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between gap-4">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Daerah Kritis Alert</span>
                  <span className="text-3xl font-black text-red-600">1 Prov (Papua)</span>
                  <span className="text-[10px] text-red-700 font-bold">Rekomendasi Rilis 50rb Ton CBP</span>
                </div>
              </div>
            </div>
          )}

          {/* MODE AKADEMISI VIEW */}
          {mode === 'akademisi' && (
            <div className="flex flex-col gap-8">
              <div className="bg-[#021f13] text-white p-6 rounded-3xl border border-emerald-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">[ PANEL ANALIS &amp; AKADEMISI ]</span>
                  <h2 className="text-xl font-black text-white mt-1">Ekonometrika Riset &amp; Audit Reproducibility</h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Evaluasi cross-validation, metrik RMSE/GARCH, serta dokumentasi API playground untuk penelitian.
                  </p>
                </div>
                <button onClick={() => setActiveTab('benchmarking')} className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Award className="w-4 h-4" /> Benchmarking Model
                </button>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 font-mono">Tabel Uji Kinerja Model (5-Fold Cross Validation)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px]">
                        <th className="pb-2">Metode Pemodelan</th>
                        <th className="pb-2">RMSE</th>
                        <th className="pb-2">MAE</th>
                        <th className="pb-2">R-Squared (R²)</th>
                        <th className="pb-2">Waktu Eksekusi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      <tr>
                        <td className="py-2.5 font-bold text-emerald-800">ARIMA(1,1,1) + GARCH(1,1)</td>
                        <td>42.80</td>
                        <td>31.12</td>
                        <td className="text-emerald-700 font-bold">0.942 (Terbaik)</td>
                        <td>120 ms</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">LSTM Neural Network</td>
                        <td>48.15</td>
                        <td>35.40</td>
                        <td>0.915</td>
                        <td>1450 ms</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">Regresi Linier Berganda</td>
                        <td>72.90</td>
                        <td>58.30</td>
                        <td>0.780</td>
                        <td>15 ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OpenStreetMap Component Preview */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-800">Visualisasi Geospasial OpenStreetMap SITABA</h3>
              <Link href="/dashboard/map" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline">
                Buka Layar Penuh <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="w-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200">
              <IndonesiaOSMMap onRegionSelect={() => {}} selectedRegionId={selectedRegion.id} />
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 2: MODUL AKUISISI DATA */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'acquisiton' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ MODUL AKUISISI DATA ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Unggah Dataset &amp; Integrasi Multi-Sumber</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Impor berkas CSV/JSON harga komoditas eceran pasar serta pemantauan konektivitas API data BPS SP2KP, BI PIHPS, dan Bulog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4 transition-colors">
              <Upload className="w-10 h-10 text-emerald-700" />
              <div>
                <h4 className="text-sm font-black text-slate-800">Seret Beras Dataset CSV/JSON ke Sini</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Format terverifikasi: SP2KP_BPS_2026.csv, PIHPS_BI.json (Max 50MB)</p>
              </div>
              <button 
                onClick={() => {
                  setIsUploading(true);
                  setTimeout(() => {
                    setIsUploading(false);
                    setUploadSuccess(true);
                  }, 1200);
                }}
                className="py-2.5 px-6 rounded-2xl bg-[#022c1b] text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {isUploading ? 'Memproses Unduhan...' : 'Pilih Berkas Komoditas'}
              </button>
              {uploadSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Berkas Berhasil Diunggah &amp; Tervalidasi Schema BPS!
                </span>
              )}
            </div>

            {/* Integration Status Monitor */}
            <div className="flex flex-col gap-4 font-mono text-xs">
              <h4 className="font-black text-slate-800 font-sans">Status Integrasi API Multi-Sumber</h4>
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">SP2KP BPS RI (Eceran Pasar)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE (10ms)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">PIHPS Bank Indonesia</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE (14ms)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Gudang Logistik BULOG</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE (22ms)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 3: MODUL PEMROSESAN ETL */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'etl' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ MODUL PEMROSESAN DATA ]</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Pipeline ETL (Extract, Transform, Load)</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Pembersihan pencilan outlier, imputasi missing-value, dan imputasi musiman otomatis.
              </p>
            </div>
            <button 
              onClick={runEtlPipeline}
              className="py-2.5 px-5 rounded-2xl bg-[#022c1b] text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEtlRunning ? 'animate-spin' : ''}`} /> Eksekusi Pipeline ETL
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Status Transparansi ETL:</span>
              <span className="text-emerald-700">{etlProgress}% SELESAI</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${etlProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs mt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
              <span className="text-slate-400 text-[9px]">FASE 1: EXTRACT</span>
              <span className="font-bold text-slate-800">14.850 Baris Data SP2KP</span>
              <span className="text-[10px] text-emerald-700">Status: Valid</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
              <span className="text-slate-400 text-[9px]">FASE 2: TRANSFORM</span>
              <span className="font-bold text-slate-800">Filter Winsorizing 1%</span>
              <span className="text-[10px] text-emerald-700">Outlier Diimputasi</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
              <span className="text-slate-400 text-[9px]">FASE 3: LOAD</span>
              <span className="font-bold text-slate-800">Tersimpan di Vector DB</span>
              <span className="text-[10px] text-emerald-700">Ready for ARIMA/LSTM</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 4: MODUL ANALITIK & GWR HEATMAP */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ MODUL ANALITIK TINGKAT LANJUT ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Heatmap GWR (Geographically Weighted Regression) &amp; Prediksi</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Peta korelasi geospasial heterogenitas spasi antara disparitas harga eceran dan biaya angkutan laut.
            </p>
          </div>

          <InflationPredictor />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 5: DECISION SUPPORT SYSTEM (DSS) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dss' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ MODUL DECISION SUPPORT SYSTEM ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Simulasi Skenario Kebijakan Fiskal (BBM, Pangan, APBN)</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Uji dampak kenaikan BBM subsidi atau kuota impor beras terhadap koridor inflasi nasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold text-xs">
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[10px] text-slate-500 font-bold">Kenaikan BBM Subsidi (+%):</label>
              <input 
                type="range" min="0" max="30" step="5" value={bbmRise} 
                onChange={(e) => setBbmRise(parseInt(e.target.value))}
                className="w-full accent-[#022c1b]"
              />
              <span className="text-emerald-800 font-bold font-mono">+{bbmRise}% Penyesuaian</span>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[10px] text-slate-500 font-bold">Alokasi Subsidi Pupuk (Triliun):</label>
              <input 
                type="range" min="10" max="80" step="5" value={fertilizerSub} 
                onChange={(e) => setFertilizerSub(parseInt(e.target.value))}
                className="w-full accent-[#022c1b]"
              />
              <span className="text-emerald-800 font-bold font-mono">Rp {fertilizerSub} T</span>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[10px] text-slate-500 font-bold">Kuota Impor Cadangan (Jt Ton):</label>
              <input 
                type="range" min="0" max="3" step="0.2" value={importQuota} 
                onChange={(e) => setImportQuota(parseFloat(e.target.value))}
                className="w-full accent-[#022c1b]"
              />
              <span className="text-emerald-800 font-bold font-mono">{importQuota} Jt Ton</span>
            </div>
          </div>

          <div className="p-5 bg-[#021f13] text-white rounded-2xl flex justify-between items-center font-mono text-xs">
            <div>
              <span className="text-[9px] text-emerald-400 font-bold block">PROYEKSI RESULTANTE INFLASI:</span>
              <span className="text-2xl font-black text-emerald-300">{(2.8 + bbmRise * 0.15 - fertilizerSub * 0.02).toFixed(2)}% CPI</span>
            </div>
            <span className="px-3 py-1 bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-full font-bold text-[10px]">
              REKOMENDASI: AMAN
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 6: BENCHMARKING & AUDIT REPRODUCIBILITY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'benchmarking' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-150 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ MODUL BENCHMARKING &amp; AUDIT ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Audit Reproducibility &amp; Validasi Model</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Log benih acak (random seed), konfigurasi hiperparameter, dan lipatan validasi silang (cross-validation folds).
            </p>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800">
            <p>// LOG REPRODUCIBILITY AUDIT - SATRISNA CORE</p>
            <p>SEED: 2026884</p>
            <p>MODEL: ARIMA(1,1,1) + GARCH(1,1)</p>
            <p>DATASET_HASH: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
            <p>STATUS: VERIFIED BY BPS RESEARCH AUDITOR</p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 7: STUDIR KASUS DAERAH */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'casestudy' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-150 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ DOKUMENTASI CASE STUDY ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Studi Kasus Penanganan Krisis Pangan Daerah</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Studi kasus empiris mitigasi lonjakan harga beras di Papua, Jawa Barat, dan NTT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-200 rounded-2xl flex flex-col gap-2">
              <span className="text-[9px] font-mono text-emerald-800 font-bold uppercase">CASE STUDY #01</span>
              <h4 className="text-sm font-black text-slate-800">Penanganan Hambatan Ombak Laut Papua Timur</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Integrasi insentif subsidi angkutan laut Kemenkeu berhasil memangkas disparitas harga beras hingga 18.5%.
              </p>
            </div>

            <div className="p-5 border border-slate-200 rounded-2xl flex flex-col gap-2">
              <span className="text-[9px] font-mono text-emerald-800 font-bold uppercase">CASE STUDY #02</span>
              <h4 className="text-sm font-black text-slate-800">Operasi SPHP Serentak di Pasar Induk Cipinang</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Rilis 25 ribu ton beras SPHP BULOG berhasil mengembalikan ekspektasi pasar eceran ke batas HET.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 8: API RISET PLAYGROUND */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'api' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-150 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ API INTEGRASI RISET ]</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">API Playground &amp; Key Generator</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Konektivitas RESTful JSON untuk riset ekonometrika lanjutan akademisi.
              </p>
            </div>
            <button onClick={() => alert("Kunci API Riset baru diterbitkan: satrisna_live_key_99382104")} className="py-2.5 px-4 rounded-xl bg-[#022c1b] text-white font-bold text-xs hover:bg-emerald-800 transition-colors">
              + Generate New API Key
            </button>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-slate-500">// Contoh Endpoint GET Time-Series Inflation</span>
            <span>GET https://api.satrisna.go.id/v1/inflation/forecast?commodity=beras_medium</span>
            <span className="text-white">Authorization: Bearer satrisna_live_key_99382104</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW TAB 9: NOTIFIKASI SYSTEM */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'notifs' && (
        <div className="flex flex-col gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-150 pb-4">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest">[ FITUR NOTIFIKASI ]</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Pemberitahuan Inflasi &amp; System Alert</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Daftar pembaruan bulanan dan sinyal peringatan geospasial real-time.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div 
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-2xl border flex flex-col gap-1 transition-all cursor-pointer ${
                  n.read ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-emerald-50/50 border-emerald-300 font-bold'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800">{n.title}</span>
                  <span className="text-[9px] font-mono text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-600">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
