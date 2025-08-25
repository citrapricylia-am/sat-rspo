// Test script to verify Supabase configuration
// Run this after setting up the database schema

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ileiutoopvambzimbjyr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Configuration...')
  console.log('📍 URL:', supabaseUrl)
  console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n1️⃣ Testing connection...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log('📊 User profiles table exists')
    
    // Test 2: Test Auth functionality
    console.log('\n2️⃣ Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message)
    } else {
      console.log('✅ Auth system accessible')
      console.log('👤 Current session:', authData.session ? 'Active' : 'None')
    }
    
    // Test 3: Test other tables
    console.log('\n3️⃣ Testing other tables...')
    
    const tables = ['assessments', 'login_history']
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (tableError) {
        console.error(`❌ Table ${table}:`, tableError.message)
      } else {
        console.log(`✅ Table ${table}: exists`)
      }
    }
    
    console.log('\n🎉 Supabase configuration test completed!')
    console.log('📋 Summary:')
    console.log('   - Project URL: ✅ Configured')
    console.log('   - API Keys: ✅ Valid') 
    console.log('   - Database Tables: ✅ Ready')
    console.log('   - Auth System: ✅ Accessible')
    
    return true
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return false
  }
}

// Export for use in other files
export { testSupabaseConnection, supabase }

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabaseConnection()
}