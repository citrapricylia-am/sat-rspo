// src/contexts/AuthContext.tsx
import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { api, type UserProfile } from "@/lib/api";
import type { Session, User as SupaUser, AuthChangeEvent } from "@supabase/supabase-js";

type AuthContextType = {
  user: SupaUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error?: string | null;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (p: {
    fullName: string; email: string; password: string; phone?: string; address?: string; role: "petani" | "manajer";
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const fetchingProfile = useRef(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      setLoading(true);
      setErr(null);

      const { data } = await supabase.auth.getSession();
      const session: Session | null = data.session ?? null;
      setUser(session?.user ?? null);

      const uid = session?.user?.id;
      if (uid && !fetchingProfile.current) {
        fetchingProfile.current = true;
        api.getUserProfile(uid)
          .then((p) => {
            setProfile(p);
            if (p) localStorage.setItem("profile_cache", JSON.stringify(p));
          })
          .finally(() => (fetchingProfile.current = false));
      } else {
        const cached = localStorage.getItem("profile_cache");
        if (cached) try { setProfile(JSON.parse(cached)); } catch {}
      }

      const { data: sub } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session) => {
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            setUser(session?.user ?? null);
            const uid2 = session?.user?.id;
            if (uid2 && !fetchingProfile.current) {
              fetchingProfile.current = true;
              api.getUserProfile(uid2)
                .then((p) => {
                  setProfile(p);
                  if (p) localStorage.setItem("profile_cache", JSON.stringify(p));
                })
                .finally(() => (fetchingProfile.current = false));
            }
          }
          if (event === "SIGNED_OUT") {
            setUser(null);
            setProfile(null);
            localStorage.removeItem("profile_cache");
          }
        }
      );
      cleanup = () => sub.subscription.unsubscribe();
      setLoading(false);
    };

    boot();
    return () => { if (cleanup) cleanup(); };
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true); setErr(null);
    try {
      const p = await api.login({ email, password });
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setProfile(p);
      if (p) localStorage.setItem("profile_cache", JSON.stringify(p));
      return p;
    } catch (e: any) {
      setErr(e?.message || "Gagal login");
      throw e;
    } finally { setLoading(false); }
  };

  const register = async (payload: {
    fullName: string; email: string; password: string; phone?: string; address?: string; role: "petani" | "manajer";
  }): Promise<UserProfile> => {
    setLoading(true); setErr(null);
    try {
      const p = await api.register(payload);
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setProfile(p);
      if (p) localStorage.setItem("profile_cache", JSON.stringify(p));
      return p;
    } catch (e: any) {
      setErr(e?.message || "Gagal mendaftar");
      throw e;
    } finally { setLoading(false); }
  };

  const logout = async () => {
    setLoading(true);
    try { await api.logout(); }
    finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("profile_cache");
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user, profile, loading, error: err, login, register, logout,
  }), [user, profile, loading, err]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
