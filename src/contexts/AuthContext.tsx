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
            // First, try to create the profile
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
            
            console.log('📝 Creating profile with data:', profileData);
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .upsert(profileData, {
                onConflict: 'id',
                ignoreDuplicates: false
              })
              .select()
              .single();
              
            if (createError) {
              console.error('❌ Failed to create emergency profile:', createError);
              
              // Try one more time to fetch existing profile
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();
                
              if (existingProfile) {
                console.log('✅ Found existing profile after retry');
                setUser({
                  id: existingProfile.id,
                  fullName: existingProfile.full_name,
                  email: authUser.email as string,
                  phone: existingProfile.phone,
                  address: existingProfile.address,
                  role: existingProfile.role,
                });
                setRegistrationData(null);
                return;
              }
              
              // If we still can't create/find profile, handle gracefully
              console.error('💥 Cannot create or find profile');
              
              // Clear registration data to stop infinite loops
              setRegistrationData(null);
              
              // Sign out the user since they have no profile
              await supabase.auth.signOut();
              return;
            }
            
            console.log('✅ Emergency profile created successfully:', createdProfile);
            
            // Set the user with the newly created profile
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
      
      const { data: profileResult, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
        
      if (insertError) {
        console.error('❌ Manual profile creation failed:', insertError);
        
        // If it's a duplicate error, try to fetch existing profile
        if (insertError.code === '23505') {
          console.log('🔍 Profile might already exist, trying to fetch...');
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (existingProfile) {
            console.log('✅ Found existing profile, registration complete');
            setRegistrationData(null);
            
            // Wait for auth state to settle
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
          }
        }
        
        // If profile creation fails completely, clean up the auth user
        console.error('🧹 Cleaning up auth user due to profile creation failure');
        setRegistrationData(null);
        
        // Try to sign out the user
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('❌ Failed to sign out user:', signOutError);
        }
        
        throw new Error(`Gagal membuat profil pengguna: ${insertError.message}`);
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
