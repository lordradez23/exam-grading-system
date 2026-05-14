"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If URL has ?registered=true, show a success message
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered") === "true") {
        setMessage("Account created successfully! Please log in.");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid email or password. Please try again or create an account.");
    }
  };

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto px-8 py-20 fade-in">
      <BackButton />
      <div className="p-8 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent opacity-50"></div>
        
        <h1 className="text-2xl font-bold mb-2 text-center">System Login</h1>
        <p className="text-[var(--muted)] text-sm mb-8 text-center">Sign in to access your account</p>
        
        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-600 text-sm rounded text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-600 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 mt-6 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)] border-t border-[var(--border)] pt-6">
          Don't have an account? <Link href="/signup" className="text-[var(--foreground)] hover:underline font-medium">Create one</Link>
        </div>
      </div>
    </div>
  );
}
