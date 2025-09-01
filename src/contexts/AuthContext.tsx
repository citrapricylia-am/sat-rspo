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
              .insert(profileData)
              .select()
              .single();
              
            if (createError) {
              console.error('❌ Failed to create emergency profile:', createError);
              
              // If it's a duplicate key error, try to fetch existing profile
              if (createError.code === '23505') {
                console.log('🔍 Profile might exist, trying to fetch again...');
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
                  return;
                }
              }
              
              // If we still can't create/find profile, sign out
              console.error('💥 Cannot create or find profile, signing out user');
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
          } catch (emergencyError) {
            console.error('❌ Emergency profile creation failed completely:', emergencyError);
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
  }, [registrationData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 Attempting login for:', email);
      await api.login({ email, password });
      console.log('✅ Login successful, waiting for auth state change...');
      return true;
    } catch (e) {
      console.error('❌ Login failed:', e);
      return false;
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
      
      // Store registration data before signup
      setRegistrationData(userData);
      
      // Sign up user with Supabase Auth
      // The database trigger will automatically create the profile
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
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
          throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login dengan email ini.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Format email tidak valid. Silakan periksa kembali.');
        } else if (error.message.includes('Password')) {
          throw new Error('Password harus minimal 6 karakter.');
        } else {
          throw new Error(`Registrasi gagal: ${error.message}`);
        }
      }
      
      console.log('✅ Auth signup successful:', data.user?.id);
      
      // Since we disabled the trigger, we'll always create the profile manually
      console.log('🔄 Creating user profile manually...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          full_name: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: userData.role
        });
        
      if (insertError) {
        console.error('❌ Manual profile creation failed:', insertError);
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw new Error(`Failed to create user profile: ${insertError.message}`);
      }
      
      console.log('✅ Profile created successfully with phone:', userData.phone, 'and address:', userData.address);
      
      return true;
    } catch (e) {
      console.error('❌ Registration failed:', e);
      setRegistrationData(null);
      return false;
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
