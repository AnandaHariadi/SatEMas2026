"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Cpu, BookOpen, Layers, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard Utama', href: '/dashboard', icon: Layers },
    { name: 'Analisis Ekonometrika', href: '/dashboard/prediction', icon: TrendingUp },
    { name: 'Simulasi Fiskal', href: '/dashboard/simulation', icon: Cpu },
    { name: 'Modul Edukasi Pangan', href: '/dashboard/learning', icon: BookOpen }
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
        : 'py-5 bg-white border-b border-slate-100'
    }`}>
      {/* Top National Ribbon */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-850 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-emerald-950 group-hover:text-emerald-700 transition-colors">
                SATRISNA
              </span>
              <span className="text-[9px] text-slate-500 font-bold tracking-widest -mt-1.5 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Portal Stabilitas Nasional
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-1 py-2 text-xs font-bold transition-all duration-300 border-b-2 hover:text-emerald-700 ${
                    active
                      ? 'text-emerald-800 border-emerald-700'
                      : 'text-slate-500 border-transparent hover:border-slate-200'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <Link href="/dashboard">
              <GradientButton variant="indigo" className="text-xs py-2">
                Analisis Terpadu <ArrowUpRight className="w-3.5 h-3.5" />
              </GradientButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 py-4 px-4 flex flex-col gap-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  active
                    ? 'text-emerald-800 bg-emerald-500/5 border border-emerald-500/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <GradientButton variant="indigo" className="w-full">
                Analisis Terpadu <ArrowUpRight className="w-4 h-4" />
              </GradientButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
