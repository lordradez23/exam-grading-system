import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

function scoreToGrade(score: number): string {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user || (user.role !== 'Faculty' && user.role !== 'Admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { score, action } = await req.json();
  const { id } = params;

  if (action === 'approve') {
    await pool.query(
      `UPDATE grades SET status = 'Approved', updated_at = NOW() WHERE grade_id = $1`,
      [id]
    );
    await pool.query(
      `INSERT INTO audit_logs (action, faculty_id, grade_id) VALUES ('APPROVE', $1, $2)`,
      [user.id, id]
    );
    return NextResponse.json({ success: true });
  }

  if (score !== undefined) {
    const { rows: old } = await pool.query('SELECT score FROM grades WHERE grade_id = $1', [id]);
    const oldScore = old[0]?.score;
    const newGrade = scoreToGrade(score);

    await pool.query(
      `UPDATE grades SET score = $1, grade_letter = $2, status = 'Pending Approval', updated_at = NOW()
       WHERE grade_id = $3`,
      [score, newGrade, id]
    );
    await pool.query(
      `INSERT INTO audit_logs (action, faculty_id, grade_id, old_score, new_score)
       VALUES ('UPDATE', $1, $2, $3, $4)`,
      [user.id, id, oldScore, score]
    );
    return NextResponse.json({ success: true, grade: newGrade });
  }

  return NextResponse.json({ error: 'No action specified' }, { status: 400 });
}