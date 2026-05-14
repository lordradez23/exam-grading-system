"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full py-6 px-8 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md fade-in">
      <Link href="/#dashboard" className="font-bold text-xl tracking-tight">VERITAS<span className="text-[var(--muted)]">GRADES</span></Link>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--muted)]">
        <Link href="/#features" className="hover:text-[var(--foreground)] transition-colors">Core Capabilities</Link>
        <Link href="/#schema" className="hover:text-[var(--foreground)] transition-colors">Schema Details</Link>
        <Link href="/#workflow" className="hover:text-[var(--foreground)] transition-colors">Grading Workflow</Link>
        <Link href="/#security" className="hover:text-[var(--foreground)] transition-colors">Security</Link>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-sm hidden sm:block">
              <span className="text-[var(--muted)]">Logged in as </span>
              <span className="font-bold">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="px-5 py-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold rounded-full hover:bg-[var(--accent)]/5 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="px-5 py-2 bg-[var(--foreground)] text-[var(--background)] text-sm font-semibold rounded-full hover-lift">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
