// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, supabase } from '@/lib/api';
import type { AppRole } from '@/lib/api';
import { ensureProfileFor } from '@/lib/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: AppRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        try {
          const profile = await ensureProfileFor(session.user);
          setUser(profile);
        } catch (err) {
          console.error('❌ Gagal sinkron profil:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      try { listener.subscription.unsubscribe(); } catch {}
    };
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await api.login({ email, password });
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    const registeredUser = await api.register(userData);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
