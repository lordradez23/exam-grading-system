import BackButton from "@/components/BackButton";

export default function Processing() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 fade-in">
      <BackButton />
      <h1 className="text-4xl font-bold mb-4">Grading Processing</h1>
      <p className="text-[var(--muted)]">Automate calculation and processing of examination scores and grading curves.</p>
      <div className="mt-8 p-8 border border-[var(--border)] rounded-xl bg-[var(--accent)]/5 flex justify-center">
        <button className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded hover:opacity-90 transition-opacity">
          Initialize Batch Processing
        </button>
      </div>
    </div>
  );
}
