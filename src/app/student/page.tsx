"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";
import { useToast } from "@/context/ToastContext";
import { apiFetch } from "@/lib/api";

type Grade = {
  grade_id: string;
  course_code: string;
  score: number;
  grade_letter: string;
  status: string;
  semester: string;
  session: string;
};

const COURSE_NAMES: Record<string, string> = {
  "CSC 401": "Software Engineering II",
  "CSC 411": "Artificial Intelligence",
  "CSC 421": "Database Systems",
  "MTH 401": "Numerical Analysis",
  "GST 101": "Use of English",
  "PHY 101": "General Physics",
};

export default function StudentDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedSession, setSelectedSession] = useState("2023/2024 - 1st Semester");
  const [reportModalData, setReportModalData] = useState<{ gradeId: string; courseCode: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportedCourses, setReportedCourses] = useState<string[]>([]);

  // ── Route Protection ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/login");
      else if (user.role !== "Student") router.push("/");
    }
  }, [user, isLoading, router]);

  // ── Fetch Grades ──────────────────────────────────────────────────────────
  const fetchGrades = useCallback(async () => {
    if (!token) return;
    setIsFetching(true);
    try {
      const res = await apiFetch("/api/grades", token);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGrades(data);
    } catch {
      toast("Failed to load your grades.", "error");
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // ── Submit Dispute ────────────────────────────────────────────────────────
  const handleSubmitReport = async () => {
    if (!reportModalData || !token) return;
    if (reportReason.trim().length <= 5) {
      toast("Please provide a valid reason.", "error");
      return;
    }
    try {
      const res = await apiFetch(`/api/grades/${reportModalData.gradeId}/dispute`, token, {
        method: "POST",
        body: JSON.stringify({ reason: reportReason }),
      });
      if (!res.ok) throw new Error();
      setReportedCourses((prev) => [...prev, reportModalData.courseCode]);
      setGrades((prev) =>
        prev.map((g) =>
          g.grade_id === reportModalData.gradeId
            ? { ...g, status: "Requires Review" }
            : g
        )
      );
      toast(`Report submitted for ${reportModalData.courseCode}`, "success");
      setReportModalData(null);
      setReportReason("");
    } catch {
      toast("Failed to submit report.", "error");
    }
  };

  // ── Analytics ─────────────────────────────────────────────────────────────
  const totalUnits = grades.length * 3;
  const earnedUnits = grades.filter((g) => g.status === "Approved").length * 3;
  const pendingCount = grades.filter((g) => g.status === "Pending Approval").length;
  const distinctionCount = grades.filter((g) => g.grade_letter === "A").length;

  const cgpa = grades.length
    ? (
        grades.reduce((acc, g) => {
          const pts =
            g.grade_letter === "A" ? 5 :
            g.grade_letter === "B" ? 4 :
            g.grade_letter === "C" ? 3 :
            g.grade_letter === "D" ? 2 : 0;
          return acc + pts;
        }, 0) / grades.length
      ).toFixed(2)
    : "N/A";

  if (isLoading || !user || user.role !== "Student") {
    return <div className="p-20 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12 fade-in">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded px-3 py-1.5 text-sm font-medium outline-none transition-colors cursor-pointer focus:border-[var(--foreground)]"
        >
          <option>2023/2024 - 1st Semester</option>
          <option>2022/2023 - 2nd Semester</option>
          <option>2022/2023 - 1st Semester</option>
        </select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 pb-6 border-b border-[var(--border)] gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Academic Snapshot</h1>
            <p className="text-[var(--muted)] text-sm">
              <span className="font-mono">{user.matricNo || "—"}</span> •{" "}
              {user.department || "—"} • {user.level || "—"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold mb-1">
                Current CGPA
              </div>
              <div className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-lg font-bold rounded-md">
                {cgpa}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Analytics Row */}
        {grades.length > 0 && (
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
              <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--accent)]/5">
              <div className="text-xs text-[var(--muted)] font-semibold mb-1">Distinctions</div>
              <div className="text-2xl font-bold text-green-500">{distinctionCount}</div>
            </div>
          </div>
        )}

        {/* Grades List */}
        <div className="space-y-4">
          {isFetching ? (
            <div className="p-12 flex items-center justify-center gap-3 text-[var(--muted)]">
              <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--foreground)] rounded-full animate-spin" />
              Loading your results...
            </div>
          ) : grades.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center border border-[var(--border)] border-dashed rounded-xl bg-[var(--accent)]/5 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] mb-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h3 className="text-lg font-bold mb-1">No Results Found</h3>
              <p className="text-[var(--muted)] text-sm max-w-sm">
                No grades have been published for your courses yet. Check back after your faculty approves results.
              </p>
            </div>
          ) : (
            grades.map((g) => {
              const isReported = reportedCourses.includes(g.course_code);
              const isPending = g.status === "Pending Approval";
              const isReview = g.status === "Requires Review" || isReported;

              let displayGrade = g.grade_letter;
              if (isReview) displayGrade = "IN REVIEW";
              if (isPending) displayGrade = "PENDING";

              const gradeColor =
                displayGrade === "A" ? "text-green-500" :
                displayGrade === "B" ? "text-blue-500" :
                displayGrade === "C" ? "text-yellow-500" :
                displayGrade === "D" ? "text-orange-400" :
                displayGrade === "F" ? "text-red-500" :
                "text-orange-500 text-sm border border-orange-500/20 bg-orange-500/10 px-2 py-1 rounded-full";

              return (
                <div
                  key={g.grade_id}
                  className="flex justify-between items-center p-4 rounded border border-[var(--border)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors group"
                >
                  <div>
                    <div className="font-mono text-xs text-[var(--muted)] mb-1">
                      {g.course_code} • 3 Units
                    </div>
                    <div className="text-base font-semibold flex items-center gap-3">
                      {COURSE_NAMES[g.course_code] || g.course_code}
                      {!isPending && !isReview && (
                        <button
                          onClick={() =>
                            setReportModalData({ gradeId: g.grade_id, courseCode: g.course_code })
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--foreground)]"
                        >
                          Report Error
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-2xl ${gradeColor}`}>{displayGrade}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Grading Scale */}
        {grades.length > 0 && (
          <div className="mt-8 p-4 border border-[var(--border)] rounded bg-[var(--background)] flex flex-wrap gap-6 text-xs text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Grading Scale:</span>
            <span>A = 70–100 (5 pts)</span>
            <span>B = 60–69 (4 pts)</span>
            <span>C = 50–59 (3 pts)</span>
            <span>D = 45–49 (2 pts)</span>
            <span>F = 0–44 (0 pts)</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row gap-4 justify-between md:items-center text-sm text-[var(--muted)]">
          <span>{selectedSession} Results</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-transparent text-[var(--foreground)] border border-[var(--border)] rounded hover:bg-[var(--accent)]/5 transition-colors font-medium"
          >
            Download Result Slip
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Report Error</h3>
            <p className="text-[var(--muted)] text-sm mb-6">
              File a dispute for{" "}
              <span className="font-mono">{reportModalData.courseCode}</span>. The Faculty Admin will review your result.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Reason for Review</label>
              <textarea
                rows={3}
                placeholder="e.g., My continuous assessment score is missing..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded focus:outline-none focus:border-[var(--foreground)] bg-transparent resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setReportModalData(null); setReportReason(""); }}
                className="px-4 py-2 font-medium text-[var(--muted)] rounded hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded hover:opacity-90 transition-opacity"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}