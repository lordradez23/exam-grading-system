"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

export default function QuerySystem() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("SELECT * FROM grades WHERE course_code = 'CSC 401';");
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

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
    return <div className="p-20 text-center text-[var(--muted)]">Checking permissions...</div>;
  }

  const predefinedQueries = [
    { label: "All grades in CSC 401", sql: "SELECT * FROM grades WHERE course_code = 'CSC 401';" },
    { label: "Students with A grades", sql: "SELECT matric_no, course_code FROM grades WHERE grade = 'A';" },
    { label: "Count students per course", sql: "SELECT course_code, COUNT(matric_no) FROM grades GROUP BY course_code;" },
    { label: "Pending Approvals", sql: "SELECT * FROM grades WHERE status = 'Pending Approval';" },
  ];

  const handleRunQuery = () => {
    setIsExecuting(true);
    setResults(null);
    
    // Simulate network and database latency
    setTimeout(() => {
      // Mock Data Engine based on query text
      const lowerQuery = query.toLowerCase();
      let mockResults: any[] = [];
      
      if (lowerQuery.includes("count")) {
        mockResults = [
          { course_code: "CSC 401", count: 145 },
          { course_code: "CSC 411", count: 132 },
          { course_code: "MTH 401", count: 210 },
        ];
      } else if (lowerQuery.includes("grade = 'a'") || lowerQuery.includes("grade = 'A'")) {
        mockResults = [
          { matric_no: "VUB/20/CSC/045", course_code: "CSC 401", score: 85, grade: "A" },
          { matric_no: "VUB/20/CSC/023", course_code: "CSC 499", score: 88, grade: "A" },
          { matric_no: "VUB/21/CSC/001", course_code: "CSC 411", score: 92, grade: "A" },
        ];
      } else if (lowerQuery.includes("pending")) {
        mockResults = [
          { grade_id: "104", matric_no: "VUB/20/CSC/045", course_code: "CSC 401", status: "Pending Approval" },
          { grade_id: "105", matric_no: "VUB/20/CSC/088", course_code: "CSC 401", status: "Pending Approval" },
        ];
      } else {
        mockResults = [
          { grade_id: "1", matric_no: "VUB/20/CSC/045", course_code: "CSC 401", score: 85, grade: "A" },
          { grade_id: "2", matric_no: "VUB/20/CSC/088", course_code: "CSC 401", score: 71, grade: "B" },
          { grade_id: "3", matric_no: "VUB/20/CSC/102", course_code: "CSC 401", score: 55, grade: "C" },
          { grade_id: "4", matric_no: "VUB/20/CSC/004", course_code: "CSC 401", score: 40, grade: "E" },
        ];
      }
      
      setResults(mockResults);
      setIsExecuting(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12 fade-in">
      <BackButton />
      
      <div className="mb-12 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold mb-2">Examination Query System</h1>
        <p className="text-[var(--muted)]">Execute SQL-like queries against the normalized grading database.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Predefined Queries */}
        <div className="w-full lg:w-1/4">
          <h3 className="font-semibold mb-4">Query Templates</h3>
          <div className="space-y-2">
            {predefinedQueries.map((pq, idx) => (
              <button 
                key={idx}
                onClick={() => setQuery(pq.sql)}
                className="w-full text-left p-3 text-sm rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]/5 hover:border-[var(--foreground)] transition-colors"
              >
                {pq.label}
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-600">
            <strong>Security Notice:</strong> All queries are executed with read-only permissions. Row-Level Security (RLS) is active.
          </div>
        </div>

        {/* Right Main: Editor and Results */}
        <div className="w-full lg:w-3/4 space-y-6">
          
          {/* Editor */}
          <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-lg">
            <div className="bg-[#1e1e1e] px-4 py-2 flex items-center border-b border-[#333]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-[#888] text-xs font-mono">sql_terminal</div>
            </div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-40 p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm focus:outline-none resize-none"
              spellCheck="false"
            ></textarea>
            <div className="bg-[var(--background)] border-t border-[var(--border)] p-4 flex justify-between items-center">
              <span className="text-xs text-[var(--muted)]">Execution time limit: 30s</span>
              <button 
                onClick={handleRunQuery}
                disabled={isExecuting || !query.trim()}
                className={`px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded text-sm transition-opacity ${isExecuting || !query.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isExecuting ? 'Executing...' : 'Run Query ⚡'}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg min-h-[300px]">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5 flex justify-between items-center">
              <h2 className="font-semibold">Query Results</h2>
              {results && <span className="text-xs font-mono text-[var(--muted)]">{results.length} rows returned</span>}
            </div>
            
            <div className="p-6 overflow-x-auto">
              {!results && !isExecuting && (
                <div className="h-40 flex items-center justify-center text-[var(--muted)]">
                  Enter a query and press Run to see results.
                </div>
              )}
              
              {isExecuting && (
                <div className="h-40 flex flex-col items-center justify-center text-[var(--muted)] space-y-4">
                  <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--foreground)] rounded-full animate-spin"></div>
                  <div className="text-sm font-mono animate-pulse">Running sequential scan...</div>
                </div>
              )}
              
              {results && results.length > 0 && !isExecuting && (
                <table className="w-full text-sm text-left">
                  <thead className="text-[var(--muted)] border-b border-[var(--border)]">
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="pb-3 font-medium capitalize">{key.replace('_', ' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                    {results.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--accent)]/5 transition-colors">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="py-3">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {results && results.length === 0 && !isExecuting && (
                <div className="h-40 flex items-center justify-center text-[var(--muted)]">
                  0 rows returned.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
