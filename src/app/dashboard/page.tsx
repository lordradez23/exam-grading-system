"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";
import { useToast } from "@/context/ToastContext";

export default function FacultyDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Data State
  const [recentSubmissions, setRecentSubmissions] = useState([
    { id: "1", matric: "VUB/20/CSC/045", course: "CSC 401", score: 85, grade: "A", status: "Pending Approval" },
    { id: "2", matric: "VUB/20/CSC/012", course: "CSC 411", score: 62, grade: "C", status: "Approved" },
    { id: "3", matric: "VUB/20/CSC/088", course: "CSC 401", score: 71, grade: "B", status: "Pending Approval" },
    { id: "4", matric: "VUB/20/CSC/023", course: "CSC 499", score: 88, grade: "A", status: "Approved" },
    { id: "5", matric: "VUB/20/CSC/056", course: "CSC 411", score: 45, grade: "D", status: "Requires Review" },
  ]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file processing and upload delay
      setTimeout(() => {
        setIsUploading(false);
        toast(`Successfully processed ${file.name}. Grades have been uploaded!`, "success");
        // Reset the input so the same file can be uploaded again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1500);
    }
  };

  const handleConfirmApprove = () => {
    if (confirmApproveId) {
      // Optimistically update the state to "Approved"
      setRecentSubmissions(prev => 
        prev.map(sub => sub.id === confirmApproveId ? { ...sub, status: "Approved" } : sub)
      );
      toast("Grade successfully approved and locked.", "success");
      setConfirmApproveId(null);
    }
  };

  if (isLoading || !user || (user.role !== "Admin" && user.role !== "Faculty")) {
    return <div className="p-20 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-[var(--muted)]">Welcome back, {user.name}. Here is your academic overview.</p>
        </div>
        <div className="flex gap-4">
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
            className={`px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded text-sm transition-opacity ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {isUploading ? 'Uploading...' : '+ Upload Batch Grades'}
          </button>
          <LogoutButton />
        </div>
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
              {recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] mb-4">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <h3 className="text-lg font-bold mb-1">Inbox Empty</h3>
                      <p className="text-[var(--muted)] text-sm">No pending grade submissions require your attention right now.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentSubmissions.map((sub) => (
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

      {/* Confirmation Modal */}
      {confirmApproveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Confirm Approval</h3>
            <p className="text-[var(--muted)] text-sm mb-6">
              Are you sure you want to approve this grade? This action will securely lock the record and update the student's transcript immediately.
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
    </div>
  );
}
