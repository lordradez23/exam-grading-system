import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
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
          <ToastProvider>
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
