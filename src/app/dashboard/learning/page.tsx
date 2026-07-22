"use client";

import React from 'react';
import LearningPath from '@/components/learning/LearningPath';
import QuizModule from '@/components/learning/QuizModule';
import GlossaryEconomics from '@/components/learning/GlossaryEconomics';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';

export default function LearningPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Portal Edukasi Ekonomi Pangan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pelajari transmisi kebijakan makroekonomi, teori time-series, dan uji pemahaman Anda lewat simulasi interaktif.
          </p>
        </div>
      </SectionWrapper>

      {/* Grid Layout: Roadmap & Glossary (Left) + Quiz (Right) */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roadmap and Dictionary */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Peta Pembelajaran Ekonomi Volatilitas
            </h2>
            <LearningPath />
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-1.5 border-b border-slate-900 pb-3">
              Kamus Istilah Ekonometrika & Fiskal
            </h2>
            <GlossaryEconomics />
          </div>

        </div>

        {/* Interactive Quiz */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-full justify-between">
            <div className="border-b border-slate-900 pb-3 mb-4">
              <h2 className="text-sm font-bold text-slate-100">
                Uji Kompetensi Kualitatif
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Uji penalaran Anda tentang transmisi logistik, subsidi, dan pemodelan statistik pangan.
              </p>
            </div>

            <div className="flex-1">
              <QuizModule />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-900 flex gap-2 text-[10px] text-slate-500 leading-normal">
              <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>
                Kuis ini dirancang untuk mahasiswa makroekonomi, praktisi fiskal daerah, dan masyarakat umum guna memahami kebijakan pangan nasional secara obyektif.
              </span>
            </div>
          </div>
        </div>

      </SectionWrapper>

    </div>
  );
}
