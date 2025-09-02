// src/lib/api.ts
import { createClient, User as SupabaseAuthUser } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type AppRole = 'petani' | 'manajer';

export interface UserProfile {
  id: string;                // = auth user id
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: AppRole;
  created_at?: string;
  updated_at?: string;
}

/** Util: empty string -> null, trim whitespace */
const nn = (v?: string | null) => {
  const s = typeof v === 'string' ? v.trim() : v ?? null;
  return s === '' ? null : s;
};

/** Mapper DB -> App model */
const mapProfileRow = (row: any): UserProfile => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone ?? null,
  address: row.address ?? null,
  role: row.role,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/** Ambil profil; tidak error kalau 0 baris */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil profil: ${error.message}`);
  return data ? mapProfileRow(data) : null;
}

/** UPSERT deterministik: set field sesuai form, overwrite kalau sudah ada */
async function upsertProfileExact(
  authUser: SupabaseAuthUser,
  payload: { fullName: string; role: AppRole; phone?: string | null; address?: string | null }
) {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: authUser.id,
        full_name: payload.fullName,
        email: authUser.email,
        phone: nn(payload.phone),
        address: nn(payload.address),
        role: payload.role,
      },
      { onConflict: 'id' } // penting: overwrite by id
    );

  if (error) throw new Error(`Gagal menyimpan profil: ${error.message}`);
}

/**
 * Pastikan baris profiles ADA (tanpa override).
 * - Dipakai saat login/refresh untuk membuat profil minimal kalau belum ada,
 *   tetapi tidak menimpa nilai form yang sudah pernah disimpan via register().
 */
export async function ensureProfileFor(
  authUser: SupabaseAuthUser
): Promise<UserProfile> {
  let existing = await getUserProfile(authUser.id);
  if (existing) return existing;

  // Buat minimal jika benar-benar belum ada (jangan set default phone/address/role selain fallback)
  const minimalFullName =
    (authUser.user_metadata as any)?.full_name ||
    (authUser.email ? authUser.email.split('@')[0] : 'Pengguna');

  // gunakan default role 'petani' hanya ketika memang tidak ada data form sebelumnya
  const { error } = await supabase.from('profiles').insert({
    id: authUser.id,
    full_name: minimalFullName,
    email: authUser.email,
    role: 'petani', // minimal fallback
  });
  if (error) {
    const code = (error as any)?.code;
    const status = (error as any)?.status || (error as any)?.statusCode;
    if (!(code === '23505' || status === 409)) {
      throw new Error(`Gagal membuat profil: ${error.message}`);
    }
  }

  existing = await getUserProfile(authUser.id);
  if (!existing) throw new Error('Profil gagal dibuat.');
  return existing;
}

/** REGISTER: signUp → UPSERT profil dgn nilai form (meniadakan race & default) */
async function register(payload: {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: AppRole;
  password: string;
}): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        role: payload.role,
        phone: nn(payload.phone),
        address: nn(payload.address),
      },
    },
  });

  if (error) {
    if (error.message?.toLowerCase().includes('user already registered') || error.status === 422) {
      throw new Error('Email sudah terdaftar. Silakan login.');
    }
    throw new Error(`Gagal mendaftar: ${error.message}`);
  }

  const authUser = data.user;
  if (!authUser) {
    // seharusnya tidak terjadi jika email confirmation dimatikan
    throw new Error('Registrasi gagal mendapatkan sesi. Coba lagi beberapa saat.');
  }

  // Upsert profil persis sesuai form — ini kunci agar phone/address/role tidak null/ter-reset
  await upsertProfileExact(authUser, {
    fullName: payload.fullName,
    role: payload.role,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
  });

  const profile = await getUserProfile(authUser.id);
  if (!profile) throw new Error('Profil belum tersedia setelah registrasi.');
  return profile;
}

/** LOGIN: sign in → pastikan profil ada (tanpa override) */
async function login(credentials: { email: string; password: string }): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    const msg = error.message?.toLowerCase?.() || '';
    if (msg.includes('invalid login credentials')) {
      throw new Error('Email atau password salah.');
    }
    throw new Error(`Gagal login: ${error.message}`);
  }
  if (!data.user) throw new Error('Login gagal: user auth tidak ditemukan.');

  // Saat login, cukup pastikan profil ada (tanpa override)
  return await ensureProfileFor(data.user);
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Gagal logout: ${error.message}`);
}

export const api = {
  register,
  login,
  logout,
  getUserProfile,
};
