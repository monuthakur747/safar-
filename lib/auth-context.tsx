'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  requestSignupOTP: (email: string) => Promise<{ data?: any; error?: Error }>;
  verifySignupOTP: (email: string, otp: string, password: string, confirmPassword: string) => Promise<{ data?: any; error?: Error }>;
  requestLoginOTP: (email: string) => Promise<{ data?: any; error?: Error }>;
  verifyLoginOTP: (email: string, otp: string) => Promise<{ data?: any; error?: Error }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save to localStorage when token or user changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (token) {
      localStorage.setItem('auth_token', token);
      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    }
  }, [token, user]);

  const requestSignupOTP = async (email: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/signup-request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return { data, error: undefined };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request OTP';
      setError(errorMsg);
      return { data: undefined, error: err as Error };
    }
  };

  const verifySignupOTP = async (email: string, otp: string, password: string, confirmPassword: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setToken(data.token);
      setUser(data.user);
      return { data, error: undefined };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMsg);
      return { data: undefined, error: err as Error };
    }
  };

  const requestLoginOTP = async (email: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/login-request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return { data, error: undefined };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request OTP';
      setError(errorMsg);
      return { data: undefined, error: err as Error };
    }
  };

  const verifyLoginOTP = async (email: string, otp: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setToken(data.token);
      setUser(data.user);
      return { data, error: undefined };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMsg);
      return { data: undefined, error: err as Error };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    requestSignupOTP,
    verifySignupOTP,
    requestLoginOTP,
    verifyLoginOTP,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
