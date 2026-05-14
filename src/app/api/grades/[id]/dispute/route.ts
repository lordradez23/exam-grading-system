import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = requireAuth(req);
  if (!user || user.role !== "Student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reason } = await req.json();
  if (!reason || reason.trim().length <= 5) {
    return NextResponse.json({ error: "Reason too short." }, { status: 400 });
  }

  const { id } = params;

  // Verify the grade belongs to this student
  const { rows } = await pool.query(
    `SELECT g.grade_id FROM grades g
     JOIN users u ON u.matric_no = g.matric_no
     WHERE g.grade_id = $1 AND u.id = $2`,
    [id, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Grade not found." }, { status: 404 });
  }

  // Update status to Requires Review
  await pool.query(
    `UPDATE grades SET status = 'Requires Review', updated_at = NOW() WHERE grade_id = $1`,
    [id]
  );

  // Log the dispute in audit_logs
  await pool.query(
    `INSERT INTO audit_logs (action, faculty_id, grade_id)
     VALUES ('DISPUTE', $1, $2)`,
    [user.id, id]
  );

  return NextResponse.json({ success: true });
}