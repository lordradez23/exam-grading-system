"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back
    </button>
  );
}
