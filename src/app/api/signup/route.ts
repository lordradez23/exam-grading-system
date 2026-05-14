import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password, role, matricNo, department, level, courses } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  // Check duplicate email
  const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.length > 0)
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);

  // Get or create department
  let departmentId = null;
  if (department) {
    const { rows: deptRows } = await pool.query(
      'INSERT INTO departments (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING department_id', 
      [department]
    );
    if (deptRows.length > 0) {
      departmentId = deptRows[0].department_id;
    } else {
      const { rows: found } = await pool.query('SELECT department_id FROM departments WHERE name = $1', [department]);
      departmentId = found[0]?.department_id;
    }
  }

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, matric_no, department_id, level)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [name, email.toLowerCase(), hash, role || 'Student', matricNo || null, departmentId, level || null]
  );

  const userId = rows[0].id;

  // Enroll in courses
  if (courses?.length && matricNo) {
    for (const code of courses) {
      // Insert course if it doesn't exist yet
      await pool.query(
        `INSERT INTO courses (course_code, course_title, credit_units)
         VALUES ($1, $2, 3) ON CONFLICT DO NOTHING`,
        [code, code]
      );
      await pool.query(
        `INSERT INTO enrollments (matric_no, course_code) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [matricNo, code]
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}