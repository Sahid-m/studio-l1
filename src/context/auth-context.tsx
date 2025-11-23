
'use client';

import React, { createContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'medlens_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = window.sessionStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    try {
      window.sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Could not save user to sessionStorage", error);
    }
  };
  
  const logout = () => {
    try {
      window.sessionStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
    } catch (error) {
       console.error("Could not remove user from sessionStorage", error);
    }
  }


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
