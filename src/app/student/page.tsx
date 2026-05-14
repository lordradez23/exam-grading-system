"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

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
    <div className="w-full max-w-4xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 pb-6 border-b border-[var(--border)]">
          <div>
            <h1 className="text-2xl font-bold mb-1">Academic Snapshot</h1>
            <p className="text-[var(--muted)] text-sm">
              {user.matricNo || "VUG/CSC/23/8883"} • {user.department || "Computer Science"} • {user.level || "400L"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-sm font-bold rounded-md">
              4.62 CGPA
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
            <div>
              <div className="font-mono text-xs text-[var(--muted)] mb-1">CSC 401</div>
              <div className="text-base font-semibold">Software Engineering II</div>
            </div>
            <div className="font-bold text-2xl text-green-500">A</div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
            <div>
              <div className="font-mono text-xs text-[var(--muted)] mb-1">CSC 411</div>
              <div className="text-base font-semibold">Artificial Intelligence</div>
            </div>
            <div className="font-bold text-2xl text-blue-500">B</div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
            <div>
              <div className="font-mono text-xs text-[var(--muted)] mb-1">CSC 421</div>
              <div className="text-base font-semibold">Database Systems</div>
            </div>
            <div className="font-bold text-2xl text-green-500">A</div>
          </div>

          <div className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
            <div>
              <div className="font-mono text-xs text-[var(--muted)] mb-1">MTH 401</div>
              <div className="text-base font-semibold">Numerical Analysis</div>
            </div>
            <div className="font-bold text-2xl text-yellow-500">C</div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center text-sm text-[var(--muted)]">
          <span>1st Semester Results</span>
          <button className="px-4 py-2 bg-transparent text-[var(--foreground)] border border-[var(--border)] rounded hover:bg-[var(--accent)]/5 transition-colors font-medium">
            Download Result Slip
          </button>
        </div>
      </div>
    </div>
  );
}
