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
          {(!user.courses || user.courses.length === 0) ? (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-xl text-[var(--muted)]">
              No courses registered for the current semester.
            </div>
          ) : (
            user.courses.map((courseId) => {
              // Generate mock details deterministically based on courseId
              const isA = courseId.includes("401") || courseId.includes("421");
              const isB = courseId.includes("411");
              const grade = isA ? "A" : (isB ? "B" : "C");
              const gradeColor = grade === "A" ? "text-green-500" : (grade === "B" ? "text-blue-500" : "text-yellow-500");
              
              const mockNames: Record<string, string> = {
                "CSC 401": "Software Engineering II",
                "CSC 411": "Artificial Intelligence",
                "CSC 421": "Database Systems",
                "MTH 401": "Numerical Analysis",
                "GST 101": "Use of English",
                "PHY 101": "General Physics"
              };
              
              return (
                <div key={courseId} className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
                  <div>
                    <div className="font-mono text-xs text-[var(--muted)] mb-1">{courseId}</div>
                    <div className="text-base font-semibold">{mockNames[courseId] || "Course Topic"}</div>
                  </div>
                  <div className={`font-bold text-2xl ${gradeColor}`}>{grade}</div>
                </div>
              );
            })
          )}
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
