/**
 * Database Structure Verification Script
 * 
 * This script verifies that the phone and address fields are properly
 * configured in the database with correct data types and constraints.
 */

import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the app
const supabaseUrl = 'https://ileiutoopvambzimbjyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseStructure() {
  console.log('🔍 Verifying Database Structure for Phone and Address Fields...\n');

  try {
    console.log('1️⃣ Checking profiles table structure...');
    
    // Get table columns information
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, character_maximum_length, column_default')
      .eq('table_name', 'profiles')
      .in('column_name', ['phone', 'address', 'full_name', 'email', 'role'])
      .order('column_name');

    if (columnError) {
      console.error('❌ Error fetching column information:', columnError.message);
      return;
    }

    if (columns && columns.length > 0) {
      console.log('✅ Profiles table columns found:');
      columns.forEach(col => {
        const maxLength = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  📋 ${col.column_name}: ${col.data_type}${maxLength} ${nullable}${defaultVal}`);
      });
    } else {
      console.log('⚠️ No columns found or table does not exist');
    }

    console.log('\n2️⃣ Checking table constraints...');
    
    // Get table constraints
    const { data: constraints, error: constraintError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name, constraint_type')
      .eq('table_name', 'profiles');

    if (constraintError) {
      console.error('❌ Error fetching constraints:', constraintError.message);
    } else if (constraints) {
      console.log('✅ Table constraints:');
      constraints.forEach(constraint => {
        console.log(`  🔒 ${constraint.constraint_name}: ${constraint.constraint_type}`);
      });
    }

    console.log('\n3️⃣ Checking user_role enum type...');
    
    // Check enum values for user_role
    const { data: enumValues, error: enumError } = await supabase
      .rpc('get_enum_values', { enum_name: 'user_role' })
      .catch(() => null); // Catch error if function doesn't exist

    if (enumValues) {
      console.log('✅ user_role enum values:', enumValues);
    } else {
      console.log('⚠️ Could not fetch enum values (this might be normal)');
    }

    console.log('\n4️⃣ Testing data insertion with phone and address...');
    
    // Test if we can insert sample data (we'll delete it immediately)
    const testEmail = `test-structure-${Date.now()}@example.com`;
    const testData = {
      full_name: 'Structure Test User',
      email: testEmail,
      phone: '+628123456789',
      address: 'Jl. Test Structure No. 123, Testing City',
      role: 'petani'
    };

    // First create auth user to get valid UUID
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpass123',
      options: {
        data: {
          full_name: testData.full_name,
          phone: testData.phone,
          address: testData.address,
          role: testData.role
        }
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError.message);
      return;
    }

    console.log('✅ Test auth user created');

    // Wait for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if profile was created by trigger
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️ Profile not created by trigger, testing manual insertion...');
      
      // Try manual insertion
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          ...testData
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Manual insertion failed:', insertError.message);
      } else {
        console.log('✅ Manual insertion successful');
        console.log('📱 Phone saved:', insertData.phone);
        console.log('🏠 Address saved:', insertData.address);
      }
    } else {
      console.log('✅ Profile created automatically by trigger');
      console.log('📱 Phone saved:', profileData.phone);
      console.log('🏠 Address saved:', profileData.address);
    }

    // Cleanup
    console.log('\n5️⃣ Cleaning up test data...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
    if (deleteError) {
      console.log('⚠️ Could not delete test user. Manual cleanup may be needed.');
    } else {
      console.log('✅ Test data cleaned up');
    }

    console.log('\n🎉 Database structure verification complete!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run the verification
verifyDatabaseStructure();