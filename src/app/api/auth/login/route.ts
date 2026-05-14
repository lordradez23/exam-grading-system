import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { rows } = await pool.query(
    `SELECT u.*, d.name as department_name FROM users u
     LEFT JOIN departments d ON u.department_id = d.department_id
     WHERE u.email = $1`,
    [email.toLowerCase()]
  );

  const user = rows[0];
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  // Get enrolled courses if student
  let courses: string[] = [];
  if (user.role === 'Student' && user.matric_no) {
    const { rows: enrollments } = await pool.query(
      'SELECT course_code FROM enrollments WHERE matric_no = $1',
      [user.matric_no]
    );
    courses = enrollments.map((e: any) => e.course_code);
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      matricNo: user.matric_no,
      department: user.department_name,
      level: user.level,
      courses,
    },
  });
}