"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Regulator BPS/BI' | 'Akademisi/Mahasiswa' | 'UMKM / Masyarakat';
export type AppMode = 'pemerintah' | 'akademisi' | 'masyarakat';

export interface UserProfile {
  name: string;
  role: UserRole;
  mode: AppMode;
  nipOrId: string;
  points: number;
  email?: string;
  institution?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'inflation' | 'alert' | 'system' | 'policy';
}

interface AuthContextType {
  user: UserProfile | null;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  language: 'ID' | 'EN';
  setLanguage: (lang: 'ID' | 'EN') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoadingScreen: boolean;
  triggerLoadingScreen: (durationMs?: number) => void;
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  login: (name: string, role: UserRole, nipOrId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Rilis Inflasi BPS Agustus 2026',
    message: 'Inflasi Volatile Food bulan ini tercatat 2.80% (y-on-y). Pasokan Beras Medium SPHP stabil.',
    date: '04 Agu 2026',
    read: false,
    type: 'inflation'
  },
  {
    id: 'notif-[#2]',
    title: 'Peringatan Geospasial: Papua Timur',
    message: 'Status Darurat Pangan terdeteksi di Papua Timur akibat gelombang laut tinggi mengganggu kapal logistik.',
    date: '03 Agu 2026',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-3',
    title: 'Insentif Fiskal APBN Disetujui',
    message: 'Kemenkeu merilis dana penyeimbang Rp 1.2 T untuk subsidi pupuk organik lokal.',
    date: '01 Agu 2026',
    read: true,
    type: 'policy'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Dr. Ananda Hariadi, M.Econ',
    role: 'Regulator BPS/BI',
    mode: 'pemerintah',
    nipOrId: '199408252020121002',
    points: 250,
    institution: 'Badan Pusat Statistik / Bank Indonesia'
  });

  const [mode, setModeState] = useState<AppMode>('pemerintah');
  const [language, setLanguage] = useState<'ID' | 'EN'>('ID');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const triggerLoadingScreen = (durationMs = 1200) => {
    setIsLoadingScreen(true);
    setTimeout(() => {
      setIsLoadingScreen(false);
    }, durationMs);
  };

  const setMode = (newMode: AppMode) => {
    triggerLoadingScreen(900);
    setModeState(newMode);
    if (user) {
      setUser({
        ...user,
        mode: newMode
      });
    }
  };

  const login = (name: string, role: UserRole, nipOrId: string) => {
    triggerLoadingScreen(1200);
    const userMode: AppMode = role === 'Regulator BPS/BI' ? 'pemerintah' : role === 'Akademisi/Mahasiswa' ? 'akademisi' : 'masyarakat';
    setUser({
      name,
      role,
      mode: userMode,
      nipOrId,
      points: role === 'Regulator BPS/BI' ? 250 : role === 'Akademisi/Mahasiswa' ? 120 : 75,
      institution: role === 'Regulator BPS/BI' ? 'BPS / BI Regulator' : role === 'Akademisi/Mahasiswa' ? 'Universitas Indonesia / FEB' : 'Koperasi Pangan Mitra'
    });
    setModeState(userMode);
  };

  const logout = () => {
    triggerLoadingScreen(800);
    setUser(null);
    setModeState('masyarakat');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AuthContext.Provider value={{
      user,
      mode,
      setMode,
      language,
      setLanguage,
      isDarkMode,
      toggleDarkMode,
      isLoadingScreen,
      triggerLoadingScreen,
      notifications,
      markNotificationAsRead,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
