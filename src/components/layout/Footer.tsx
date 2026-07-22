"use client";

import React from 'react';
import Link from 'next/link';
import { Award, ShieldAlert, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const footerLinks = user
    ? [
        { name: 'Dashboard Utama BPS', href: '/dashboard' },
        { name: 'Analisis ARIMA/GARCH', href: '/dashboard/prediction' },
        { name: 'Simulasi Monte Carlo', href: '/dashboard/simulation' },
        { name: 'Portal Literasi Pangan', href: '/dashboard/learning' }
      ]
    : [
        { name: 'Beranda Utama', href: '/' },
        { name: 'Tentang Kami', href: '/#tentang' },
        { name: 'Fitur Utama', href: '/#fitur' },
        { name: 'Mitra Strategis', href: '/#mitra' }
      ];

  return (
    <footer className="bg-[#032215] text-slate-200 border-t border-emerald-900 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                S
              </div>
              <span className="text-lg font-black text-white tracking-wider">SATRISNA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Integrasi Analitik Digital Berbasis Model Ekonometrika Time-Series dalam Prediksi Inflasi Pangan dan Simulasi Kebijakan Fiskal untuk Stabilitas Ekonomi Nasional Menuju Indonesia Emas 2045.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {user ? 'Akses Portal Terpadu' : 'Akses Landing Page'}
            </span>
            <div className="flex flex-col gap-2 text-xs text-slate-400 font-semibold">
              {footerLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Technology & Compliance */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Kredibilitas Basis Data</span>
            <div className="flex flex-col gap-2 text-xs text-slate-400 leading-relaxed font-semibold">
              <div className="flex items-start gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                <span>Terintegrasi dengan basis data harian Badan Pusat Statistik (BPS), Bank Indonesia (BI), dan SP2KP Kementerian Perdagangan RI.</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-slate-500 leading-normal">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Model matematis ARIMA/GARCH dan simulasi Monte Carlo diselaraskan sebagai instrumen representasi kebijakan fiskal nasional.</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} SATRISNA Platform. All rights reserved.</span>
          <div className="flex items-center gap-1 font-bold">
            <span>Dibuat untuk Stabilitas Ekonomi Indonesia Emas 2045 oleh Tim Gemastik</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
