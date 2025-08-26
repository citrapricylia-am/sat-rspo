/**
 * Simple test script for clean Supabase implementation
 * Run: node test-clean-api.js
 */

import { createClient } from 'npm:@supabase/supabase-js';

// Direct Supabase configuration for testing
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ileiutoopvambzimbjyr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function testConnection() {
  console.log('🧪 Testing Clean Supabase Configuration...\n');
  
  try {
    // Test connection to profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Profiles table accessible');
    return true;
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 SAT RSPO PADI - Clean API Test\n');
  
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    console.log('\n🎯 Ready for testing:');
    console.log('    • POST /api/auth/register');
    console.log('    • POST /api/auth/login');
    console.log('\n📖 API Response format:');
    console.log('    { success: boolean, data?: any, error?: string }');
    console.log('\n🔐 Supported roles: "petani", "manajer"');
    console.log('\n📋 Database schema: profiles table with RLS enabled');
  } else {
    console.log('\n❌ Please fix database connection before testing APIs');
    console.log('\n🔧 Steps to fix:');
    console.log('    1. Deploy database/sat-rspo-schema.sql to Supabase');
    console.log('    2. Check environment variables in .env.local');
    console.log('    3. Verify Supabase project URL and keys');
  }
}

// Check if the script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}