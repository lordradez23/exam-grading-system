"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !matricNo || !department || !level) {
      setError("Please fill in all fields.");
      return;
    }

    const success = await signup(name, email, password, "Student", matricNo, department, level);
    if (success) {
      // Redirect to login after successful signup
      router.push("/login?registered=true");
    } else {
      setError("Email is already in use.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-20 fade-in">
      <BackButton />
      <div className="p-8 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent opacity-50"></div>
        
        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-[var(--muted)] text-sm mb-8 text-center">Register to access the grading system</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-600 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="name@university.edu"
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
          
          <div className="pt-4 border-t border-[var(--border)] space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Matriculation Number</label>
              <input 
                type="text" 
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                placeholder="VUG/CSC/23/8883"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Department</label>
              <input 
                type="text" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                placeholder="Computer Science"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 rounded bg-[var(--accent)]/5 border border-[var(--border)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                required
              >
                <option value="" disabled>Select Level</option>
                <option value="100L">100L</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>
                <option value="500L">500L</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full py-3 mt-8 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded hover:opacity-90 transition-opacity">
            Register Student Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)] border-t border-[var(--border)] pt-6">
          Already have an account? <Link href="/login" className="text-[var(--foreground)] hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
