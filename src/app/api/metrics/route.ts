import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== 'Faculty' && user.role !== 'Admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [students, processed, pending] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM users WHERE role = 'Student'`),
    pool.query(`SELECT COUNT(*) FROM grades WHERE status = 'Approved'`),
    pool.query(`SELECT COUNT(*) FROM grades WHERE status != 'Approved'`),
  ]);

  return NextResponse.json({
    totalStudents: parseInt(students.rows[0].count),
    gradesProcessed: parseInt(processed.rows[0].count),
    pendingApprovals: parseInt(pending.rows[0].count),
  });
}