"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";

export default function FacultyDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Protect Route
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "Admin" && user.role !== "Faculty") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== "Admin" && user.role !== "Faculty")) {
    return <div className="p-20 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }

  // Mock Data
  const recentSubmissions = [
    { id: "1", matric: "VUB/20/CSC/045", course: "CSC 401", score: 85, grade: "A", status: "Pending Approval" },
    { id: "2", matric: "VUB/20/CSC/012", course: "CSC 411", score: 62, grade: "C", status: "Approved" },
    { id: "3", matric: "VUB/20/CSC/088", course: "CSC 401", score: 71, grade: "B", status: "Pending Approval" },
    { id: "4", matric: "VUB/20/CSC/023", course: "CSC 499", score: 88, grade: "A", status: "Approved" },
    { id: "5", matric: "VUB/20/CSC/056", course: "CSC 411", score: 45, grade: "D", status: "Requires Review" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-[var(--muted)]">Welcome back, {user.name}. Here is your academic overview.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded text-sm hover:opacity-90">
          + Upload Batch Grades
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Total Students</div>
          <div className="text-4xl font-bold">1,248</div>
          <div className="text-xs text-green-500 mt-2">↑ 4% from last semester</div>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Grades Processed</div>
          <div className="text-4xl font-bold">8,402</div>
          <div className="text-xs text-[var(--muted)] mt-2">Current session only</div>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Pending Approvals</div>
          <div className="text-4xl font-bold text-orange-500">24</div>
          <div className="text-xs text-[var(--muted)] mt-2">Requires Senate confirmation</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5 flex justify-between items-center">
          <h2 className="font-semibold">Recent Grade Submissions</h2>
          <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">View All &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[var(--muted)] bg-[var(--background)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-medium">Matric No</th>
                <th className="px-6 py-4 font-medium">Course Code</th>
                <th className="px-6 py-4 font-medium">Raw Score</th>
                <th className="px-6 py-4 font-medium">Curve Grade</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{sub.matric}</td>
                  <td className="px-6 py-4">{sub.course}</td>
                  <td className="px-6 py-4">{sub.score}</td>
                  <td className="px-6 py-4 font-bold">{sub.grade}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      sub.status === 'Approved' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                      sub.status === 'Pending Approval' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 
                      'bg-red-500/10 text-red-600 border-red-500/20'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-colors">Edit</button>
                    {sub.status !== 'Approved' && (
                      <button className="text-[var(--foreground)] font-medium hover:underline">Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
