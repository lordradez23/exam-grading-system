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

// Expects JSON body parsed from CSV/XLSX on the client side
// Each row: { matricNo, courseCode, score, semester, session }
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== 'Faculty' && user.role !== 'Admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { rows: gradeRows } = await req.json();

  if (!Array.isArray(gradeRows) || gradeRows.length === 0)
    return NextResponse.json({ error: 'No data provided' }, { status: 400 });

  let inserted = 0;
  for (const row of gradeRows) {
    const { matricNo, courseCode, score, semester, session } = row;
    if (!matricNo || !courseCode || score === undefined) continue;

    const grade = scoreToGrade(Number(score));
    await pool.query(
      `INSERT INTO grades (matric_no, course_code, score, grade_letter, semester, session, submitted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [matricNo, courseCode, Number(score), grade, semester || '1st', session || '2023/2024', user.id]
    );
    inserted++;
  }

  return NextResponse.json({ success: true, inserted });
}