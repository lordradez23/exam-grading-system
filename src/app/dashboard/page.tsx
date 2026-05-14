"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";
import { useToast } from "@/context/ToastContext";
import { apiFetch } from "@/lib/api";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type Submission = {
  id: string;
  matric: string;
  course: string;
  score: number;
  grade: string;
  status: string;
};

type Metrics = {
  totalStudents: number;
  gradesProcessed: number;
  pendingApprovals: number;
};

export default function FacultyDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [editModalData, setEditModalData] = useState<Submission | null>(null);
  const [newScore, setNewScore] = useState<number | "">("");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    gradesProcessed: 0,
    pendingApprovals: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Route Protection ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/login");
      else if (user.role !== "Admin" && user.role !== "Faculty") router.push("/");
    }
  }, [user, isLoading, router]);

  // ── Fetch Grades ──────────────────────────────────────────────────────────
  const fetchGrades = useCallback(async () => {
    if (!token) return;
    setIsFetching(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await apiFetch(`/api/grades?${params.toString()}`, token);
      if (!res.ok) throw new Error("Failed to fetch grades");
      const data = await res.json();
      setRecentSubmissions(data);
    } catch {
      toast("Failed to load submissions.", "error");
    } finally {
      setIsFetching(false);
    }
  }, [token, searchTerm, statusFilter]);

  // ── Fetch Metrics ─────────────────────────────────────────────────────────
  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/api/metrics", token);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMetrics(data);
    } catch {
      toast("Failed to load metrics.", "error");
    }
  }, [token]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // ── Approve Single ────────────────────────────────────────────────────────
  const handleConfirmApprove = async () => {
    if (!confirmApproveId || !token) return;
    try {
      const res = await apiFetch(`/api/grades/${confirmApproveId}`, token, {
        method: "PATCH",
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error();
      setRecentSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === confirmApproveId ? { ...sub, status: "Approved" } : sub
        )
      );
      setMetrics((prev) => ({
        ...prev,
        gradesProcessed: prev.gradesProcessed + 1,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
      toast("Grade successfully approved and locked.", "success");
    } catch {
      toast("Failed to approve grade.", "error");
    } finally {
      setConfirmApproveId(null);
    }
  };

  // ── Edit Score ────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editModalData || newScore === "" || !token) return;
    const scoreNum = Number(newScore);
    if (scoreNum < 0 || scoreNum > 100) {
      toast("Score must be between 0 and 100", "error");
      return;
    }
    try {
      const res = await apiFetch(`/api/grades/${editModalData.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ score: scoreNum }),
      });
      if (!res.ok) throw new Error();
      const { grade: newGrade } = await res.json();
      setRecentSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === editModalData.id
            ? { ...sub, score: scoreNum, grade: newGrade, status: "Pending Approval" }
            : sub
        )
      );
      toast(`Score updated for ${editModalData.matric}`, "success");
      setEditModalData(null);
    } catch {
      toast("Failed to update score.", "error");
    }
  };

  // ── Bulk Approve ──────────────────────────────────────────────────────────
  const handleBulkApprove = async () => {
    if (!token) return;
    const pendingIds = recentSubmissions
      .filter((sub) => sub.status !== "Approved")
      .map((sub) => sub.id);

    if (pendingIds.length === 0) {
      toast("No pending submissions found.", "info");
      return;
    }
    try {
      const res = await apiFetch("/api/grades/bulk-approve", token, {
        method: "POST",
        body: JSON.stringify({ ids: pendingIds }),
      });
      if (!res.ok) throw new Error();
      setRecentSubmissions((prev) =>
        prev.map((sub) =>
          pendingIds.includes(sub.id) ? { ...sub, status: "Approved" } : sub
        )
      );
      setMetrics((prev) => ({
        ...prev,
        gradesProcessed: prev.gradesProcessed + pendingIds.length,
        pendingApprovals: 0,
      }));
      toast(`Successfully bulk approved ${pendingIds.length} submissions!`, "success");
    } catch {
      toast("Bulk approve failed.", "error");
    }
  };

  // ── File Upload (CSV / XLSX) ───────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    try {
      let rows: any[] = [];

      if (file.name.endsWith(".csv")) {
        // Parse CSV
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        rows = parsed.data;
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Parse XLSX
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws);
      } else {
        toast("Only .csv and .xlsx files are supported.", "error");
        return;
      }

      // Normalize keys — file columns should be: matricNo, courseCode, score, semester, session
      const normalised = rows.map((r: any) => ({
        matricNo: r.matricNo || r.matric_no || r["Matric No"] || r["matric no"],
        courseCode: r.courseCode || r.course_code || r["Course Code"] || r["course code"],
        score: Number(r.score || r.Score || 0),
        semester: r.semester || r.Semester || "1st",
        session: r.session || r.Session || "2023/2024",
      }));

      const res = await apiFetch("/api/grades/upload", token, {
        method: "POST",
        body: JSON.stringify({ rows: normalised }),
      });
      if (!res.ok) throw new Error();
      const { inserted } = await res.json();
      toast(`Successfully uploaded ${inserted} grade records!`, "success");
      fetchGrades();
      fetchMetrics();
    } catch {
      toast("Upload failed. Check file format and try again.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Derived State ─────────────────────────────────────────────────────────
  const displayedSubmissions = showAll
    ? recentSubmissions
    : recentSubmissions.slice(0, 4);

  if (isLoading || !user || (user.role !== "Admin" && user.role !== "Faculty")) {
    return <div className="p-20 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12 fade-in">
      <BackButton />

      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-[var(--muted)]">
            Welcome back, {user.name}. Here is your academic overview.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleBulkApprove}
            className="px-4 py-2 border border-[var(--border)] text-[var(--foreground)] font-medium rounded text-sm hover:bg-[var(--accent)]/5 transition-colors"
          >
            Bulk Approve Pending
          </button>
          <input
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded text-sm transition-opacity ${
              isUploading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isUploading ? "Uploading..." : "+ Upload Batch Grades"}
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Total Students</div>
          <div className="text-4xl font-bold">
            {metrics.totalStudents.toLocaleString()}
          </div>
          <div className="text-xs text-green-500 mt-2">Live from database</div>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Grades Processed</div>
          <div className="text-4xl font-bold">
            {metrics.gradesProcessed.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted)] mt-2">Approved records</div>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm hover-lift">
          <div className="text-sm font-medium text-[var(--muted)] mb-2">Pending Approvals</div>
          <div
            className={`text-4xl font-bold ${
              metrics.pendingApprovals > 0 ? "text-orange-500" : "text-green-500"
            }`}
          >
            {metrics.pendingApprovals}
          </div>
          <div className="text-xs text-[var(--muted)] mt-2">
            {metrics.pendingApprovals > 0 ? "Requires attention" : "All caught up!"}
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-semibold">Student Submissions</h2>
          <div className="flex flex-col sm:flex-row gap-3 flex-1 md:justify-end">
            <input
              type="text"
              placeholder="Search Matric No or Course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border)] rounded text-sm bg-[var(--background)] focus:outline-none focus:border-[var(--foreground)] min-w-[200px]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border)] rounded text-sm bg-[var(--background)] focus:outline-none focus:border-[var(--foreground)]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Requires Review">Requires Review</option>
            </select>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-2 whitespace-nowrap"
            >
              {showAll ? "View Less ↑" : "View All →"}
            </button>
          </div>
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
              {isFetching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--foreground)] rounded-full animate-spin" />
                      Loading submissions...
                    </div>
                  </td>
                </tr>
              ) : displayedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] mb-4">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <h3 className="text-lg font-bold mb-1">Inbox Empty</h3>
                      <p className="text-[var(--muted)] text-sm">
                        No grade submissions match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{sub.matric}</td>
                    <td className="px-6 py-4">{sub.course}</td>
                    <td className="px-6 py-4">{sub.score}</td>
                    <td className="px-6 py-4 font-bold">{sub.grade}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          sub.status === "Approved"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : sub.status === "Pending Approval"
                            ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => {
                          setEditModalData(sub);
                          setNewScore(sub.score);
                        }}
                        className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {sub.status !== "Approved" && (
                        <button
                          onClick={() => setConfirmApproveId(sub.id)}
                          className="text-[var(--foreground)] font-medium hover:underline"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Approve Modal */}
      {confirmApproveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Confirm Approval</h3>
            <p className="text-[var(--muted)] text-sm mb-6">
              Are you sure you want to approve this grade? This action will securely
              lock the record and update the student's transcript immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmApproveId(null)}
                className="px-4 py-2 font-medium text-[var(--foreground)] rounded hover:bg-[var(--accent)]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded hover:opacity-90 transition-opacity"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Edit Score</h3>
            <p className="text-[var(--muted)] text-sm mb-6">
              Modify the raw score for{" "}
              <span className="font-mono">{editModalData.matric}</span> (
              {editModalData.course}). The curve grade will be automatically
              recalculated.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Raw Score (0–100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newScore}
                onChange={(e) =>
                  setNewScore(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full px-4 py-2 border border-[var(--border)] rounded focus:outline-none focus:border-[var(--foreground)] bg-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalData(null)}
                className="px-4 py-2 font-medium text-[var(--muted)] rounded hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}