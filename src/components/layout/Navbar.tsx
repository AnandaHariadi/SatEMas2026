"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, LogIn, LogOut, Wallet, Eye, EyeOff,
  Globe, PhoneCall, X, Menu, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserProfile } from '@/lib/AuthContext';
import GradientButton from '../ui/GradientButton';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Shared Auth context
  const { user, login, logout } = useAuth();
  
  // Login modal toggle
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
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

  const navLinks = user 
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Studio ARIMA', href: '/dashboard/prediction' },
        { name: 'Simulator APBN', href: '/dashboard/simulation' },
        { name: 'Peta SITABA', href: '/dashboard/map' },
        { name: 'Edukasi Pangan', href: '/dashboard/learning' }
      ]
    : [
        { name: 'Beranda', href: '/' },
        { name: 'Tentang Satrisna', href: '/#tentang' },
        { name: 'Pilar Layanan', href: '/#fitur' },
        { name: 'Peta Geospasial', href: '/dashboard/map' },
        { name: 'Mitra Strategis', href: '/#mitra' }
      ];

  const isActive = (path: string) => {
    if (path.startsWith('/#') || path === '/') {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      return pathname === '/' && pathname + hash === path;
    }
    return pathname === path || pathname?.startsWith(path + '/');
  };

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
    login(inputName, selectedRole, inputId);
    setIsLoginOpen(false);
  };

  return (
    <>
      {/* Floating Header Container */}
      <header className="fixed top-0 left-0 right-0 z-45 flex flex-col items-center px-4 pt-3 pointer-events-none">
        
        <nav className={`pointer-events-auto w-full max-w-7xl mx-auto rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-2.5 px-6' 
            : 'bg-white/85 backdrop-blur-md border border-slate-200/70 shadow-md py-3.5 px-6'
        }`}>
          <div className="flex justify-between items-center">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#022c1b] via-[#05321f] to-[#10b981] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-wider text-[#022c1b] group-hover:text-emerald-700 transition-colors uppercase leading-none">
                    SATRISNA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#10b981]" /> Portal Stabilitas Nasional
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                      active
                        ? 'bg-[#022c1b] text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action / Profile */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-black text-[#022c1b] line-clamp-1 max-w-[130px]">{user.name}</span>
                    <span className="text-[8px] text-slate-450 font-bold uppercase">{user.role}</span>
                  </div>
                  
                  <div className="relative group/avatar">
                    <button className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-[#10b981] flex items-center justify-center text-xs font-black text-[#022c1b] cursor-pointer hover:bg-emerald-100 transition-colors shadow-sm">
                      {user.name.substring(0, 2).toUpperCase()}
                    </button>
                    
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover/avatar:block z-50">
                      <div className="px-4 py-2 border-b border-slate-100 text-xs flex flex-col gap-0.5">
                        <span className="font-bold text-[#022c1b]">{user.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">NIP: {user.nipOrId}</span>
                      </div>
                      
                      <div className="px-4 py-2 flex justify-between items-center text-[10px] text-slate-600 border-b border-slate-100">
                        <span className="flex items-center gap-1 font-bold">
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" /> Saldo Poin:
                        </span>
                        <span className="font-extrabold text-emerald-800">{user.points} Pts</span>
                      </div>

                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar Portal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <GradientButton 
                  variant="emerald" 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-xs py-2.5 px-5 rounded-full flex items-center gap-1.5 font-bold shadow-md shadow-emerald-500/10"
                >
                  <LogIn className="w-3.5 h-3.5" /> Masuk Portal
                </GradientButton>
              )}
            </div>

            {/* Mobile Drawer Trigger */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <button className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-xs font-black text-[#022c1b]">
                  {user.name.substring(0, 2).toUpperCase()}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="pointer-events-auto md:hidden w-full max-w-7xl mx-auto mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 flex flex-col gap-2 shadow-xl">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'text-[#022c1b] bg-emerald-50/80 font-black'
                      : 'text-slate-600 hover:bg-slate-50'
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
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-2xl border border-red-200 text-xs font-bold text-red-600 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Keluar Portal
                  </button>
                </div>
              ) : (
                <GradientButton 
                  variant="emerald" 
                  onClick={() => {
                    setIsOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="w-full text-xs py-3 rounded-2xl"
                >
                  <LogIn className="w-4 h-4" /> Masuk Portal Penstabil
                </GradientButton>
              )}
            </div>
          </div>
        )}

      </header>

      {/* Spacer */}
      <div className="h-[80px]" />

      {/* POPUP LOGIN OVERLAY DIALOG */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 w-full max-w-[850px] h-auto md:h-[540px] rounded-3xl shadow-2xl p-0 flex flex-col md:flex-row overflow-hidden relative"
            >
              
              {/* Left Column */}
              <div className="w-full md:w-[42%] bg-gradient-to-tr from-[#021f13] to-[#05321f] text-white p-8 flex flex-col justify-between relative overflow-hidden hidden md:flex border-r border-emerald-950/20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
                
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase">[ PORTAL OTENTIKASI ]</span>
                  <h3 className="text-base font-black tracking-tight text-white uppercase">SATRISNA DSS</h3>
                  <p className="text-[10px] text-slate-300 leading-normal font-semibold">
                    Sistem Pendukung Keputusan Pengamanan Anggaran &amp; Inflasi Pangan Volatile
                  </p>
                </div>

                <div className="w-full flex justify-center items-center my-6 relative z-10">
                  <svg className="w-full max-w-[210px] h-[170px]" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 120 L90 80 L190 120 L90 160 Z" fill="#01100a" stroke="#062e1c" strokeWidth="1.5" />
                    <rect x="85" y="100" width="10" height="35" rx="2" fill="#05321f" stroke="#10b981" strokeWidth="1" />
                    <path d="M45 65 L85 45 L85 95 L45 115 Z" fill="#021f13" stroke="#10b981" strokeWidth="1.5" />
                    <path d="M50 72 L80 57" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
                    <path d="M50 82 L80 67" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
                    <path d="M50 95 Q 65 85, 80 80" stroke="#10b981" strokeWidth="2" fill="none" />
                    <path d="M95 45 L135 65 L135 115 L95 95 Z" fill="#021f13" stroke="#10b981" strokeWidth="1.5" />
                    <circle cx="115" cy="75" r="3.5" fill="#ef4444" className="animate-pulse" />
                    <circle cx="108" cy="68" r="2" fill="#f59e0b" />
                    <circle cx="125" cy="85" r="2.5" fill="#10b981" />
                    <path d="M100 85 L125 72 L128 98 L105 102 Z" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" />
                    <path d="M75 125 L95 115 L115 125 L95 135 Z" fill="#022013" stroke="#10b981" strokeWidth="1.2" />
                    <path d="M95 115 L95 102 L115 112 L115 125 Z" fill="#01140c" stroke="#10b981" strokeWidth="1" />
                    <path d="M90 10 Q 82 25, 90 35 Q 98 25, 90 10 Z" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1" />
                    <line x1="90" y1="10" x2="90" y2="35" stroke="#10b981" strokeWidth="0.5" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col gap-1 text-[8px] text-emerald-450/70 font-mono tracking-wider">
                  <span>OTENTIKASI TERENKRIPSI SSL 256-BIT</span>
                  <span>SATRISNA COMPLIANT BPS &amp; BI</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-[58%] flex flex-col justify-between p-6 sm:p-8 bg-white relative">
                
                <button 
                  onClick={() => setIsLoginOpen(false)}
                  className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-1.5 pr-6 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#022c1b] to-[#10b981] flex items-center justify-center text-white font-black text-xs">
                      S
                    </div>
                    <span className="text-[10px] font-black tracking-wider text-[#022c1b] uppercase">SATRISNA Portal</span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 mt-2">Selamat Datang di Portal Penstabil.</h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Sistem otentikasi BPS &amp; BI. Masukkan NIP kepegawaian Anda untuk mengakses ruang kerja keputusan nasional.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5 text-xs font-semibold mt-4">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px] font-bold">Pilih Hak Akses:</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {(['Regulator BPS/BI', 'Akademisi/Mahasiswa', 'UMKM / Masyarakat'] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleChange(role)}
                          className={`py-1.5 text-[8px] font-black uppercase text-center rounded-lg transition-all cursor-pointer ${
                            selectedRole === role 
                              ? 'bg-[#022c1b] text-white shadow-sm' 
                              : 'text-slate-450 hover:text-slate-700'
                          }`}
                        >
                          {role.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px]">Nama Lengkap Pengguna:</label>
                    <input
                      type="text"
                      required
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-medium focus:outline-none focus:border-[#022c1b] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px]">
                      {selectedRole === 'Regulator BPS/BI' ? 'NIP Kepegawaian:' : selectedRole === 'Akademisi/Mahasiswa' ? 'NIM Akademis:' : 'NIB Registrasi Usaha:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inputId}
                      onChange={(e) => setInputId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-mono focus:outline-none focus:border-[#022c1b] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1 relative">
                    <label className="text-slate-505 text-[10px]">Kunci Sandi Kriptografi:</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        defaultValue="••••••••••••••"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] focus:outline-none focus:border-[#022c1b] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-655 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <GradientButton type="submit" variant="emerald" className="w-full py-2.5 font-bold text-xs shadow-md shadow-emerald-500/10">
                      Login Portal Utama
                    </GradientButton>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        login("Dr. Ananda Hariadi, M.Econ", "Regulator BPS/BI", "199408252020121002");
                        setIsLoginOpen(false);
                      }}
                      className="w-full py-2 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/10 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 cursor-pointer transition-all duration-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Masuk dengan Akun Pegawai BPS / BI
                    </button>
                  </div>

                </form>

                <div className="flex justify-between items-center text-[9px] text-slate-405 font-bold pt-4 border-t border-slate-100 mt-4">
                  <button 
                    type="button"
                    onClick={() => alert("Silakan hubungi Administrator IT BPS / BI untuk me-reset sandi kepegawaian Anda.")}
                    className="hover:text-emerald-700 transition-colors uppercase font-mono cursor-pointer"
                  >
                    Reset Password
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setInputName('Dr. Ananda Hariadi, M.Econ');
                      setInputId('199408252020121002');
                      setSelectedRole('Regulator BPS/BI');
                      alert("Cache sesi didekripsi dan dibersihkan.");
                    }}
                    className="hover:text-emerald-700 transition-colors uppercase font-mono cursor-pointer"
                  >
                    Bersihkan Cache
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
