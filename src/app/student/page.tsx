"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

export default function StudentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState("2023/2024 - 1st Semester");

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

  // Calculate Mock Analytics
  const hasCourses = user.courses && user.courses.length > 0;
  const totalUnits = hasCourses ? user.courses.length * 3 : 0;
  let earnedUnits = 0;
  const gradeCounts = { A: 0, B: 0, C: 0, Pending: 0 };

  if (hasCourses) {
    user.courses.forEach(courseId => {
      const isPending = courseId.includes("411");
      const isA = courseId.includes("401") || courseId.includes("421");
      
      if (isPending) {
        gradeCounts.Pending++;
      } else {
        earnedUnits += 3;
        if (isA) gradeCounts.A++;
        else gradeCounts.C++;
      }
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 fade-in">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <select 
          value={selectedSession} 
          onChange={(e) => setSelectedSession(e.target.value)}
          className="bg-transparent border border-[var(--border)] rounded px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] focus:border-[var(--foreground)] focus:text-[var(--foreground)] outline-none transition-colors cursor-pointer"
        >
          <option>2023/2024 - 1st Semester</option>
          <option>2022/2023 - 2nd Semester</option>
          <option>2022/2023 - 1st Semester</option>
        </select>
      </div>
      
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 pb-6 border-b border-[var(--border)] gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Academic Snapshot</h1>
            <p className="text-[var(--muted)] text-sm">
              <span className="font-mono">{user.matricNo || "VUB/CSC/23/8883"}</span> • {user.department || "Computer Science"} • {user.level || "400L"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold mb-1">Current CGPA</div>
              <div className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-lg font-bold rounded-md">
                4.62
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Analytics Row */}
        {hasCourses && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--accent)]/5">
              <div className="text-xs text-[var(--muted)] font-semibold mb-1">Total Units</div>
              <div className="text-2xl font-bold">{totalUnits}</div>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--accent)]/5">
              <div className="text-xs text-[var(--muted)] font-semibold mb-1">Units Earned</div>
              <div className="text-2xl font-bold">{earnedUnits}</div>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--accent)]/5">
              <div className="text-xs text-[var(--muted)] font-semibold mb-1">Pending</div>
              <div className="text-2xl font-bold text-orange-500">{gradeCounts.Pending}</div>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--accent)]/5">
              <div className="text-xs text-[var(--muted)] font-semibold mb-1">Distinctions</div>
              <div className="text-2xl font-bold text-green-500">{gradeCounts.A}</div>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          {!hasCourses ? (
            <div className="p-12 flex flex-col items-center justify-center border border-[var(--border)] border-dashed rounded-xl bg-[var(--accent)]/5 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] mb-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 className="text-lg font-bold mb-1">No Courses Found</h3>
              <p className="text-[var(--muted)] text-sm max-w-sm">
                You haven't registered for any courses this semester. Please contact your departmental advisor or the registry to update your course enrollment list.
              </p>
            </div>
          ) : (
            user.courses.map((courseId) => {
              // Generate mock details deterministically based on courseId
              const isPending = courseId.includes("411");
              const isA = courseId.includes("401") || courseId.includes("421");
              const grade = isPending ? "PENDING" : (isA ? "A" : "C");
              
              const gradeColor = grade === "A" ? "text-green-500" : (grade === "C" ? "text-yellow-500" : "text-orange-500 text-sm border border-orange-500/20 bg-orange-500/10 px-2 py-1 rounded-full");
              
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
                    <div className="font-mono text-xs text-[var(--muted)] mb-1">{courseId} • 3 Units</div>
                    <div className="text-base font-semibold">{mockNames[courseId] || "Course Topic"}</div>
                  </div>
                  <div className={`font-bold text-2xl ${gradeColor}`}>{grade}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Grading Scale Legend */}
        {hasCourses && (
          <div className="mt-8 p-4 border border-[var(--border)] rounded bg-[var(--background)] flex gap-6 text-xs text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Grading Scale:</span>
            <span>A = 70-100 (5 points)</span>
            <span>B = 60-69 (4 points)</span>
            <span>C = 50-59 (3 points)</span>
            <span>D = 45-49 (2 points)</span>
            <span>F = 0-44 (0 points)</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row gap-4 justify-between md:items-center text-sm text-[var(--muted)]">
          <span>{selectedSession} Results</span>
          <button onClick={() => window.print()} className="px-4 py-2 bg-transparent text-[var(--foreground)] border border-[var(--border)] rounded hover:bg-[var(--accent)]/5 transition-colors font-medium">
            Download Result Slip
          </button>
        </div>
      </div>
    </div>
  );
}
