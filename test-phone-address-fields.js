/**
 * Test Script for Phone and Address Field Handling
 * 
 * This script tests the complete data flow from form input to database storage
 * for phone and address fields during user registration.
 */

import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the app
const supabaseUrl = 'https://ileiutoopvambzimbjyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data with phone and address
const testUserData = {
  fullName: 'Test User Phone Address',
  email: `test-phone-${Date.now()}@example.com`,
  phone: '+628123456789',
  address: 'Jl. Test No. 123, Desa Testing, Kec. QA, Kab. Automation',
  role: 'petani',
  password: 'testpassword123'
};

console.log('🧪 Starting Phone and Address Field Test');
console.log('📋 Test Data:', {
  fullName: testUserData.fullName,
  email: testUserData.email,
  phone: testUserData.phone,
  address: testUserData.address,
  role: testUserData.role
});

async function testPhoneAddressFields() {
  try {
    console.log('\n1️⃣ Testing Supabase Auth Registration with Metadata...');
    
    // Test 1: Register user with phone and address in metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUserData.email,
      password: testUserData.password,
      options: {
        data: {
          full_name: testUserData.fullName,
          phone: testUserData.phone,
          address: testUserData.address,
          role: testUserData.role
        }
      }
    });

    if (authError) {
      console.error('❌ Auth registration failed:', authError.message);
      return;
    }

    console.log('✅ Auth registration successful');
    console.log('👤 User ID:', authData.user?.id);
    console.log('📧 Email confirmed:', authData.user?.email_confirmed_at ? 'Yes' : 'No');
    
    // Get the raw user metadata
    console.log('📊 Raw user metadata:', authData.user?.user_metadata);

    // Wait a moment for any triggers to execute
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n2️⃣ Testing Profile Creation...');
    
    // Test 2: Check if profile was created automatically (by trigger)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('⚠️ Profile not found automatically, creating manually...');
      
      // Test 3: Manual profile creation
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: testUserData.fullName,
          email: testUserData.email,
          phone: testUserData.phone,
          address: testUserData.address,
          role: testUserData.role
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Manual profile creation failed:', insertError.message);
        return;
      }

      console.log('✅ Manual profile creation successful');
      console.log('📋 Profile Data:', newProfile);
      
      // Verify phone and address fields
      if (newProfile.phone === testUserData.phone) {
        console.log('✅ Phone field correctly saved:', newProfile.phone);
      } else {
        console.error('❌ Phone field mismatch. Expected:', testUserData.phone, 'Got:', newProfile.phone);
      }

      if (newProfile.address === testUserData.address) {
        console.log('✅ Address field correctly saved:', newProfile.address);
      } else {
        console.error('❌ Address field mismatch. Expected:', testUserData.address, 'Got:', newProfile.address);
      }
      
    } else if (profileData) {
      console.log('✅ Profile found automatically created');
      console.log('📋 Profile Data:', profileData);
      
      // Verify phone and address fields
      if (profileData.phone === testUserData.phone) {
        console.log('✅ Phone field correctly saved:', profileData.phone);
      } else {
        console.error('❌ Phone field mismatch. Expected:', testUserData.phone, 'Got:', profileData.phone);
      }

      if (profileData.address === testUserData.address) {
        console.log('✅ Address field correctly saved:', profileData.address);
      } else {
        console.error('❌ Address field mismatch. Expected:', testUserData.address, 'Got:', profileData.address);
      }
    }

    console.log('\n3️⃣ Testing Database Field Constraints...');
    
    // Test 4: Check database field types and constraints
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('sql', { 
        query: `
          SELECT column_name, data_type, is_nullable, character_maximum_length 
          FROM information_schema.columns 
          WHERE table_name = 'profiles' 
          AND column_name IN ('phone', 'address')
          ORDER BY column_name;
        ` 
      });

    if (!tableError && tableInfo) {
      console.log('📊 Database field information:');
      tableInfo.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}, nullable: ${col.is_nullable}`);
      });
    }

    console.log('\n4️⃣ Testing Data Update...');
    
    // Test 5: Update phone and address fields
    const updatedPhone = '+628987654321';
    const updatedAddress = 'Jl. Updated No. 456, Desa Modified, Kec. Changed';
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        phone: updatedPhone,
        address: updatedAddress
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Profile update failed:', updateError.message);
    } else {
      console.log('✅ Profile update successful');
      console.log('📱 Updated phone:', updatedProfile.phone);
      console.log('🏠 Updated address:', updatedProfile.address);
    }

    console.log('\n5️⃣ Cleanup - Removing test user...');
    
    // Cleanup: Remove test user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
    if (deleteError) {
      console.log('⚠️ Could not delete test user automatically. Please clean up manually.');
      console.log('👤 User ID to delete:', authData.user.id);
    } else {
      console.log('✅ Test user cleaned up successfully');
    }

    console.log('\n🎉 Phone and Address Field Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testPhoneAddressFields();