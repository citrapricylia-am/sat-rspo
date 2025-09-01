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
          // Profile doesn't exist - this happens when auth user exists but profile is missing
          console.log('⚠️ Profile not found for authenticated user, creating emergency profile...');
          console.log('📋 User metadata:', authUser.user_metadata);
          
          try {
            // Enhanced profile data with better fallbacks
            const profileData = {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.fullName || 
                        authUser.email?.split('@')[0] || 'User',
              email: authUser.email || '',
              phone: authUser.user_metadata?.phone || '',
              address: authUser.user_metadata?.address || '',
              role: (authUser.user_metadata?.role as 'petani' | 'manajer') || 'petani'
            };
            
            console.log('📝 Creating emergency profile with enhanced data:', profileData);
            
            // Try multiple creation strategies
            let createdProfile = null;
            
            // Strategy 1: Upsert (most robust)
            const { data: upsertProfile, error: upsertError } = await supabase
              .from('profiles')
              .upsert(profileData, {
                onConflict: 'id',
                ignoreDuplicates: false
              })
              .select()
              .single();
              
            if (upsertProfile && !upsertError) {
              createdProfile = upsertProfile;
              console.log('✅ Emergency profile created via upsert:', createdProfile);
            } else {
              console.error('❌ Upsert failed:', upsertError);
              
              // Strategy 2: Insert
              const { data: insertProfile, error: insertError } = await supabase
                .from('profiles')
                .insert(profileData)
                .select()
                .single();
                
              if (insertProfile && !insertError) {
                createdProfile = insertProfile;
                console.log('✅ Emergency profile created via insert:', createdProfile);
              } else {
                console.error('❌ Insert also failed:', insertError);
                
                // Strategy 3: Check if profile was created by another process
                const { data: existingProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', authUser.id)
                  .single();
                  
                if (existingProfile) {
                  createdProfile = existingProfile;
                  console.log('✅ Found profile created by another process:', createdProfile);
                }
              }
            }
            
            if (createdProfile) {
              // Set the user with the successfully created/found profile
              setUser({
                id: createdProfile.id,
                fullName: createdProfile.full_name,
                email: authUser.email as string,
                phone: createdProfile.phone,
                address: createdProfile.address,
                role: createdProfile.role,
              });
              
              // Clear registration data
              setRegistrationData(null);
              console.log('🎉 Emergency profile creation successful!');
            } else {
              // All strategies failed - handle gracefully
              console.error('💥 All emergency profile creation strategies failed');
              
              // Clear registration data to stop infinite loops
              setRegistrationData(null);
              
              // Sign out the user since they have no profile
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
      console.log('🔑 Attempting login for:', email);
      
      // Clean email input
      const cleanEmail = email.trim().toLowerCase();
      
      const result = await api.login({ email: cleanEmail, password });
      console.log('✅ Login successful, waiting for auth state change...');
      
      // Wait a moment for the auth state change to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (e) {
      console.error('❌ Login failed:', e);
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
      
      // Create user profile manually (since trigger might be disabled)
      console.log('🔄 Creating user profile manually...');
      
      const profileData = {
        id: data.user.id,
        full_name: userData.fullName,
        email: cleanEmail,
        phone: userData.phone,
        address: userData.address,
        role: userData.role
      };
      
      // Try multiple times with different approaches
      let profileResult = null;
      let insertError = null;
      
      // Attempt 1: Try insert
      console.log('🔄 Attempt 1: Inserting profile...');
      const insertResult = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
        
      if (insertResult.error) {
        insertError = insertResult.error;
        console.error('❌ Insert failed:', insertError);
        
        // Attempt 2: Try upsert if insert failed
        console.log('🔄 Attempt 2: Trying upsert...');
        const upsertResult = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();
          
        if (upsertResult.error) {
          console.error('❌ Upsert also failed:', upsertResult.error);
          
          // Attempt 3: Try to fetch existing profile
          console.log('🔄 Attempt 3: Checking for existing profile...');
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (existingProfile) {
            console.log('✅ Found existing profile after failed creation attempts');
            profileResult = existingProfile;
          } else {
            // All attempts failed
            console.error('🧹 All profile creation attempts failed, cleaning up auth user');
            setRegistrationData(null);
            
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('❌ Failed to sign out user:', signOutError);
            }
            
            throw new Error(`Gagal membuat profil pengguna. Error: ${insertError?.message || 'Unknown error'}`);
          }
        } else {
          profileResult = upsertResult.data;
          console.log('✅ Upsert successful');
        }
      } else {
        profileResult = insertResult.data;
        console.log('✅ Insert successful');
      }
      
      console.log('✅ Profile created successfully:', profileResult);
      console.log('📋 Profile data - phone:', profileResult.phone, 'address:', profileResult.address);
      
      setRegistrationData(null);
      
      // Wait for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
