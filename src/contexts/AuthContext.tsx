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
        let { data: userData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("❌ Error fetching user data:", error);
          return;
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
        } else if (registrationData) {
          // User profile doesn't exist and we have registration data, create profile
          console.log('📝 Creating user profile with data:', {
            id: authUser.id,
            full_name: registrationData.fullName,
            email: registrationData.email,
            phone: registrationData.phone,
            address: registrationData.address,
            role: registrationData.role,
          });
          
          // Insert into profiles table
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              full_name: registrationData.fullName,
              email: registrationData.email,
              phone: registrationData.phone,
              address: registrationData.address,
              role: registrationData.role,
            });
            
          if (insertError) {
            console.error("❌ Error inserting new user:", insertError);
          } else {
            console.log('✅ User profile created successfully');
            // Fetch the newly created user data to confirm
            const { data: newUserData, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
              
            if (fetchError) {
              console.error("❌ Error fetching new user data:", fetchError);
            } else {
              console.log('✅ New user data retrieved:', newUserData);
              setUser({
                id: newUserData.id,
                fullName: newUserData.full_name,
                email: authUser.email as string,
                phone: newUserData.phone,
                address: newUserData.address,
                role: newUserData.role,
              });
            }
          }
          setRegistrationData(null);
        } else {
          console.log('⚠️ User authenticated but no profile found and no registration data');
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
      await api.login({ email, password });
      return true;
    } catch (e) {
      console.error(e);
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
      
      // Store registration data before signup
      setRegistrationData(userData);
      
      // Sign up user with Supabase Auth
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
        throw new Error(error.message);
      }
      
      console.log('✅ Auth signup successful:', data.user?.id);
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
