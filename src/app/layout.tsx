import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
export const metadata: Metadata = {
  title: "Veritas University | Examination Grading & Query System",
  description: "A secure, efficient database scheme and query system for student examination grading and processing at Veritas University, Bwari.",
  keywords: ["Veritas University", "Grading System", "Database Scheme", "Query System", "Student Examination", "Academic Portal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]"
        style={{ '--font-inter': '"Inter", sans-serif', '--font-geist-mono': 'monospace' } as React.CSSProperties}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center">
            {children}
          </main>
          <footer className="w-full bg-[var(--background)] border-t border-[var(--border)] pt-16 pb-8">
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
        </AuthProvider>
      </body>
    </html>
  );
}
