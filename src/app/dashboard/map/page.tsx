"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import dynamic from 'next/dynamic';
import { REGIONS, RegionalData } from '@/components/visualization/IndonesiaMap';

// Dynamically load the Leaflet OpenStreetMap component to prevent Next.js SSR errors
const IndonesiaOSMMap = dynamic(() => import('@/components/visualization/IndonesiaOSMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-505 font-bold animate-pulse">
      Memuat Peta Kerawanan Pangan (OpenStreetMap)...
    </div>
  )
});
import SectionWrapper from '@/components/ui/SectionWrapper';
import GradientButton from '@/components/ui/GradientButton';
import { Layers, Map, Info, AlertTriangle, ShieldCheck, XCircle, Lock, Rss, ArrowLeft, Activity } from 'lucide-react';

export default function GeospatialMapPage() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<RegionalData>(REGIONS[1]); // Java default
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Premium');

  const NEWS_ALERTS = [
    {
      id: 'sumatera',
      title: 'Pelepasan Cadangan Beras SPHP',
      location: 'Prov. Sumatera Utara',
      date: '22/07/2026',
      desc: 'BULOG Medan menggelar operasi pasar eceran di 4 pasar induk tradisional guna meredam aksi spekulasi pedagang.',
      type: 'Waspada'
    },
    {
      id: 'papua',
      title: 'Defisit Suplai Gabah & Logistik',
      location: 'Prov. Papua',
      date: '21/07/2026',
      desc: 'Terjadi keterlambatan kapal logistik akibat cuaca buruk di perairan timur, memicu lonjakan harga Beras Premium.',
      type: 'Darurat'
    },
    {
      id: 'jawa',
      title: 'Panen Raya Padi Musim Gadu',
      location: 'Prov. Jawa',
      date: '20/07/2026',
      desc: 'Kabupaten Indramayu dan Karawang memasuki puncak panen padi. Suplai ke pasar Cipinang Jakarta terpantau aman.',
      type: 'Aman'
    },
    {
      id: 'sulawesi',
      title: 'Anomali Suplai Cabai Musiman',
      location: 'Prov. Sulawesi',
      date: '19/07/2026',
      desc: 'Hujan deras berkepanjangan memicu gagal panen cabai rawit di wilayah sentra tani Minahasa.',
      type: 'Waspada'
    }
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
      <SectionWrapper className="flex flex-col items-center justify-center min-h-[450px] text-center gap-5 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-xl mx-auto my-12 relative z-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#022c1b]">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black text-slate-800">Akses Portal Terbatas</h2>
          <p className="text-xs text-slate-505 max-w-sm leading-relaxed font-semibold">
            Peta Geospasial Terpadu Ekonometrika dan Simulasi Pangan memerlukan otentikasi identitas pejabat negara atau akademisi terdaftar.
          </p>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Status: UNAUTHORIZED (401)</span>
        <button 
          onClick={() => {
            const loginBtn = document.querySelector('button[class*="Masuk Portal"]') as HTMLButtonElement;
            if (loginBtn) loginBtn.click();
          }}
          className="mt-2"
        >
          <GradientButton variant="indigo" className="text-xs">
            Masuk Portal Sekarang
          </GradientButton>
        </button>
      </SectionWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16 relative z-10">
      
      {/* 1. TOP NAVIGATION HEADER (Inspired by SITABA Map Page - Image 1) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#022c1b]">Peta Penyebaran Indeks Kerawanan Pangan</h1>
            <p className="text-[10px] text-slate-455 font-bold tracking-wide uppercase mt-0.5">Badan Pusat Statistik & Kementerian Pertanian</p>
          </div>
        </div>
        
        {/* Link to Prediction */}
        <Link href="/dashboard/prediction">
          <GradientButton variant="emerald" className="text-xs font-bold py-2 flex items-center gap-1">
            Lihat Analisis Peramalan &rarr;
          </GradientButton>
        </Link>
      </div>

      {/* 2. SITABA STYLE FILTER RIBBON (Directly above the map) */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-800" />
          <span className="text-xs font-black text-slate-800">Filter Geospasial Terpadu</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 text-xs w-full md:w-auto">
          {/* Month Filter */}
          <select className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none flex-1 md:flex-none">
            <option>Semua Bulan</option>
            <option>Juli 2026</option>
            <option>Juni 2026</option>
          </select>

          {/* Year Filter */}
          <select className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none flex-1 md:flex-none">
            <option>2026</option>
            <option>2025</option>
          </select>

          {/* Region Filter */}
          <select 
            value={selectedRegion.id}
            onChange={(e) => {
              const match = REGIONS.find(r => r.id === e.target.value);
              if (match) setSelectedRegion(match);
            }}
            className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none flex-1 md:flex-none"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Commodity Filter */}
          <select 
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none flex-1 md:flex-none"
          >
            <option value="Beras Premium">Beras Premium</option>
            <option value="Cabai Rawit">Cabai Rawit</option>
            <option value="Jagung Pipilan">Jagung Pipilan</option>
          </select>

          <button 
            onClick={() => {
              setSelectedRegion(REGIONS[1]);
              setSelectedCommodity('Beras Premium');
            }}
            className="bg-slate-200 hover:bg-slate-250 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors flex-1 md:flex-none"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3. ALERT BAR */}
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
          <span>1 Peringatan Kerawanan Pangan Aktif: Wilayah Papua saat ini berstatus DARURAT akibat hambatan distribusi logistik laut.</span>
        </div>
        <button 
          onClick={() => {
            const papuaReg = REGIONS.find(r => r.id === 'papua');
            if (papuaReg) setSelectedRegion(papuaReg);
          }} 
          className="bg-red-750 text-white px-2.5 py-1 rounded text-[10px] hover:bg-red-850 transition-colors uppercase font-mono font-bold"
        >
          Fokus Lokasi
        </button>
      </div>

      {/* 4. FULL WIDTH MAP CONTAINER */}
      <div className="w-full min-h-[500px]">
        <IndonesiaOSMMap 
          onRegionSelect={(reg) => setSelectedRegion(reg)} 
          selectedRegionId={selectedRegion.id} 
        />
      </div>

      {/* 5. THREE-COLUMNS LAYOUT BELOW MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-100 pt-6">
        
        {/* Column 1: Selected Region Info */}
        <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm h-full">
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

          <div className="bg-[#f4f9f6] p-4 rounded-xl border border-emerald-100 flex flex-col gap-1.5 text-xs text-slate-600 font-medium mt-auto">
            <span className="font-bold text-[#064e3b] flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Saran Stabilisasi Pangan:
            </span>
            <p className="leading-relaxed text-[11px]">
              {getELI5Recommendation(selectedRegion)}
            </p>
          </div>
        </div>

        {/* Column 2: News Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4 border border-slate-200 rounded-2xl p-4 bg-slate-50 h-full max-h-[385px] overflow-y-auto shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-1">
            <Rss className="w-4 h-4 text-[#064e3b]" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Kabar & Peringatan Terbaru</span>
          </div>

          <div className="flex flex-col gap-3">
            {NEWS_ALERTS.map((alert, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  const match = REGIONS.find(r => r.id === alert.id);
                  if (match) setSelectedRegion(match);
                }}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-black text-slate-800 leading-snug">{alert.title}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                    alert.type === 'Darurat' ? 'bg-red-50 text-red-655 border border-red-200' :
                    alert.type === 'Waspada' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {alert.type}
                  </span>
                </div>
                <p className="text-[9px] text-slate-505 font-semibold leading-relaxed line-clamp-2">{alert.desc}</p>
                <div className="flex justify-between items-center text-[7px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  <span>{alert.location}</span>
                  <span>{alert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Double Stats Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between h-full">
          {/* Card 1: Statistik Distribusi Logistik Bulog */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm flex-1">
            <div className="flex flex-col gap-1 border-b border-slate-150 pb-2">
              <span className="text-[8px] font-mono text-blue-600 uppercase tracking-wider font-black">[ LAPORAN FISIK ]</span>
              <h4 className="text-xs font-black text-slate-800">Statistik Distribusi Logistik Bulog</h4>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-2">
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-blue-700">145.000</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Total SPHP (Ton)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-slate-800">7 Unit</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Gudang Divre</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-slate-800">14 Titik</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Pasar Tradisional</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-emerald-700">92%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Indeks Salur</span>
              </div>
            </div>

            <div className="text-[7px] text-slate-400 font-mono border-t border-slate-100 pt-1.5 flex justify-between">
              <span>SUMBER: BULOG DIVRE</span>
              <span>TERKINI: 22-07-2026</span>
            </div>
          </div>

          {/* Card 2: Statistik Alarm Kerawanan Pangan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm flex-1">
            <div className="flex flex-col gap-1 border-b border-slate-150 pb-2">
              <span className="text-[8px] font-mono text-red-600 uppercase tracking-wider font-black">[ DETEKSI ALARM ]</span>
              <h4 className="text-xs font-black text-slate-800">Statistik Alarm Kerawanan Pangan</h4>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-2">
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-red-655">1 Prov</span>
                <span className="text-[8px] text-slate-550 font-bold uppercase">Status Darurat</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-amber-600">2 Prov</span>
                <span className="text-[8px] text-slate-550 font-bold uppercase">Status Waspada</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-emerald-700">4 Prov</span>
                <span className="text-[8px] text-slate-550 font-bold uppercase">Status Aman</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black text-[#022c1b]">3.82%</span>
                <span className="text-[8px] text-slate-550 font-bold uppercase">Volatile Food CPI</span>
              </div>
            </div>

            <div className="text-[7px] text-slate-400 font-mono border-t border-slate-100 pt-1.5 flex justify-between">
              <span>SUMBER: BPS SP2KP</span>
              <span>TERKINI: 22-07-2026</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
