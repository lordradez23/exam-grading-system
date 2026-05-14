import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  if (user.role === 'Student') {
    const { rows } = await pool.query(
      `SELECT g.*, u.name FROM grades g
       JOIN users u ON u.matric_no = g.matric_no
       WHERE g.matric_no = (SELECT matric_no FROM users WHERE id = $1)`,
      [user.id]
    );
    return NextResponse.json(rows);
  }

  // Faculty / Admin
  let query = `SELECT g.grade_id as id, g.matric_no as matric, g.course_code as course,
                      g.score, g.grade_letter as grade, g.status
               FROM grades g WHERE 1=1`;
  const params: any[] = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (g.matric_no ILIKE $${params.length} OR g.course_code ILIKE $${params.length})`;
  }
  if (status && status !== 'All') {
    params.push(status);
    query += ` AND g.status = $${params.length}`;
  }

  query += ' ORDER BY g.updated_at DESC';
  const { rows } = await pool.query(query, params);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== 'Faculty' && user.role !== 'Admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { matricNo, courseCode, score, semester, session } = await req.json();

  const gradeLetter = scoreToGrade(score);

  const { rows } = await pool.query(
    `INSERT INTO grades (matric_no, course_code, score, grade_letter, semester, session, submitted_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [matricNo, courseCode, score, gradeLetter, semester, session, user.id]
  );

  return NextResponse.json(rows[0], { status: 201 });
}

function scoreToGrade(score: number): string {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}