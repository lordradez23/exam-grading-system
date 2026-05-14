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

  // Generate a mock matric number based on user ID
  const mockMatric = `VUB/23/CSC/${user.id.substring(0, 3).toUpperCase()}`;

  // Mock Transcript Data
  const courses = [
    { code: "CSC 401", title: "Software Engineering II", units: 3, score: 78, grade: "A", points: 15 },
    { code: "CSC 411", title: "Artificial Intelligence", units: 3, score: 65, grade: "B", points: 12 },
    { code: "CSC 421", title: "Database Systems", units: 2, score: 82, grade: "A", points: 10 },
    { code: "MTH 401", title: "Numerical Analysis", units: 3, score: 58, grade: "C", points: 9 },
    { code: "GST 401", title: "Entrepreneurship", units: 2, score: 70, grade: "A", points: 10 },
  ];

  const totalUnits = courses.reduce((acc, curr) => acc + curr.units, 0);
  const totalPoints = courses.reduce((acc, curr) => acc + curr.points, 0);
  const gpa = (totalPoints / totalUnits).toFixed(2);

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12 p-8 border border-[var(--border)] rounded-2xl bg-[var(--background)] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--foreground)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 border-2 border-[var(--border)] flex items-center justify-center text-3xl font-bold text-[var(--muted)] relative z-10">
          {user.name.charAt(0)}
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)] font-mono mt-2">
            <span className="px-3 py-1 bg-[var(--accent)]/5 border border-[var(--border)] rounded-full">MATRIC: {mockMatric}</span>
            <span className="px-3 py-1 bg-[var(--accent)]/5 border border-[var(--border)] rounded-full">DEPT: Computer Science</span>
            <span className="px-3 py-1 bg-[var(--accent)]/5 border border-[var(--border)] rounded-full">LEVEL: 400L</span>
          </div>
        </div>
      </div>

      {/* Academic Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Current Semester</div>
          <div className="font-bold text-lg font-mono">1st Semester</div>
        </div>
        <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Total Units</div>
          <div className="font-bold text-lg font-mono">{totalUnits}</div>
        </div>
        <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm bg-[var(--foreground)] text-[var(--background)]">
          <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Current GPA</div>
          <div className="font-bold text-2xl font-mono">{gpa}</div>
        </div>
        <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">CGPA</div>
          <div className="font-bold text-lg font-mono">4.21</div>
        </div>
      </div>

      {/* Transcript Table */}
      <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5">
          <h2 className="font-semibold">Current Semester Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[var(--muted)] bg-[var(--background)] border-b border-[var(--border)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Course Code</th>
                <th className="px-6 py-4 font-medium">Course Title</th>
                <th className="px-6 py-4 font-medium text-center">Units</th>
                <th className="px-6 py-4 font-medium text-center">Score</th>
                <th className="px-6 py-4 font-medium text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {courses.map((course, idx) => (
                <tr key={idx} className="hover:bg-[var(--accent)]/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{course.code}</td>
                  <td className="px-6 py-4">{course.title}</td>
                  <td className="px-6 py-4 text-center font-mono">{course.units}</td>
                  <td className="px-6 py-4 text-center font-mono">{course.score}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      course.grade === 'A' ? 'bg-green-500/10 text-green-600' :
                      course.grade === 'B' ? 'bg-blue-500/10 text-blue-600' :
                      course.grade === 'C' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-orange-500/10 text-orange-600'
                    }`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-[var(--accent)]/5 border-t border-[var(--border)] flex justify-between items-center">
          <div className="text-sm text-[var(--muted)]">Last updated: Today at 09:42 AM</div>
          <button className="px-4 py-2 border border-[var(--border)] bg-[var(--background)] font-medium rounded text-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
