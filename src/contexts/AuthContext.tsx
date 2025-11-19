"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/models/User.model';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, tel: string, password: string, role: 'member' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const authMeUrl = process.env.NEXT_PUBLIC_AUTH_ME_URL || 'http://localhost:5000/api/v1/auth/me';
      const response = await fetch(authMeUrl, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loginUrl = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL || 'http://localhost:5000/api/v1/auth/login';
      const authMeUrl = process.env.NEXT_PUBLIC_AUTH_ME_URL || 'http://localhost:5000/api/v1/auth/me';
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        
        // Fetch user data to get role
        const userResponse = await fetch(authMeUrl, {
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        } else {
          // Fallback: set user with available data
          setUser({ ...data, _id: data._id, tel: '', role: 'member' });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, tel: string, password: string, role: 'member' | 'admin'): Promise<boolean> => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
      const registerUrl = `${apiBaseUrl}/auth/register`;
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, tel, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        
        // Fetch user data to get complete user info with role
        const authMeUrl = process.env.NEXT_PUBLIC_AUTH_ME_URL || 'http://localhost:5000/api/v1/auth/me';
        const userResponse = await fetch(authMeUrl, {
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        } else {
          // Fallback: set user with available data
          setUser({ ...data, _id: data._id, tel, role, password: '' });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
      const logoutUrl = `${apiBaseUrl}/auth/logout`;
      
      await fetch(logoutUrl, {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.clear();
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}