import { createClient } from '@supabase/supabase-js'

/**
 * Robust Supabase Client Configuration
 * Handles different environment variable prefixes and provides better error messages
 */

// Function to safely get environment variables in different contexts
const getEnvironmentVariable = (varName) => {
  // In Vite/browser environment
  if (typeof window !== 'undefined' && import.meta?.env) {
    return import.meta.env[varName]
  }
  
  // In Node.js environment  
  if (typeof process !== 'undefined' && process.env) {
    return process.env[varName]
  }
  
  return undefined
}

// Try multiple environment variable prefixes
const supabaseUrl = 
  getEnvironmentVariable('VITE_SUPABASE_URL') ||
  getEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL') ||
  getEnvironmentVariable('REACT_APP_SUPABASE_URL') ||
  getEnvironmentVariable('SUPABASE_URL') ||
  'https://ileiutoopvambzimbjyr.supabase.co' // Fallback to your actual URL

const supabaseAnonKey = 
  getEnvironmentVariable('VITE_SUPABASE_ANON_KEY') ||
  getEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnvironmentVariable('REACT_APP_SUPABASE_ANON_KEY') ||
  getEnvironmentVariable('SUPABASE_ANON_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q' // Fallback to your actual key

// Debug logging
console.log('🔧 Supabase Configuration Debug:')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key available:', supabaseAnonKey ? 'Yes' : 'No')
console.log('🌍 Environment context:', typeof window !== 'undefined' ? 'Browser' : 'Node.js')

// Validate configuration
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('❌ Supabase URL is missing or invalid')
  console.log('🔍 Checked variables: VITE_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL, REACT_APP_SUPABASE_URL, SUPABASE_URL')
  throw new Error('Supabase URL is required but not found in environment variables')
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.error('❌ Supabase Anon Key is missing or invalid')
  console.log('🔍 Checked variables: VITE_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, REACT_APP_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY')
  throw new Error('Supabase Anon Key is required but not found in environment variables')
}

// Create Supabase client with configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'sat-rspo-padi-app'
    }
  }
})

// Connection test helper
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Simple connectivity test
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
      .limit(1)
    
    if (error) {
      console.warn('⚠️ Connection test failed:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('❌ Connection test error:', err.message)
    return { success: false, error: err.message }
  }
}

// Auto-test connection in development
if (import.meta?.env?.DEV) {
  testSupabaseConnection().then(result => {
    if (!result.success) {
      console.warn('🚨 Supabase connection issue detected. This may affect app functionality.')
    }
  })
}

console.log('🚀 Supabase client initialized successfully')

export default supabase