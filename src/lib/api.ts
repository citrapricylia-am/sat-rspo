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
    console.log('🔑 Attempting login for:', email);
    
    try {
      // Clean email input
      const cleanEmail = email.trim().toLowerCase();
      
      // Attempt login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });
      
      if (authError) {
        console.error('❌ Login failed:', {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
              
        console.log('🔍 Login error details for debugging:', authError);
        
        // Provide more specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email atau password salah. Silakan periksa kembali.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Email belum dikonfirmasi. Silakan cek email Anda.');
        } else if (authError.message.includes('Too many requests')) {
          throw new Error('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
        } else if (authError.message.includes('User not found')) {
          throw new Error('Email tidak terdaftar. Silakan daftar terlebih dahulu.');
        } else if (authError.status === 400) {
          throw new Error('Permintaan login tidak valid. Silakan periksa email dan password.');
        } else {
          throw new Error(`Login gagal: ${authError.message}`);
        }
      }
      
      if (!authData.user) {
        throw new Error('Login berhasil tetapi data user tidak ditemukan');
      }
      
      console.log('✅ Login successful for user:', authData.user.id);
      return authData.user;
    } catch (error) {
      // Re-throw the error to be handled by the calling code
      console.error('💬 Login process error:', error);
      throw error;
    }
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
  },

  /**
   * Fungsi untuk mengambil hasil assessment berdasarkan user ID dan stage.
   */
  async getAssessmentResult(userId: string, stage: 1 | 2 | 3) {
    console.log('🔍 Fetching assessment result for:', { userId, stage });
    
    // Map stage number to enum value expected by database
    const stageMapping = {
      1: 'stage1',
      2: 'stage2', 
      3: 'stage3'
    } as const;
    
    const stageValue = stageMapping[stage];
    
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', stageValue)
      .single();

    if (error) {
      // If no record found, return null instead of throwing error
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No assessment result found for stage:', stage);
        return null;
      }
      console.error('❌ Error fetching assessment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ Assessment result fetched successfully:', data);
    return data;
  },

  /**
   * Fungsi untuk mengambil semua hasil assessment user.
   */
  async getAllAssessmentResults(userId: string) {
    console.log('🔍 Fetching all assessment results for user:', userId);
    
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('stage');

    if (error) {
      console.error('❌ Error fetching assessments:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ All assessment results fetched successfully:', data);
    return data;
  },

  /**
   * Fungsi untuk mengambil statistik assessment user menggunakan database function.
   */
  async getUserAssessmentStats(userId: string) {
    console.log('🔍 Fetching assessment statistics for user:', userId);
    
    const { data, error } = await supabase
      .rpc('get_user_assessment_stats', { target_user_id: userId });

    if (error) {
      console.error('❌ Error fetching assessment stats:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ Assessment statistics fetched successfully:', data);
    return data?.[0] || null;
  }
};
