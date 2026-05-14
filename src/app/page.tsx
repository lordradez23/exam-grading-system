"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div id="dashboard" className="w-full border-b border-[var(--border)] overflow-hidden relative">
        <div className="grid-texture"></div>
        <div className="max-w-7xl mx-auto px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 fade-in">
            <div className="text-xs font-mono tracking-widest text-[var(--muted)] uppercase">Veritas University Bwari</div>
            
            {user ? (
              <>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                  Welcome back,<br />
                  <span className="text-[var(--muted)]">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-lg text-[var(--muted)] max-w-md leading-relaxed">
                  {user.role === "Student" 
                    ? "Your centralized academic portal. View your current semester grades, CGPA, and track your progress securely."
                    : "Your faculty portal. Manage student records, process examination scores, and approve pending grades."}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                  <Link href={user.role === "Student" ? "/student" : "/dashboard"} className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-md font-semibold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2">
                    Enter {user.role === "Student" ? "Student Portal" : "Faculty Dashboard"} <span className="text-lg">&rarr;</span>
                  </Link>
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                  Examination Grading & Processing System
                </h1>
                <p className="text-lg text-[var(--muted)] max-w-md leading-relaxed">
                  The centralized portal for faculty and administrators to securely manage student records, process examination scores, and query academic data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link href="/login" className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-md font-semibold hover:opacity-90 transition-opacity text-center">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-6 py-3 bg-transparent text-[var(--foreground)] border border-[var(--border)] rounded-md font-semibold hover:bg-[var(--accent)]/5 transition-colors text-center">
                    Create Account
                  </Link>
                </div>
              </>
            )}

          </div>
          
          <div className="relative h-[450px] rounded-xl border border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-sm shadow-2xl p-6 fade-in hover-lift flex flex-col justify-center">
            {user?.role === "Student" ? (
              // Personalized Student Widget
              <>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)]">
                  <div className="font-semibold text-sm">Academic Snapshot</div>
                  <div className="px-3 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded">4.62 CGPA</div>
                </div>
                <div className="space-y-4">
                  {(!user.courses || user.courses.length === 0) ? (
                    <div className="p-4 text-center border border-[var(--border)] border-dashed rounded-lg text-sm text-[var(--muted)]">
                      No courses registered.
                    </div>
                  ) : (
                    user.courses.slice(0, 3).map((courseId) => {
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
                        <div key={courseId} className="flex justify-between items-center p-3 rounded border border-[var(--border)] bg-[var(--accent)]/5">
                          <div>
                            <div className="font-mono text-xs text-[var(--muted)]">{courseId}</div>
                            <div className="text-sm font-semibold">{mockNames[courseId] || "Course Topic"}</div>
                          </div>
                          <div className={`font-bold text-lg ${gradeColor}`}>{grade}</div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-6 flex justify-between text-xs text-[var(--muted)] pt-4 border-t border-[var(--border)]">
                  <span>1st Semester Results</span>
                  <Link href="/student" className="hover:text-[var(--foreground)] transition-colors">View Full Transcript &rarr;</Link>
                </div>
              </>
            ) : (
              // Default / Faculty Widget
              <>
                <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                  <div className="font-semibold text-sm">Recent Grading Submissions</div>
                  <Link href="/query" className="px-3 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs font-medium rounded hover:opacity-90">Run Query</Link>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="text-[var(--muted)] text-xs border-b border-[var(--border)]">
                    <tr>
                      <th className="pb-3 font-medium">Student ID</th>
                      <th className="pb-3 font-medium">Course Code</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr><td className="py-3 font-mono text-xs">VUB/20/CSC/045</td><td className="py-3 text-xs">CSC 401</td><td className="py-3 text-xs">78</td><td className="py-3 font-bold text-xs">A</td></tr>
                    <tr><td className="py-3 font-mono text-xs">VUB/20/CSC/012</td><td className="py-3 text-xs">CSC 401</td><td className="py-3 text-xs">64</td><td className="py-3 font-bold text-xs">B</td></tr>
                    <tr><td className="py-3 font-mono text-xs">VUB/20/CSC/089</td><td className="py-3 text-xs">CSC 401</td><td className="py-3 text-xs">45</td><td className="py-3 font-bold text-xs">D</td></tr>
                    <tr><td className="py-3 font-mono text-xs">VUB/20/CSC/102</td><td className="py-3 text-xs">CSC 401</td><td className="py-3 text-xs">58</td><td className="py-3 font-bold text-xs">C</td></tr>
                  </tbody>
                </table>
                <div className="mt-4 flex justify-between text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
                  <span>Showing 4 of 1,204 records</span>
                  <div className="flex gap-2">
                    <button className="hover:text-[var(--foreground)] transition-colors">Prev</button>
                    <button className="hover:text-[var(--foreground)] transition-colors">Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
