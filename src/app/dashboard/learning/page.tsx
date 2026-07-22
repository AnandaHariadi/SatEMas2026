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
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-800" />
            Portal Edukasi Ekonomi Pangan
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Pelajari transmisi kebijakan makroekonomi, teori time-series, dan uji pemahaman Anda lewat simulasi interaktif.
          </p>
        </div>
      </SectionWrapper>

      {/* Grid Layout: Roadmap & Glossary (Left) + Quiz (Right) */}
      <SectionWrapper className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roadmap and Dictionary */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              Peta Pembelajaran Ekonomi Volatilitas
            </h2>
            <LearningPath />
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              Kamus Istilah Ekonometrika & Fiskal
            </h2>
            <GlossaryEconomics />
          </div>

        </div>

        {/* Interactive Quiz */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col h-full justify-between">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-black text-slate-800">
                Uji Kompetensi Pangan
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Uji penalaran Anda tentang transmisi logistik, subsidi, dan pemodelan statistik pangan.
              </p>
            </div>

            <div className="flex-1">
              <QuizModule />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-2 text-[10px] text-slate-500 leading-normal font-medium">
              <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0" />
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
