"use client";

import React from 'react';
import { Globe, TrendingUp, Cpu, Award, ChevronRight } from 'lucide-react';

export default function LearningPath() {
  const steps = [
    {
      number: '01',
      title: 'Volatilitas Energi Global & Shock Distribusi',
      icon: Globe,
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50/50',
      desc: 'Pelajari bagaimana ketegangan geopolitik internasional memengaruhi harga minyak dunia (crude oil) dan langsung mentransmisikan inflasi ke pasar pangan domestik melalui peningkatan biaya logistik angkutan.'
    },
    {
      number: '02',
      title: 'Ekonometrika Time-Series Pangan (ARIMA/GARCH)',
      icon: TrendingUp,
      color: 'text-[#064e3b] border-emerald-300 bg-emerald-50/30',
      desc: 'Pahami cara kerja model statistik ARIMA untuk memprediksi harga dengan pola historis linear stabil, serta model GARCH untuk menangkap guncangan volatilitas heteroskedastisitas pada tanaman hortikultura seperti cabai.'
    },
    {
      number: '03',
      title: 'Simulasi Fiskal & Operasi Pasar Penyangga',
      icon: Cpu,
      color: 'text-emerald-600 border-emerald-200 bg-emerald-50/20',
      desc: 'Eksplorasi instrumen APBN penstabil pangan: belanja subsidi pupuk (sisi penawaran produksi), kuota impor beras strategis (sisi pemenuhan defisit pasokan), serta distribusi beras SPHP Bulog (sisi intervensi spekulasi).'
    },
    {
      number: '04',
      title: 'Stabilitas Pangan Menuju Indonesia Emas 2045',
      icon: Award,
      color: 'text-emerald-800 border-emerald-300 bg-emerald-100/30',
      desc: 'Hubungkan kestabilan harga kebutuhan pokok dengan pertumbuhan ekonomi nasional 6-7%, perlindungan daya beli kelas menengah ke bawah, penurunan stunting, dan keberhasilan bonus demografi Indonesia.'
    }
  ];

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#064e3b] to-[#10b981] hidden md:block" />

      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div key={idx} className="flex flex-col md:flex-row gap-4 items-start relative z-10">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${step.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex-1 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Modul {step.number}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                  Mulai Belajar <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-800 mb-2">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
