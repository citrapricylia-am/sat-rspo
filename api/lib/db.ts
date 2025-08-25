import { createClient } from '@supabase/supabase-js'
import type { Database, UserProfile, Assessment, LoginHistory } from '../types/database'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY.')
}

// Create Supabase client for public operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Create admin client for server-side operations (if service key is available)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database operations
export const dbOperations = {
  // User Profile Operations
  async createUserProfile(userId: string, profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      throw error
    }
    return data
  },

  async updateUserProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  // Assessment Operations
  async createAssessment(assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAssessment(id: string): Promise<Assessment | null> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  async getUserAssessments(userId: string, limit?: number, offset?: number) {
    let query = supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 10) - 1)
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  async updateAssessment(id: string, updates: Partial<Omit<Assessment, 'id' | 'user_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('assessments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteAssessment(id: string) {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async getAssessmentsByStage(userId: string, stage: Database['public']['Enums']['assessment_stage']) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', stage)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Login History Operations
  async createLoginHistory(loginData: Omit<LoginHistory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('login_history')
      .insert(loginData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserLoginHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', userId)
      .order('login_timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  // Statistics and Analytics
  async getUserAssessmentStats(userId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('stage, total_score, max_score, percentage, completed_at')
      .eq('user_id', userId)
    
    if (error) throw error
    
    const stats = {
      total_assessments: data?.length || 0,
      completed_assessments: data?.filter(a => a.completed_at).length || 0,
      average_percentage: 0,
      stages_completed: [] as string[],
      latest_assessment: null as Assessment | null
    }
    
    if (data && data.length > 0) {
      const completed = data.filter(a => a.completed_at)
      if (completed.length > 0) {
        stats.average_percentage = completed.reduce((sum, a) => sum + a.percentage, 0) / completed.length
      }
      stats.stages_completed = [...new Set(data.map(a => a.stage))]
    }
    
    return stats
  }
}

// Helper functions for authentication
export const authHelpers = {
  async getUser(accessToken: string) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error) throw error
    return user
  },

  async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    if (error) throw error
    return data
  },

  async signOut(accessToken: string) {
    // Set the session first
    await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}