"use client";

import React from 'react';
import PolicySimulator from '@/components/ai/PolicySimulator';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { Cpu, Activity } from 'lucide-react';

export default function SimulationPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-800" />
            Laboratorium Simulasi Kebijakan Fiskal
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Simulasikan realokasi stimulus APBN dan kuota impor pangan untuk menilai stabilitas inflasi nasional.
          </p>
        </div>
      </SectionWrapper>

      {/* Policy Simulator Component */}
      <SectionWrapper>
        <PolicySimulator />
      </SectionWrapper>

      {/* Methodological Details */}
      <SectionWrapper className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <h3 className="text-xs uppercase font-black tracking-widest text-[#064e3b] mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Activity className="w-4.5 h-4.5 text-emerald-700" />
          Metodologi Simulasi Monte Carlo & Jalur Transmisi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 leading-relaxed font-medium">
          <div>
            <span className="font-bold text-slate-800 block mb-1.5">1. Skenario Shock Acak (Brownian Motion)</span>
            Simulasi Monte Carlo menjalankan 50 iterasi masa depan (12 bulan) menggunakan model random walk dengan drift terkalibrasi. Volatilitas dipengaruhi oleh tingkat ketidakpastian harga minyak bumi global.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1.5">2. Koefisien Transmisi Fiskal</span>
            Setiap peningkatan alokasi subsidi pupuk dan logistik impor dikalibrasi dengan elastisitas harga eceran. Subsidi pupuk menekan biaya produksi tani, sementara impor meredam kesenjangan pasokan lokal.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1.5">3. Indeks Keberlanjutan Anggaran</span>
            Intervensi fiskal yang berlebihan dapat memicu defisit fiskal negara di atas batas 3% PDB. Indeks stabilitas SATRISNA mengurangi skor keberlanjutan jika pengeluaran APBN pangan melampaui batas aman.
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
