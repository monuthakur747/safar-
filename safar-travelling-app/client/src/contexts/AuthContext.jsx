import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save to localStorage when token or user changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
    }
  }, [token, user]);

  // Request OTP for signup
  const requestSignupOTP = async (email) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/signup-request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return { data, error: null };
    } catch (err) {
      const errorMsg = err.message || "Failed to request OTP";
      setError(errorMsg);
      return { data: null, error: err };
    }
  };

  // Verify OTP and complete signup
  const verifySignupOTP = async (email, otp, password, confirmPassword) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Store token and user
      setToken(data.token);
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      const errorMsg = err.message || "Failed to verify OTP";
      setError(errorMsg);
      return { data: null, error: err };
    }
  };

  // Request OTP for login
  const requestLoginOTP = async (email) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/login-request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return { data, error: null };
    } catch (err) {
      const errorMsg = err.message || "Failed to request OTP";
      setError(errorMsg);
      return { data: null, error: err };
    }
  };

  // Verify OTP for login
  const verifyLoginOTP = async (email, otp) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Store token and user
      setToken(data.token);
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      const errorMsg = err.message || "Failed to verify OTP";
      setError(errorMsg);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value = {
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
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
