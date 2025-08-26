/**
 * Clean Supabase Configuration for SAT RSPO PADI
 * Minimal setup for authentication with TypeScript
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.VITE_SUPABASE_URL || 
                   'https://ileiutoopvambzimbjyr.supabase.co';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.VITE_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined'
  }
});

// Database types
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'petani' | 'manajer';
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export default supabase;