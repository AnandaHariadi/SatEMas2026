"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Layers, Menu, X, ArrowUpRight, ShieldCheck, 
  LogIn, User, LogOut, Wallet, Check, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientButton from '../ui/GradientButton';

export interface UserProfile {
  name: string;
  role: 'Regulator BPS/BI' | 'Akademisi/Mahasiswa' | 'UMKM / Masyarakat';
  nipOrId: string;
  points: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Auth state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserProfile['role']>('Regulator BPS/BI');
  const [inputName, setInputName] = useState('Dr. Ananda Hariadi, M.Econ');
  const [inputId, setInputId] = useState('199408252020121002');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard Utama', href: '/dashboard' },
    { name: 'Ekonometrika', href: '/dashboard/prediction' },
    { name: 'Simulasi Fiskal', href: '/dashboard/simulation' },
    { name: 'Edukasi Pangan', href: '/dashboard/learning' }
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  // Pre-fill fields based on role selection for convenience
  const handleRoleChange = (role: UserProfile['role']) => {
    setSelectedRole(role);
    if (role === 'Regulator BPS/BI') {
      setInputName('Dr. Ananda Hariadi, M.Econ');
      setInputId('199408252020121002');
    } else if (role === 'Akademisi/Mahasiswa') {
      setInputName('Ananda Hariadi');
      setInputId('2106085110093');
    } else {
      setInputName('Koperasi Pangan Jaya');
      setInputId('NIB-81938592');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: inputName,
      role: selectedRole,
      nipOrId: inputId,
      points: selectedRole === 'Regulator BPS/BI' ? 250 : selectedRole === 'Akademisi/Mahasiswa' ? 120 : 75
    });
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-350 ${
        scrolled 
          ? 'py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm' 
          : 'py-5 bg-white border-b border-slate-100'
      }`}>
        {/* Top National Ribbon */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#022c1b] via-[#10b981] to-[#22c55e]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#022c1b] to-[#10b981] flex items-center justify-center text-white font-black text-base shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wider text-[#022c1b] group-hover:text-emerald-700 transition-colors uppercase">
                  SATRISNA
                </span>
                <span className="text-[8px] text-slate-400 font-bold tracking-widest -mt-1 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#10b981]" /> Portal Stabilitas Nasional
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
                    className={`px-1 py-2 text-xs font-bold transition-all duration-300 border-b-2 hover:text-[#10b981] ${
                      active
                        ? 'text-[#022c1b] border-[#022c1b]'
                        : 'text-slate-500 border-transparent hover:border-slate-200'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Login / User Status Area */}
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-[#022c1b] line-clamp-1 max-w-[150px]">{user.name}</span>
                    <span className="text-[8px] text-slate-450 font-semibold">{user.role}</span>
                  </div>
                  
                  {/* User Profile Avatar with dropdown trigger placeholder */}
                  <div className="relative group/avatar">
                    <button className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-xs font-black text-[#022c1b] cursor-pointer hover:bg-emerald-100 transition-colors">
                      {user.name.substring(0, 2).toUpperCase()}
                    </button>
                    
                    {/* Hover Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-250/80 rounded-xl shadow-xl py-2 hidden group-hover/avatar:block">
                      <div className="px-4 py-2 border-b border-slate-100 text-xs flex flex-col gap-0.5">
                        <span className="font-bold text-[#022c1b]">{user.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">ID: {user.nipOrId}</span>
                      </div>
                      
                      <div className="px-4 py-2 flex justify-between items-center text-[10px] text-slate-550 border-b border-slate-100">
                        <span className="flex items-center gap-1 font-bold">
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" /> Saldo Poin:
                        </span>
                        <span className="font-extrabold text-emerald-800">{user.points} Pts</span>
                      </div>

                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar Portal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <GradientButton 
                  variant="indigo" 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-xs py-2 flex items-center gap-1.5 font-bold"
                >
                  <LogIn className="w-3.5 h-3.5" /> Masuk Portal
                </GradientButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {user && (
                <button className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-xs font-black text-[#022c1b]">
                  {user.name.substring(0, 2).toUpperCase()}
                </button>
              )}
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
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'text-[#022c1b] bg-emerald-50/50'
                      : 'text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="px-4 text-xs font-semibold text-slate-500">
                    NIP: <span className="font-mono">{user.nipOrId}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Keluar Portal
                  </button>
                </div>
              ) : (
                <GradientButton 
                  variant="indigo" 
                  onClick={() => {
                    setIsOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="w-full text-xs"
                >
                  <LogIn className="w-4 h-4" /> Masuk Portal
                </GradientButton>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 3. POPUP LOGIN OVERLAY DIALOG (Victory-style interactive overlay) */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 w-full max-w-[420px] rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-slate-400 block">Sistem Otentikasi</span>
                  <h3 className="text-base font-black text-slate-800">Masuk Portal SATRISNA</h3>
                </div>
                <button 
                  onClick={() => setIsLoginOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-655 border border-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs font-semibold">
                
                {/* Role Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">Pilih Hak Akses Pengguna:</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    {(['Regulator BPS/BI', 'Akademisi/Mahasiswa', 'UMKM / Masyarakat'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`py-2 text-[8px] font-black uppercase text-center rounded-lg transition-all cursor-pointer ${
                          selectedRole === role 
                            ? 'bg-[#022c1b] text-white shadow-sm' 
                            : 'text-slate-455 hover:text-slate-700'
                        }`}
                      >
                        {role.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">Nama Lengkap Pengguna:</label>
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#022c1b] transition-colors"
                  />
                </div>

                {/* Input ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">
                    {selectedRole === 'Regulator BPS/BI' ? 'NIP Pejabat BPS/BI:' : selectedRole === 'Akademisi/Mahasiswa' ? 'NIM Mahasiswa:' : 'NIB Pelaku Usaha:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono focus:outline-none focus:border-[#022c1b] transition-colors"
                  />
                </div>

                {/* Simulated Password */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-slate-500">Sandi Akses Kriptografi:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      defaultValue="••••••••••••••"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#022c1b] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <GradientButton type="submit" variant="indigo" className="w-full font-bold">
                    Konfirmasi Masuk Portal &rarr;
                  </GradientButton>
                  
                  <span className="text-[9px] text-slate-400 text-center leading-normal">
                    *Gunakan kredibilitas simulasi otomatis untuk pengujian portal.
                  </span>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
