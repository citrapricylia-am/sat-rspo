import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase connection with fallbacks
// In browser: import.meta.env (Vite), in Node: process.env
const getEnvVar = (name) => {
  // For Vite/browser environment
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[name]
  }
  // For Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name]
  }
  return undefined
}

const supabaseUrl = 
  getEnvVar('VITE_SUPABASE_URL') || 
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnvVar('SUPABASE_URL') || 
  getEnvVar('REACT_APP_SUPABASE_URL')

const supabaseAnonKey = 
  getEnvVar('VITE_SUPABASE_ANON_KEY') || 
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnvVar('SUPABASE_ANON_KEY') || 
  getEnvVar('REACT_APP_SUPABASE_ANON_KEY')

// Validate that environment variables are present
if (!supabaseUrl) {
  console.error('❌ Missing Supabase URL. Please check your environment variables.')
  console.log('🔍 Environment variables check:')
  console.log('- VITE_SUPABASE_URL:', getEnvVar('VITE_SUPABASE_URL'))
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', getEnvVar('NEXT_PUBLIC_SUPABASE_URL'))
  console.log('- SUPABASE_URL:', getEnvVar('SUPABASE_URL'))
  console.log('- REACT_APP_SUPABASE_URL:', getEnvVar('REACT_APP_SUPABASE_URL'))
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    console.log('🌍 Available Vite env vars:', Object.keys(import.meta.env))
  }
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('❌ Missing Supabase Anon Key. Please check your environment variables.')
  console.log('🔍 Environment variables check:')
  console.log('- VITE_SUPABASE_ANON_KEY:', getEnvVar('VITE_SUPABASE_ANON_KEY') ? 'Found' : 'Missing')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') ? 'Found' : 'Missing')
  console.log('- SUPABASE_ANON_KEY:', getEnvVar('SUPABASE_ANON_KEY') ? 'Found' : 'Missing')
  console.log('- REACT_APP_SUPABASE_ANON_KEY:', getEnvVar('REACT_APP_SUPABASE_ANON_KEY') ? 'Found' : 'Missing')
  throw new Error('Missing SUPABASE_ANON_KEY environment variable')
}

// Create and configure Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable auto refresh for better session management
    autoRefreshToken: true,
    // Persist session in localStorage for web applications
    persistSession: true,
    // Handle session detection automatically
    detectSessionInUrl: true
  },
  // Configure for production deployment
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to check connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message)
    return false
  }
}

// Log connection status on import
console.log('🔗 Supabase client initialized')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Using anon key:', supabaseAnonKey.substring(0, 20) + '...')

export default supabase