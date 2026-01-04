import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: Record<string, { password: string; user: User }> = {
  'admin@defectai.com': {
    password: 'admin123',
    user: { id: '1', email: 'admin@defectai.com', name: 'Dr. Sarah Chen', role: 'admin' },
  },
  'user@defectai.com': {
    password: 'user123',
    user: { id: '2', email: 'user@defectai.com', name: 'Alex Johnson', role: 'user' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser: User = { id: Date.now().toString(), email, name, role };
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
