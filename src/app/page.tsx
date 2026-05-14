"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link href={user.role === "Student" ? "/student" : "/dashboard"} className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-md font-semibold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2">
                    Enter {user.role === "Student" ? "Student Portal" : "Faculty Dashboard"} <span className="text-lg">&rarr;</span>
                  </Link>
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

            <div className="grid grid-cols-4 gap-4 pt-12 border-t border-[var(--border)]">
              <div>
                <div className="font-bold text-sm">Schema v2.4</div>
                <div className="text-xs text-[var(--muted)]">Current Database</div>
              </div>
              <div>
                <div className="font-bold text-sm">Active</div>
                <div className="text-xs text-[var(--muted)]">System Status</div>
              </div>
              <div>
                <div className="font-bold text-sm">2023/2024</div>
                <div className="text-xs text-[var(--muted)]">Academic Session</div>
              </div>
              <div>
                <div className="font-bold text-sm">Admin</div>
                <div className="text-xs text-[var(--muted)]">Support Contact</div>
              </div>
            </div>
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
                  <div className="flex justify-between items-center p-3 rounded border border-[var(--border)] bg-[var(--accent)]/5">
                    <div>
                      <div className="font-mono text-xs text-[var(--muted)]">CSC 401</div>
                      <div className="text-sm font-semibold">Software Engineering II</div>
                    </div>
                    <div className="font-bold text-lg text-green-500">A</div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded border border-[var(--border)] bg-[var(--accent)]/5">
                    <div>
                      <div className="font-mono text-xs text-[var(--muted)]">CSC 411</div>
                      <div className="text-sm font-semibold">Artificial Intelligence</div>
                    </div>
                    <div className="font-bold text-lg text-blue-500">B</div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded border border-[var(--border)] bg-[var(--accent)]/5">
                    <div>
                      <div className="font-mono text-xs text-[var(--muted)]">CSC 421</div>
                      <div className="text-sm font-semibold">Database Systems</div>
                    </div>
                    <div className="font-bold text-lg text-green-500">A</div>
                  </div>
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
