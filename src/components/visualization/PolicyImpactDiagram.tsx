"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, TrendingDown, DollarSign, Sprout, ArrowRight } from 'lucide-react';

interface PolicyImpactDiagramProps {
  fertilizerSubsidy: number;
  riceImportVolume: number;
  bulogDistribution: number;
}

export default function PolicyImpactDiagram({
  fertilizerSubsidy,
  riceImportVolume,
  bulogDistribution
}: PolicyImpactDiagramProps) {
  // Determine if channels are active based on sliders
  const isSubsidyActive = fertilizerSubsidy > 20;
  const isImportActive = riceImportVolume > 0.5;
  const isBulogActive = bulogDistribution > 20;

  return (
    <div className="w-full py-8 px-4 glass-panel rounded-2xl relative overflow-hidden">
      {/* Background soft grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <h3 className="text-base font-bold text-slate-100 mb-6 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-indigo-400" />
        Transmisi Kebijakan Fiskal ke Sektor Riil
      </h3>

      {/* Grid columns matching transmission stages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center relative z-10">
        
        {/* Stage 1: Levers */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            1. Stimulus Fiskal
          </span>
          
          {/* Subsidy Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isSubsidyActive 
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Sprout className={`w-4 h-4 ${isSubsidyActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-semibold ${isSubsidyActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                Subsidi Pupuk
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Stimulus input pertanian domestik</span>
            <div className="mt-2 text-xs font-bold text-emerald-400">+{fertilizerSubsidy}% Alokasi</div>
          </div>

          {/* Import Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isImportActive 
              ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Truck className={`w-4 h-4 ${isImportActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-semibold ${isImportActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                Kuota Impor Beras
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Penyangga defisit pasok dalam negeri</span>
            <div className="mt-2 text-xs font-bold text-indigo-400">{riceImportVolume} Juta Ton</div>
          </div>

          {/* Bulog Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isBulogActive 
              ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className={`w-4 h-4 ${isBulogActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-semibold ${isBulogActive ? 'text-amber-300' : 'text-slate-400'}`}>
                Distribusi Bulog
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Penyaluran cadangan pangan (SPHP)</span>
            <div className="mt-2 text-xs font-bold text-amber-400">{bulogDistribution}% Operasi</div>
          </div>

        </div>

        {/* Transition Arrow 1 */}
        <div className="hidden lg:flex justify-center text-slate-600">
          <ArrowRight className="w-6 h-6 animate-pulse text-slate-500" />
        </div>

        {/* Stage 2: Transmission Effects */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            2. Transmisi Sektor Riil
          </span>

          {/* Farm Production Cost Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isSubsidyActive 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <span className={`text-xs font-semibold block mb-1 ${isSubsidyActive ? 'text-emerald-300' : 'text-slate-400'}`}>
              Biaya Produksi Tani Turun
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Petani menekan Harga Pokok Produksi (HPP) sehingga panen lebih kompetitif.
            </p>
          </div>

          {/* Supply Expansion Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isImportActive || isBulogActive 
              ? 'bg-indigo-500/5 border-indigo-500/30' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <span className={`text-xs font-semibold block mb-1 ${isImportActive || isBulogActive ? 'text-indigo-300' : 'text-slate-400'}`}>
              Ekspansi Pasok Pasar
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Cadangan Bulog dan beras impor mengamankan ketersediaan stok di gudang retail.
            </p>
          </div>

          {/* Speculation Dampening Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isBulogActive 
              ? 'bg-amber-500/5 border-amber-500/30' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <span className={`text-xs font-semibold block mb-1 ${isBulogActive ? 'text-amber-300' : 'text-slate-400'}`}>
              Spekulasi Pasar Meredam
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Operasi pasar taktis menghilangkan motif penimbunan oleh spekulan eceran.
            </p>
          </div>

        </div>

        {/* Transition Arrow 2 */}
        <div className="hidden lg:flex justify-center text-slate-600">
          <ArrowRight className="w-6 h-6 animate-pulse text-slate-500" />
        </div>

        {/* Stage 3: Outputs */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            3. Dampak Ekonomi Makro
          </span>

          <div className={`p-6 rounded-2xl border transition-all duration-500 flex items-start gap-4 ${
            isSubsidyActive || isImportActive || isBulogActive
              ? 'bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              <DollarSign className={`w-6 h-6 ${
                isSubsidyActive || isImportActive || isBulogActive ? 'text-emerald-400 animate-bounce' : 'text-slate-600'
              }`} />
            </div>
            <div>
              <span className={`font-bold block mb-1 ${
                isSubsidyActive || isImportActive || isBulogActive ? 'text-slate-100' : 'text-slate-400'
              }`}>
                Keseimbangan Harga Pangan Terjaga
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tindakan intervensi menurunkan harga pokok domestik dan menjaga cadangan penyangga logistik nasional. Indeks harga konsumen (IHK) volatile food bergerak stabil menuju target inflasi nasional Indonesia Emas 2045.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isSubsidyActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  Transmisi Pertanian
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isImportActive ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  Transmisi Impor
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isBulogActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  Transmisi Bulog
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
