"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Faculty" | "Student" | "Admin";
  matricNo?: string;
  department?: string;
  level?: string;
  courses?: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string, email: string, password: string, role: "Faculty" | "Student",
    matricNo?: string, department?: string, level?: string, courses?: string[]
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("veritas_session");
    const storedToken = localStorage.getItem("veritas_token");
    if (stored && storedToken) {
      setUser(JSON.parse(stored));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("veritas_session", JSON.stringify(data.user));
    localStorage.setItem("veritas_token", data.token);
    return true;
  };

  const signup = async (
    name: string, email: string, password: string, role: "Faculty" | "Student",
    matricNo?: string, department?: string, level?: string, courses?: string[]
  ): Promise<boolean> => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, matricNo, department, level, courses }),
    });
    return res.ok;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("veritas_session");
    localStorage.removeItem("veritas_token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}