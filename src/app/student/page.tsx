"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";

export default function StudentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Protect Route
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "Student") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "Student") {
    return <div className="p-20 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center p-8 border border-[var(--border)] rounded-2xl bg-[var(--background)] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--foreground)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="w-32 h-32 rounded-full bg-[var(--accent)]/10 border-4 border-[var(--border)] flex items-center justify-center text-5xl font-bold text-[var(--muted)] relative z-10 shadow-inner">
          {user.name.charAt(0)}
        </div>
        
        <div className="relative z-10 flex-1">
          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
          <p className="text-[var(--muted)] text-lg mb-4">{user.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[var(--muted)] font-mono">
            <div className="p-4 bg-[var(--accent)]/5 border border-[var(--border)] rounded-xl flex flex-col">
              <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Matric Number</span>
              <span className="font-semibold text-[var(--foreground)] text-base">{user.matricNo || "Not provided"}</span>
            </div>
            <div className="p-4 bg-[var(--accent)]/5 border border-[var(--border)] rounded-xl flex flex-col">
              <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Department</span>
              <span className="font-semibold text-[var(--foreground)] text-base">{user.department || "Not provided"}</span>
            </div>
            <div className="p-4 bg-[var(--accent)]/5 border border-[var(--border)] rounded-xl flex flex-col">
              <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Level</span>
              <span className="font-semibold text-[var(--foreground)] text-base">{user.level || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Highlighted CGPA Badge */}
        <div className="relative z-10 self-center md:self-stretch flex flex-col justify-center items-center p-8 bg-[var(--foreground)] text-[var(--background)] rounded-xl shadow-xl ml-auto min-w-[200px]">
          <span className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">Current CGPA</span>
          <span className="text-6xl font-extrabold tracking-tighter">4.62</span>
          <span className="text-xs mt-2 opacity-80">First Class Honors</span>
        </div>
      </div>
    </div>
  );
}
