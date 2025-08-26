// src/api.ts
import { supabase } from './supabase'

export interface ApiUser {
  id: number; // legacy, kita isi 0 supaya minim perubahan
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'petani' | 'manajer';
}

async function currentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Tidak ada session user')
  return data.user
}

export const api = {
  // REGISTER: daftar + buat profile
  register: async (payload: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'petani' | 'manajer';
    password: string;
  }): Promise<ApiUser> => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
          phone: payload.phone ?? null,
          address: payload.address ?? null,
          role: payload.role,
        },
      },
    })
    if (error) throw new Error(error.message)
    const user = data.user
    if (!user) throw new Error('Sign up gagal')

    // insert profile (abaikan jika sudah ada)
    const { error: pErr } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: payload.fullName,
      email: payload.email,
      role: payload.role,
    })
    if (pErr && pErr.code !== '23505') throw new Error(pErr.message)

    return {
      id: 0,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      role: payload.role,
    }
  },

  // LOGIN: dapatkan session + profile
  login: async (payload: { email: string; password: string }): Promise<ApiUser> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    if (error) throw new Error(error.message)
    const user = data.user
    if (!user) throw new Error('Login gagal')

    // ambil profile
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('full_name, email, role')
      .eq('id', user.id)
      .single()

    if (profErr) throw new Error(profErr.message)

    return {
      id: 0,
      fullName: profile.full_name,
      email: profile.email,
      phone: undefined,
      address: undefined,
      role: profile.role,
    }
  },

  // SIMPAN ASSESSMENT
  saveAssessment: async (payload: {
    userId: number; // legacy, TIDAK dipakai. Kita pakai auth.uid()
    stage: 1 | 2 | 3;
    answers: unknown;
    totalScore: number;
    maxScore: number;
    percentage: number;
  }): Promise<{ ok: true; id: string }> => {
    // map stage lama -> enum baru
    const stageMap = { 1: 'stage1', 2: 'stage2', 3: 'stage3' } as const
    const user = await currentUser()

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        stage: stageMap[payload.stage],
        answers_json: payload.answers as any,
        total_score: payload.totalScore,
        max_score: payload.maxScore,
        percentage: payload.percentage,
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    return { ok: true, id: data.id }
  },
}
