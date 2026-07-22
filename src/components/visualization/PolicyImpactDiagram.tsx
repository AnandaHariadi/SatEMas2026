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
  const isSubsidyActive = fertilizerSubsidy > 20;
  const isImportActive = riceImportVolume > 0.5;
  const isBulogActive = bulogDistribution > 20;

  return (
    <div className="w-full py-8 px-4 bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm">
      {/* Background soft grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      <h3 className="text-sm font-bold text-emerald-950 mb-6 flex items-center gap-2 relative z-10">
        <TrendingDown className="w-5 h-5 text-emerald-700" />
        Transmisi Kebijakan Fiskal ke Sektor Riil
      </h3>

      {/* Grid columns matching transmission stages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center relative z-10">
        
        {/* Stage 1: Levers */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-455 border-b border-slate-100 pb-2">
            1. Stimulus Fiskal
          </span>
          
          {/* Subsidy Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isSubsidyActive 
              ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Sprout className={`w-4 h-4 ${isSubsidyActive ? 'text-emerald-750' : 'text-slate-400'}`} />
              <span className={`text-xs font-bold ${isSubsidyActive ? 'text-emerald-900' : 'text-slate-500'}`}>
                Subsidi Pupuk
              </span>
            </div>
            <span className="text-[9px] text-slate-450 block leading-tight">Stimulus input pertanian domestik</span>
            <div className="mt-2 text-xs font-bold text-emerald-700">+{fertilizerSubsidy}% Alokasi</div>
          </div>

          {/* Import Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isImportActive 
              ? 'bg-emerald-50/60 border-emerald-450 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Truck className={`w-4 h-4 ${isImportActive ? 'text-emerald-700' : 'text-slate-405'}`} />
              <span className={`text-xs font-bold ${isImportActive ? 'text-emerald-900' : 'text-slate-500'}`}>
                Kuota Impor Beras
              </span>
            </div>
            <span className="text-[9px] text-slate-450 block leading-tight">Penyangga defisit pasok dalam negeri</span>
            <div className="mt-2 text-xs font-bold text-emerald-800">{riceImportVolume} Juta Ton</div>
          </div>

          {/* Bulog Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isBulogActive 
              ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className={`w-4 h-4 ${isBulogActive ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className={`text-xs font-bold ${isBulogActive ? 'text-emerald-900' : 'text-slate-500'}`}>
                Distribusi Bulog
              </span>
            </div>
            <span className="text-[9px] text-slate-455 block leading-tight">Penyaluran cadangan pangan (SPHP)</span>
            <div className="mt-2 text-xs font-bold text-emerald-700">{bulogDistribution}% Operasi</div>
          </div>

        </div>

        {/* Transition Arrow 1 */}
        <div className="hidden lg:flex justify-center text-slate-400">
          <ArrowRight className="w-6 h-6 animate-pulse text-emerald-700" />
        </div>

        {/* Stage 2: Transmission Effects */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 border-b border-slate-100 pb-2">
            2. Transmisi Sektor Riil
          </span>

          {/* Farm Production Cost Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isSubsidyActive 
              ? 'bg-emerald-50/30 border-emerald-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold block mb-1 ${isSubsidyActive ? 'text-emerald-900' : 'text-slate-500'}`}>
              Biaya Produksi Tani Turun
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Petani menekan Harga Pokok Produksi (HPP) sehingga panen lebih kompetitif.
            </p>
          </div>

          {/* Supply Expansion Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isImportActive || isBulogActive 
              ? 'bg-emerald-50/30 border-emerald-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold block mb-1 ${isImportActive || isBulogActive ? 'text-emerald-900' : 'text-slate-500'}`}>
              Ekspansi Pasok Pasar
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Cadangan Bulog dan beras impor mengamankan ketersediaan stok di gudang retail.
            </p>
          </div>

          {/* Speculation Dampening Node */}
          <div className={`p-4 rounded-xl border transition-all duration-500 ${
            isBulogActive 
              ? 'bg-emerald-50/30 border-emerald-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold block mb-1 ${isBulogActive ? 'text-emerald-900' : 'text-slate-500'}`}>
              Spekulasi Pasar Meredam
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Operasi pasar taktis menghilangkan motif penimbunan oleh spekulan eceran.
            </p>
          </div>

        </div>

        {/* Transition Arrow 2 */}
        <div className="hidden lg:flex justify-center text-slate-400">
          <ArrowRight className="w-6 h-6 animate-pulse text-emerald-700" />
        </div>

        {/* Stage 3: Outputs */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 border-b border-slate-100 pb-2">
            3. Dampak Ekonomi Makro
          </span>

          <div className={`p-6 rounded-2xl border transition-all duration-500 flex items-start gap-4 ${
            isSubsidyActive || isImportActive || isBulogActive
              ? 'bg-emerald-50/20 border-emerald-300 shadow-sm'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shrink-0">
              <DollarSign className={`w-6 h-6 ${
                isSubsidyActive || isImportActive || isBulogActive ? 'text-emerald-700 animate-bounce' : 'text-slate-400'
              }`} />
            </div>
            <div>
              <span className={`font-bold block mb-1 ${
                isSubsidyActive || isImportActive || isBulogActive ? 'text-emerald-950' : 'text-slate-500'
              }`}>
                Keseimbangan Harga Pangan Terjaga
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan intervensi menurunkan harga pokok domestik dan menjaga cadangan penyangga logistik nasional. Indeks harga konsumen (IHK) volatile food bergerak stabil menuju target inflasi nasional Indonesia Emas 2045.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                  isSubsidyActive ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  Transmisi Pertanian
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                  isImportActive ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  Transmisi Impor
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                  isBulogActive ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-400'
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
