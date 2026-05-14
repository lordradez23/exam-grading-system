import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center relative overflow-hidden">
      {/* Animated Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-[-40px] bg-grid-pattern animate-grid"></div>
      </div>

      {/* Hero Section */}
      <div id="dashboard" className="w-full max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-16 fade-in scroll-mt-24 relative z-10">
        {/* Text Content */}
        <div className="flex-1 space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[var(--muted)] text-sm font-medium uppercase tracking-widest">
            Veritas University Bwari
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
            Examination Grading & Processing System
          </h1>
          
          <p className="text-lg text-[var(--muted)] leading-relaxed max-w-xl">
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

          <div className="pt-12 mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[var(--border)]">
            <div>
              <div className="font-semibold text-[var(--foreground)]">Schema v2.4</div>
              <div className="text-xs text-[var(--muted)] mt-1">Current Database</div>
            </div>
            <div>
              <div className="font-semibold text-[var(--foreground)]">Active</div>
              <div className="text-xs text-[var(--muted)] mt-1">System Status</div>
            </div>
            <div>
              <div className="font-semibold text-[var(--foreground)]">2023/2024</div>
              <div className="text-xs text-[var(--muted)] mt-1">Academic Session</div>
            </div>
            <div>
              <div className="font-semibold text-[var(--foreground)]">Admin</div>
              <div className="text-xs text-[var(--muted)] mt-1">Support Contact</div>
            </div>
          </div>
        </div>

        {/* Realistic Dashboard Mockup */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">
          <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden hover-lift">
            {/* Dashboard Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5 flex justify-between items-center">
              <div className="font-semibold text-sm">Recent Grading Submissions</div>
              <Link href="/query" className="text-xs px-3 py-1 bg-[var(--foreground)] text-[var(--background)] rounded hover:opacity-90 transition-opacity">
                Run Query
              </Link>
            </div>
            
            {/* Dashboard Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--accent)]/5 text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Student ID</th>
                    <th className="px-6 py-3 font-medium">Course Code</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">VUB/20/CSC/045</td>
                    <td className="px-6 py-4">CSC 401</td>
                    <td className="px-6 py-4">78</td>
                    <td className="px-6 py-4 font-semibold">A</td>
                  </tr>
                  <tr className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">VUB/20/CSC/012</td>
                    <td className="px-6 py-4">CSC 401</td>
                    <td className="px-6 py-4">64</td>
                    <td className="px-6 py-4 font-semibold">B</td>
                  </tr>
                  <tr className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">VUB/20/CSC/089</td>
                    <td className="px-6 py-4">CSC 401</td>
                    <td className="px-6 py-4">45</td>
                    <td className="px-6 py-4 font-semibold">D</td>
                  </tr>
                  <tr className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">VUB/20/CSC/102</td>
                    <td className="px-6 py-4">CSC 401</td>
                    <td className="px-6 py-4">58</td>
                    <td className="px-6 py-4 font-semibold">C</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Dashboard Footer */}
            <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--accent)]/5 text-xs text-[var(--muted)] flex justify-between">
              <span>Showing 4 of 1,204 records</span>
              <div className="flex gap-2">
                <span className="px-2 cursor-pointer hover:text-[var(--foreground)]">Prev</span>
                <span className="px-2 cursor-pointer hover:text-[var(--foreground)]">Next</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full bg-[var(--accent)]/5 border-y border-[var(--border)] py-20 mt-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">Engineered to handle complex relational data queries while maintaining strict academic security standards.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-[var(--background)] border border-[var(--border)] rounded-xl hover-lift">
              <div className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M3 18h6"/><path d="M14 18h2"/><path d="M14 15h2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Grading</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">Instantly convert raw examination scores into final letter grades based on the university's approved grading curve and schema.</p>
            </div>
            
            <div className="p-6 bg-[var(--background)] border border-[var(--border)] rounded-xl hover-lift">
              <div className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Export & Reporting</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">Generate comprehensive senate reports, transcript queries, and broadsheet exports with a single click.</p>
            </div>

            <div className="p-6 bg-[var(--background)] border border-[var(--border)] rounded-xl hover-lift">
              <div className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Role-Based Security</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">Strict access control ensuring that students only view their own records, while faculty manage only their assigned courses.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Preview Section */}
      <div id="schema" className="w-full max-w-7xl mx-auto px-8 py-24 flex flex-col md:flex-row items-center gap-16 scroll-mt-24">
        <div className="flex-1 w-full bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-xl font-mono text-xs md:text-sm text-[var(--muted)] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 font-sans text-xs font-bold text-[var(--foreground)]">SCHEMA PREVIEW</div>
          <pre className="mt-4">
{`CREATE TABLE Students (
  matric_no VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  department_id INT,
  level INT NOT NULL
);

CREATE TABLE Grades (
  grade_id SERIAL PRIMARY KEY,
  matric_no VARCHAR(20) REFERENCES Students,
  course_code VARCHAR(10) NOT NULL,
  score INT CHECK (score >= 0 AND score <= 100),
  grade_letter CHAR(1),
  semester VARCHAR(10),
  session VARCHAR(10)
);`}
          </pre>
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold">Optimized Query System</h2>
          <p className="text-[var(--muted)] leading-relaxed">
            The backbone of the application is a highly relational, optimized database schema designed to handle thousands of concurrent read/write queries during peak examination periods without latency spikes.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span>Fully normalized to 3NF to prevent data anomalies</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span>Indexed queries for instant transcript generation</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span>ACID compliant transaction processing</span>
            </li>
          </ul>
          <div className="pt-4">
            <Link href="/schema" className="text-[var(--foreground)] font-semibold border-b border-[var(--foreground)] pb-1 hover:opacity-70 transition-opacity">
              View Full Documentation →
            </Link>
          </div>
        </div>
      </div>
      {/* Grading Workflow Section */}
      <div id="workflow" className="w-full bg-[var(--background)] py-24 scroll-mt-24 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Streamlined Grading Workflow</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">From exam submission to final senate approval, our platform completely digitizes the examination lifecycle.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-[var(--border)] z-0"></div>
            
            <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10 mb-12 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-2xl font-bold mb-6 shadow-lg text-[var(--foreground)]">1</div>
              <h3 className="text-xl font-bold mb-3">Input & Validation</h3>
              <p className="text-[var(--muted)] text-sm">Faculty upload raw scores or input directly. The system immediately validates entries against expected schema rules.</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10 mb-12 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-[var(--foreground)]/20 animate-pulse">2</div>
              <h3 className="text-xl font-bold mb-3">Curve Processing</h3>
              <p className="text-[var(--muted)] text-sm">Background cron jobs run heavy calculation queries, assigning letter grades based on normalized curves.</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-2xl font-bold mb-6 shadow-lg text-[var(--foreground)]">3</div>
              <h3 className="text-xl font-bold mb-3">Publish & Query</h3>
              <p className="text-[var(--muted)] text-sm">Approved grades are pushed to the student portal. Secure indexing enables sub-second transcript retrieval.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture Section */}
      <div id="security" className="w-full bg-[var(--accent)]/5 py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold">Academic-Grade Security Architecture</h2>
            <p className="text-lg text-[var(--muted)] leading-relaxed">
              Examination data integrity is paramount. VeritasGrades utilizes multiple layers of cryptographic security to prevent unauthorized access and data manipulation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="border border-[var(--border)] p-4 rounded-lg bg-[var(--background)]">
                <div className="font-bold mb-1">AES-256 Encryption</div>
                <div className="text-sm text-[var(--muted)]">All sensitive grade records are encrypted at rest.</div>
              </div>
              <div className="border border-[var(--border)] p-4 rounded-lg bg-[var(--background)]">
                <div className="font-bold mb-1">JWT Authentication</div>
                <div className="text-sm text-[var(--muted)]">Stateless, time-limited token architecture.</div>
              </div>
              <div className="border border-[var(--border)] p-4 rounded-lg bg-[var(--background)]">
                <div className="font-bold mb-1">Immutable Audit Logs</div>
                <div className="text-sm text-[var(--muted)]">Every grade change leaves a permanent digital footprint.</div>
              </div>
              <div className="border border-[var(--border)] p-4 rounded-lg bg-[var(--background)]">
                <div className="font-bold mb-1">Row-Level Security</div>
                <div className="text-sm text-[var(--muted)]">Database limits data access directly at the query level.</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md relative hover-lift">
             <div className="absolute inset-0 bg-[var(--muted)] opacity-5 blur-3xl rounded-full"></div>
             <div className="relative border border-[var(--border)] rounded-2xl bg-[var(--background)] p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                 <div className="font-mono text-sm font-bold">SECURITY_AUDIT.LOG</div>
                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
               </div>
               <div className="space-y-3 font-mono text-xs text-[var(--muted)]">
                 <div className="flex gap-4"><span className="text-[var(--foreground)]">10:42:01</span><span>[AUTH] Faculty login successful</span></div>
                 <div className="flex gap-4"><span className="text-[var(--foreground)]">10:43:15</span><span>[DB_LOCK] Acquiring write lock on 'Grades'</span></div>
                 <div className="flex gap-4"><span className="text-[var(--foreground)]">10:43:16</span><span>[UPDATE] Modifying record VUB/20/CSC/045</span></div>
                 <div className="flex gap-4"><span className="text-[var(--foreground)]">10:43:16</span><span>[HASH] Verifying checksum integrity</span></div>
                 <div className="flex gap-4 text-green-600"><span className="text-[var(--foreground)]">10:43:17</span><span>[SUCCESS] Transaction committed</span></div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer (Only on Landing Page) */}
      <footer className="w-full bg-[var(--background)] border-t border-[var(--border)] pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/#dashboard" className="font-bold text-xl tracking-tight block">VERITAS<span className="text-[var(--muted)]">GRADES</span></Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm">
              The official centralized portal for faculty and administrators to securely manage student records, process examination scores, and query academic data at Veritas University.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">Faculty Dashboard</Link></li>
              <li><Link href="/student" className="hover:text-[var(--foreground)] transition-colors">Student Portal</Link></li>
              <li><Link href="/query" className="hover:text-[var(--foreground)] transition-colors">Query System</Link></li>
              <li><Link href="/schema" className="hover:text-[var(--foreground)] transition-colors">Database Schema</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">University Support</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">IT Help Desk</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Senate Guidelines</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Contact Admin</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--muted)]">
          <p>&copy; {new Date().getFullYear()} Veritas University, Bwari. Final Year Project.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Data Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
