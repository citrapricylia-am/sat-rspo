import { createClient } from '@supabase/supabase-js';

// Ganti placeholder ini dengan URL dan Kunci Supabase Anda yang asli
// PENTING: Untuk produksi, gunakan variabel lingkungan!
const supabaseUrl = 'https://ileiutoopvambzimbjyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ApiUser {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'petani' | 'manajer';
  password?: string;
}

export interface AssessmentResult {
  userId: string;
  stage: number;
  answers: any;
  totalScore: number;
  maxScore: number;
  percentage: number;
}

export const api = {
  /**
   * Fungsi untuk login pengguna.
   */
  async login({ email, password }: Pick<ApiUser, 'email' | 'password'>) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw new Error(authError.message);
    return authData.user;
  },
  
  /**
   * Fungsi register hanya melakukan sign-up.
   * Logika pembuatan profil ditangani oleh AuthContext.
   */
  async register(userData: ApiUser) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
          address: userData.address,
          role: userData.role
        }
      }
    });
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Fungsi untuk menyimpan hasil tes assessment.
   */
  async saveAssessmentResult(result: AssessmentResult) {
    console.log('🔄 Saving assessment result:', result);
    
    // Map stage number to enum value expected by database
    const stageMapping = {
      1: 'stage1',
      2: 'stage2', 
      3: 'stage3'
    } as const;
    
    const stageValue = stageMapping[result.stage as keyof typeof stageMapping];
    
    // Simpan hasil ke tabel 'assessments' sesuai dengan schema database
    const { data, error } = await supabase
      .from('assessments')
      .upsert([
        {
          user_id: result.userId,
          stage: stageValue,
          answers_json: result.answers,
          total_score: result.totalScore,
          max_score: result.maxScore,
          completed_at: new Date().toISOString(),
        },
      ], {
        onConflict: 'user_id,stage' // Handle duplicates by updating existing record
      });

    if (error) {
      console.error('❌ Error saving assessment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ Assessment result saved successfully:', data);
    return data;
  },
  
  /**
   * Alias for backward compatibility
   */
  async saveAssessment(result: AssessmentResult) {
    return this.saveAssessmentResult(result);
  }
};
