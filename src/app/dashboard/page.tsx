"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import InflationPredictor from '@/components/ai/InflationPredictor';
import IndonesiaMap, { REGIONS, RegionalData } from '@/components/visualization/IndonesiaMap';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import GradientButton from '@/components/ui/GradientButton';
import { Layers, Activity, ShieldAlert, Map, Info, AlertTriangle, ShieldCheck, XCircle, Lock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<RegionalData>(REGIONS[1]); // Java default

  const generalStats = [
    { title: 'Volatile Food CPI', value: 5.4, decimals: 1, suffix: '%', desc: 'Indeks volatile food BPS terkini' },
    { title: 'Volatilitas Minyak Brent', value: 85.5, decimals: 1, suffix: ' USD', desc: 'Harga komoditas energi global' },
    { title: 'Cadangan CBP Bulog', value: 1.45, decimals: 2, suffix: ' Jt Ton', desc: 'Stok beras pemerintah aktif' },
    { title: 'Indeks Keberlanjutan Fiskal', value: 82.0, decimals: 1, suffix: '%', desc: 'Batas toleransi belanja APBN' }
  ];

  const getStatusBadge = (status: 'Aman' | 'Waspada' | 'Darurat') => {
    switch (status) {
      case 'Aman': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> AMAN
          </span>
        );
      case 'Waspada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> WASPADA
          </span>
        );
      case 'Darurat':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-300 text-xs font-bold text-red-800 animate-pulse">
            <XCircle className="w-3.5 h-3.5" /> DARURAT
          </span>
        );
    }
  };

  const getELI5Recommendation = (region: RegionalData) => {
    if (region.status === 'Aman') {
      return `Bagus! Wilayah ${region.name} saat ini memiliki stok makanan yang cukup di pasar. Harganya pun stabil karena panen tani lokal berjalan lancar. Pemerintah hanya perlu memantau agar tidak ada pengiriman beras keluar daerah secara berlebihan.`;
    }
    if (region.status === 'Waspada') {
      return `Hati-hati! Harga beras eceran di ${region.name} mulai sedikit mahal (Rp ${region.berasPrice.toLocaleString('id-ID')}/Kg). Hal ini disebabkan pasokan dari petani lokal berkurang karena musim kemarau. Saran sederhana: Distribusikan cadangan beras cadangan Bulog untuk menyeimbangkan pasar.`;
    }
    return `Gawat! Stok makanan di ${region.name} sedang menipis dan harganya melambung tinggi sekali. Hal ini terjadi karena jarak pengiriman kapal laut yang jauh dan terganggu ombak besar global. Saran mendesak: Segera datangkan bantuan beras impor khusus untuk menurunkan harga dengan cepat agar warga tidak kelaparan.`;
  };

  // Auth Gate: limit dashboard access
  if (!user) {
    return (
      <SectionWrapper className="flex flex-col items-center justify-center min-h-[450px] text-center gap-5 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#022c1b]">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black text-slate-800">Akses Portal Terbatas</h2>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
            Dashboard Utama Ekonometrika dan Simulasi Kebijakan Fiskal Pangan memerlukan otentikasi identitas pejabat negara atau mahasiswa terdaftar.
          </p>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Status: UNAUTHORIZED (401)</span>
        <button 
          onClick={() => {
            // Trigger login modal by clicking the navbar login button programmatically or asking user to click it
            const loginBtn = document.querySelector('button[class*="Masuk Portal"]') as HTMLButtonElement;
            if (loginBtn) loginBtn.click();
          }}
          className="mt-2"
        >
          <GradientButton variant="indigo" className="text-xs">
            Masuk Portal Sekarang &rarr;
          </GradientButton>
        </button>
      </SectionWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Page Title Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064e3b] flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-800" />
            Dashboard Statistik Pangan Nasional
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Selamat datang kembali, <span className="text-emerald-800 font-bold">{user.name}</span>. Silakan pantau peramalan komoditas pangan pokok.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-250 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-emerald-800 font-bold uppercase tracking-wider">Engine ARIMA/GARCH Aktif</span>
        </div>
      </SectionWrapper>

      {/* KPI Cards Row */}
      <SectionWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {generalStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] text-slate-455 uppercase font-bold tracking-wider">
              {stat.title}
            </span>
            <div className="text-2xl font-black text-slate-800">
              <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </div>
            <span className="text-[9px] text-slate-400 block font-medium mt-0.5">{stat.desc}</span>
          </div>
        ))}
      </SectionWrapper>

      {/* SITABA style Indonesia Map alert monitoring */}
      <SectionWrapper className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-700" />
          <div>
            <h2 className="text-sm font-black text-slate-800">
              Peta Kerawanan Pasokan & Harga Pangan Provinsi (SITABA Style)
            </h2>
            <p className="text-[10px] text-slate-500">
              Memantau peringatan stok komoditas strategis secara visual di seluruh pulau besar Indonesia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <IndonesiaMap 
              onRegionSelect={(reg) => setSelectedRegion(reg)} 
              selectedRegionId={selectedRegion.id} 
            />
          </div>

          <div className="lg:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Wilayah Terpilih</span>
                <h3 className="text-base font-black text-slate-800">{selectedRegion.name}</h3>
              </div>
              {getStatusBadge(selectedRegion.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-150">
                <span className="text-[9px] text-slate-455 block font-bold">Harga Beras</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  Rp {selectedRegion.berasPrice.toLocaleString('id-ID')}/Kg
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-150">
                <span className="text-[9px] text-slate-455 block font-bold">Harga Cabai Rawit</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  Rp {selectedRegion.cabaiPrice.toLocaleString('id-ID')}/Kg
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-150">
                <span className="text-[9px] text-slate-455 block font-bold">Status Pasokan</span>
                <span className={`font-bold block mt-0.5 ${
                  selectedRegion.supplyLevel === 'Defisit' ? 'text-red-700' :
                  selectedRegion.supplyLevel === 'Cukup' ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {selectedRegion.supplyLevel}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-150">
                <span className="text-[9px] text-slate-455 block font-bold">Inflasi Pangan</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {selectedRegion.inflationRate}%
                </span>
              </div>
            </div>

            <div className="mt-2 bg-[#f4f9f6] p-4 rounded-xl border border-emerald-100 flex flex-col gap-1.5 text-xs text-slate-600 font-medium">
              <span className="font-bold text-[#064e3b] flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Saran Stabilisasi (Sederhana):
              </span>
              <p className="leading-relaxed">
                {getELI5Recommendation(selectedRegion)}
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Main Section: Forecaster Workspace */}
      <SectionWrapper className="w-full">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-emerald-700" />
                Predictive Analysis Workspace (BPS/BI)
              </h2>
              <p className="text-[10px] text-slate-505">
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
