"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  role: 'Regulator BPS/BI' | 'Akademisi/Mahasiswa' | 'UMKM / Masyarakat';
  nipOrId: string;
  points: number;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (name: string, role: UserProfile['role'], nipOrId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (name: string, role: UserProfile['role'], nipOrId: string) => {
    setUser({
      name,
      role,
      nipOrId,
      points: role === 'Regulator BPS/BI' ? 250 : role === 'Akademisi/Mahasiswa' ? 120 : 75
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
