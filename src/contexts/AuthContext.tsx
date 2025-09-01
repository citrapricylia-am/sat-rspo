import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, supabase } from '@/lib/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'petani' | 'manajer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  saveAssessmentResult: (result: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registrationData, setRegistrationData] = useState<Omit<User, 'id'> & { password: string } | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (session) {
        const { user: authUser } = session;

        // Prevent multiple simultaneous profile fetches for the same user
        if (user?.id === authUser.id) {
          console.log('📦 User already set, skipping profile fetch');
          return;
        }

        // Check if user profile exists in the profiles table
        console.log('🔍 Fetching profile for user:', authUser.id);
        let { data: userData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error("❌ Error fetching user data:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          
          // If it's not a "not found" error, this is a serious issue
          if (error.code !== 'PGRST116') {
            console.error('😨 This might be an RLS policy issue or server error');
            // Don't return here - still try to create emergency profile
          }
        }

        if (userData) {
          // User profile exists, set user state
          console.log('✅ User profile found:', userData);
          setUser({
            id: userData.id,
            fullName: userData.full_name,
            email: authUser.email as string,
            phone: userData.phone,
            address: userData.address,
            role: userData.role,
          });
          setRegistrationData(null);
        } else if (!userData || error?.code === 'PGRST116') {
          // EMERGENCY: Profile doesn't exist - create it immediately
          console.log('🚨 EMERGENCY: Profile missing for authenticated user!');
          console.log('📋 User metadata available:', authUser.user_metadata);
          
          try {
            // Enhanced profile data with comprehensive fallbacks
            const emergencyProfileData = {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.fullName || 
                        authUser.email?.split('@')[0] || 
                        'User ' + authUser.id.substring(0, 8),
              email: authUser.email || '',
              phone: authUser.user_metadata?.phone || '',
              address: authUser.user_metadata?.address || '',
              role: (authUser.user_metadata?.role as 'petani' | 'manajer') || 'petani'
            };
            
            console.log('🔄 Creating emergency profile with data:', emergencyProfileData);
            
            // ROBUST EMERGENCY PROFILE CREATION
            let emergencyProfile = null;
            
            // Emergency Strategy 1: UPSERT (most reliable)
            const { data: upsertProfile, error: upsertError } = await supabase
              .from('profiles')
              .upsert(emergencyProfileData, {
                onConflict: 'id',
                ignoreDuplicates: false
              })
              .select()
              .single();
              
            if (upsertProfile && !upsertError) {
              emergencyProfile = upsertProfile;
              console.log('✅ EMERGENCY SUCCESS: Profile created via upsert');
            } else {
              console.log('⚠️ Emergency upsert failed, trying insert...');
              
              // Emergency Strategy 2: INSERT
              const { data: insertProfile, error: insertError } = await supabase
                .from('profiles')
                .insert(emergencyProfileData)
                .select()
                .single();
                
              if (insertProfile && !insertError) {
                emergencyProfile = insertProfile;
                console.log('✅ EMERGENCY SUCCESS: Profile created via insert');
              } else {
                console.log('⚠️ Emergency insert failed, checking existing...');
                
                // Emergency Strategy 3: Check existing (race condition protection)
                const { data: existingProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', authUser.id)
                  .single();
                  
                if (existingProfile) {
                  emergencyProfile = existingProfile;
                  console.log('✅ EMERGENCY SUCCESS: Found existing profile');
                } else {
                  console.error('🚨 EMERGENCY FAILED: Cannot create profile for authenticated user');
                }
              }
            }
            
            if (emergencyProfile) {
              // Successfully created/found emergency profile
              setUser({
                id: emergencyProfile.id,
                fullName: emergencyProfile.full_name,
                email: authUser.email as string,
                phone: emergencyProfile.phone,
                address: emergencyProfile.address,
                role: emergencyProfile.role,
              });
              
              setRegistrationData(null);
              console.log('🎉 EMERGENCY PROFILE RECOVERY SUCCESSFUL!');
            } else {
              // Emergency failed completely - sign out user
              console.error('🚨 CRITICAL: Emergency profile creation failed completely');
              console.error('Signing out user to prevent auth limbo state');
              
              setRegistrationData(null);
              await supabase.auth.signOut();
              return;
            }
          } catch (emergencyError) {
            console.error('❌ Emergency profile creation failed completely:', emergencyError);
            
            // Clear registration data to prevent infinite loops
            setRegistrationData(null);
            
            // Sign out the user
            await supabase.auth.signOut();
          }
        }
      } else {
        console.log('🚺 User signed out');
        setUser(null);
        setRegistrationData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Remove registrationData dependency to prevent loops

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 LOGIN ATTEMPT STARTED for:', email);
      console.log('📋 Current user state:', user ? 'LOGGED IN' : 'NOT LOGGED IN');
      
      // Clean email input
      const cleanEmail = email.trim().toLowerCase();
      console.log('🧹 Cleaned email:', cleanEmail);
      
      // Call the API login function
      console.log('🚀 Calling Supabase auth.signInWithPassword...');
      const result = await api.login({ email: cleanEmail, password });
      console.log('✅ Supabase login successful, user data:', {
        id: result.id,
        email: result.email
      });
      
      console.log('⏳ Waiting for auth state change to complete...');
      
      // Wait for auth state change to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🎉 LOGIN PROCESS COMPLETED SUCCESSFULLY!');
      return true;
    } catch (e) {
      console.error('❌ LOGIN FAILED with error:', e);
      console.error('📊 Error details:', {
        name: e.name,
        message: e.message,
        stack: e.stack
      });
      throw e; // Re-throw to show error message to user
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      console.log('🔄 Starting registration process with data:', {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: userData.role
      });
      
      // Validate required fields before proceeding
      if (!userData.fullName?.trim()) {
        throw new Error('Nama lengkap harus diisi');
      }
      if (!userData.phone?.trim()) {
        throw new Error('Nomor telepon harus diisi');
      }
      if (!userData.address?.trim()) {
        throw new Error('Alamat harus diisi');
      }
      
      // Clean the email
      const cleanEmail = userData.email.trim().toLowerCase();
      
      // Store registration data before signup
      setRegistrationData(userData);
      
      // Add a small delay to ensure database is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            fullName: userData.fullName, // Include both for compatibility
            phone: userData.phone,
            address: userData.address,
            role: userData.role
          }
        }
      });

      if (error) {
        console.error('❌ Registration error:', error.message);
        setRegistrationData(null);
        
        // Provide more specific error messages
        if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          // For duplicate emails, suggest login instead
          throw new Error('Email sudah terdaftar. Silakan gunakan halaman login untuk masuk dengan email ini.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Format email tidak valid. Silakan periksa kembali.');
        } else if (error.message.includes('Password')) {
          throw new Error('Password harus minimal 6 karakter.');
        } else if (error.message.includes('Signup is disabled')) {
          throw new Error('Pendaftaran sedang dinonaktifkan. Silakan coba lagi nanti.');
        } else if (error.message.includes('Database error') || error.message.includes('500')) {
          throw new Error('Terjadi masalah dengan database. Silakan coba lagi dalam beberapa saat.');
        } else {
          throw new Error(`Registrasi gagal: ${error.message}`);
        }
      }
      
      if (!data.user) {
        setRegistrationData(null);
        throw new Error('Registrasi gagal: User data tidak ditemukan');
      }
      
      console.log('✅ Auth signup successful:', data.user.id);
      console.log('📋 Auth user metadata:', data.user.user_metadata);
      
      // IMPORTANT: Create user profile manually (trigger is disabled for reliability)
      console.log('🔄 Creating user profile automatically...');
      
      const profileData = {
        id: data.user.id,
        full_name: userData.fullName,
        email: cleanEmail,
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role
      };
      
      console.log('📝 Profile data to insert:', profileData);
      
      // GUARANTEED PROFILE CREATION - Multiple strategies to ensure success
      let profileResult = null;
      let lastError = null;
      
      // Strategy 1: Direct INSERT (most common scenario)
      console.log('🔄 Strategy 1: Direct profile insertion...');
      const insertResult = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
        
      if (insertResult.data && !insertResult.error) {
        profileResult = insertResult.data;
        console.log('✅ Strategy 1 SUCCESS: Profile inserted directly');
      } else {
        lastError = insertResult.error;
        console.log('⚠️ Strategy 1 failed, trying Strategy 2...');
        
        // Strategy 2: UPSERT (handles conflicts)
        console.log('🔄 Strategy 2: Profile upsert...');
        const upsertResult = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();
          
        if (upsertResult.data && !upsertResult.error) {
          profileResult = upsertResult.data;
          console.log('✅ Strategy 2 SUCCESS: Profile upserted');
        } else {
          lastError = upsertResult.error;
          console.log('⚠️ Strategy 2 failed, trying Strategy 3...');
          
          // Strategy 3: Check if profile was created by another process
          console.log('🔄 Strategy 3: Checking for existing profile...');
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (existingProfile && !fetchError) {
            profileResult = existingProfile;
            console.log('✅ Strategy 3 SUCCESS: Found existing profile');
          } else {
            // All strategies failed - this should be extremely rare
            console.error('🚨 ALL STRATEGIES FAILED - Critical error');
            console.error('Last error:', lastError);
            console.error('Fetch error:', fetchError);
            
            // Clean up the auth user since we can't create a profile
            setRegistrationData(null);
            
            try {
              await supabase.auth.signOut();
              console.log('🧹 Auth user cleaned up due to profile creation failure');
            } catch (signOutError) {
              console.error('❌ Failed to sign out user:', signOutError);
            }
            
            throw new Error(`Gagal membuat profil pengguna. Database mungkin bermasalah. Error: ${lastError?.message || 'Unknown error'}`);
          }
        }
      }
      
      // SUCCESS - Profile created automatically!
      console.log('✅ AUTOMATIC PROFILE CREATION SUCCESSFUL!');
      console.log('📋 Final profile data:', {
        id: profileResult.id,
        fullName: profileResult.full_name,
        email: profileResult.email,
        phone: profileResult.phone,
        address: profileResult.address,
        role: profileResult.role
      });
      
      // Clear registration state
      setRegistrationData(null);
      
      // Brief pause to let database operations complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('🎉 Registration completed successfully! User should be redirected.');
      return true;
    } catch (e) {
      console.error('❌ Registration failed:', e);
      setRegistrationData(null);
      throw e; // Re-throw to show error message to user
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const saveAssessmentResult = async (result: any) => {
    try {
      if (!user) {
        console.error('❌ Cannot save assessment: User not authenticated');
        throw new Error("Pengguna tidak terotentikasi. Silakan login terlebih dahulu.");
      }
      
      console.log('🔄 Saving assessment result for user:', user.id, result);
      await api.saveAssessmentResult({ ...result, userId: user.id });
      console.log('✅ Assessment result saved successfully');
    } catch (e) {
      console.error("❌ Failed to save assessment result:", e);
      throw e; // Re-throw so the caller can handle it
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    saveAssessmentResult,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
