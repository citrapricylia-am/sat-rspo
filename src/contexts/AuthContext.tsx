import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: 'petani' | 'manajer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

  // Simulate authentication (in real app, this would call an API)
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data (in real app, this would come from API)
    const mockUser: User = {
      id: '1',
      fullName: 'John Doe',
      email: email,
      phone: '+62812345678',
      address: 'Jakarta, Indonesia',
      role: 'petani'
    };
    
    setUser(mockUser);
    return true;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: userData.role
    };
    
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};