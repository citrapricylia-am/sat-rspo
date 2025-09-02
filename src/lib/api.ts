// src/lib/api.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ApiUser {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'petani' | 'manajer';
  password?: string;
}

export const api = {
  // LOGIN
  async login({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login berhasil tapi data user tidak ditemukan');
    return this.getUserProfile(data.user.id);
  },

  // REGISTER
  async register(userData: ApiUser & { password: string }) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: { data: { ...userData } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registrasi berhasil tapi user data tidak ditemukan');
    // Buat profile
    await this.createUserProfile(data.user.id, userData);
    return this.getUserProfile(data.user.id);
  },

  // CREATE USER PROFILE
  async createUserProfile(userId: string, userData: ApiUser) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...userData }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // GET USER PROFILE
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // SAVE ASSESSMENT
  async saveAssessmentResult(result: any) {
    const { data, error } = await supabase.from('assessments').upsert([result], {
      onConflict: 'user_id,stage',
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async getAssessmentResult(userId: string, stage: number) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', stage)
      .single();
    if (error) return null;
    return data;
  },
};
