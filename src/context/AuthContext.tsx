"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our User object
export type User = {
  id: string;
  name: string;
  email: string;
  role: "Faculty" | "Student" | "Admin";
};

// Define the shape of our context
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: "Faculty" | "Student") => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On initial load, check if there's a session in localStorage
  useEffect(() => {
    const session = localStorage.getItem("veritas_session");
    if (session) {
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 1. Check Hardcoded Admin Exception
    if (email.toLowerCase() === "admin@gmail.com" && password === "Admin123") {
      const adminUser: User = { id: "admin-1", name: "System Admin", email, role: "Admin" };
      setUser(adminUser);
      localStorage.setItem("veritas_session", JSON.stringify(adminUser));
      return true;
    }

    // 2. Check LocalStorage for registered users
    const usersStr = localStorage.getItem("veritas_users");
    if (usersStr) {
      const users = JSON.parse(usersStr);
      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (foundUser) {
        // Strip password before setting session
        const sessionUser: User = { 
          id: foundUser.id, 
          name: foundUser.name, 
          email: foundUser.email, 
          role: foundUser.role 
        };
        setUser(sessionUser);
        localStorage.setItem("veritas_session", JSON.stringify(sessionUser));
        return true;
      }
    }

    return false; // Login failed
  };

  const signup = async (name: string, email: string, password: string, role: "Faculty" | "Student"): Promise<boolean> => {
    // Get existing users
    const usersStr = localStorage.getItem("veritas_users");
    const users = usersStr ? JSON.parse(usersStr) : [];

    // Check if email already exists
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || email.toLowerCase() === "admin@gmail.com") {
      return false; // Email taken
    }

    // Create new user record
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role,
    };

    // Save to local storage
    users.push(newUser);
    localStorage.setItem("veritas_users", JSON.stringify(users));
    
    return true; // Signup successful
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("veritas_session");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
