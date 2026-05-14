import BackButton from "@/components/BackButton";

export default function Schema() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 fade-in">
      <BackButton />
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Database Schema Documentation</h1>
        <p className="text-[var(--muted)] max-w-3xl">
          Complete entity-relationship details for the VeritasGrades academic system. This schema is fully normalized to the Third Normal Form (3NF) to ensure data integrity during parallel grading processes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Core Tables */}
        <div className="space-y-12">
          {/* Students Table */}
          <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg hover-lift">
            <div className="bg-[var(--accent)]/5 px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-mono font-bold">TABLE: Students</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Core student profile and demographic data.</p>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="pb-3 font-medium">Column</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                  <tr><td className="py-3 text-[var(--foreground)]">matric_no</td><td className="py-3">VARCHAR(20)</td><td className="py-3 text-orange-600">PRIMARY KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">first_name</td><td className="py-3">VARCHAR(50)</td><td className="py-3">NOT NULL</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">last_name</td><td className="py-3">VARCHAR(50)</td><td className="py-3">NOT NULL</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">department_id</td><td className="py-3">INT</td><td className="py-3 text-blue-600">FOREIGN KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">level</td><td className="py-3">INT</td><td className="py-3">NOT NULL</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Courses Table */}
          <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg hover-lift">
            <div className="bg-[var(--accent)]/5 px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-mono font-bold">TABLE: Courses</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Academic course catalog and credit unit weights.</p>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="pb-3 font-medium">Column</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                  <tr><td className="py-3 text-[var(--foreground)]">course_code</td><td className="py-3">VARCHAR(10)</td><td className="py-3 text-orange-600">PRIMARY KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">course_title</td><td className="py-3">VARCHAR(100)</td><td className="py-3">NOT NULL</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">credit_units</td><td className="py-3">INT</td><td className="py-3">CHECK (&gt;0)</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">department_id</td><td className="py-3">INT</td><td className="py-3 text-blue-600">FOREIGN KEY</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transaction Tables */}
        <div className="space-y-12">
          {/* Grades Table */}
          <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg hover-lift border-l-4 border-l-[var(--foreground)]">
            <div className="bg-[var(--accent)]/5 px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-mono font-bold text-[var(--foreground)]">TABLE: Grades</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Transactional table linking students to courses with scores.</p>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="pb-3 font-medium">Column</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                  <tr><td className="py-3 text-[var(--foreground)]">grade_id</td><td className="py-3">SERIAL</td><td className="py-3 text-orange-600">PRIMARY KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">matric_no</td><td className="py-3">VARCHAR(20)</td><td className="py-3 text-blue-600">FOREIGN KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">course_code</td><td className="py-3">VARCHAR(10)</td><td className="py-3 text-blue-600">FOREIGN KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">score</td><td className="py-3">INT</td><td className="py-3">CHECK (0-100)</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">grade_letter</td><td className="py-3">CHAR(1)</td><td className="py-3">COMPUTED</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">semester</td><td className="py-3">VARCHAR(10)</td><td className="py-3">NOT NULL</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">session</td><td className="py-3">VARCHAR(10)</td><td className="py-3">NOT NULL</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-[var(--border)] rounded-xl bg-[var(--background)] overflow-hidden shadow-lg hover-lift">
            <div className="bg-[var(--accent)]/5 px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
              <div>
                <h2 className="font-mono font-bold">TABLE: Audit_Logs</h2>
                <p className="text-xs text-[var(--muted)] mt-1">Immutable security ledger for changes.</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="pb-3 font-medium">Column</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                  <tr><td className="py-3 text-[var(--foreground)]">log_id</td><td className="py-3">UUID</td><td className="py-3 text-orange-600">PRIMARY KEY</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">action</td><td className="py-3">VARCHAR</td><td className="py-3">INSERT/UPDATE</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">faculty_id</td><td className="py-3">VARCHAR</td><td className="py-3">Triggered By</td></tr>
                  <tr><td className="py-3 text-[var(--foreground)]">timestamp</td><td className="py-3">TIMESTAMP</td><td className="py-3">DEFAULT NOW()</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
