"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Cpu, BookOpen, Layers, Menu, X, ArrowUpRight } from 'lucide-react';
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
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    { name: 'Prediksi Ekonometrika', href: '/dashboard/prediction', icon: TrendingUp },
    { name: 'Simulasi Fiskal', href: '/dashboard/simulation', icon: Cpu },
    { name: 'Edukasi Pangan', href: '/dashboard/learning', icon: BookOpen }
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-900' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md group-hover:scale-105 transition-all duration-300">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-slate-100 group-hover:text-emerald-400 transition-colors">
                SATRISNA
              </span>
              <span className="text-[9px] text-slate-400 tracking-widest -mt-1 uppercase">
                Indonesia Emas 2045
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            
            <Link href="/dashboard">
              <GradientButton variant="emerald" className="text-xs py-2">
                Mulai Analisis <ArrowUpRight className="w-3.5 h-3.5" />
              </GradientButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 border-b border-slate-900 py-4 px-4 flex flex-col gap-2 backdrop-blur-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  active
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-900">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <GradientButton variant="emerald" className="w-full">
                Mulai Analisis <ArrowUpRight className="w-4 h-4" />
              </GradientButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
