import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function scoreToGrade(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  return "F";
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== "Faculty" && user.role !== "Admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { rows: gradeRows } = await req.json();

  if (!Array.isArray(gradeRows) || gradeRows.length === 0) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  let inserted = 0;

  for (const row of gradeRows) {
    const { matricNo, courseCode, score, semester, session } = row;
    if (!matricNo || !courseCode || score === undefined) continue;

    // 1. Ensure course exists
    await pool.query(
      `INSERT INTO courses (course_code, course_title, credit_units)
       VALUES ($1, $2, 3)
       ON CONFLICT (course_code) DO NOTHING`,
      [courseCode, courseCode]
    );

    // 2. Ensure a placeholder student user exists for this matric number
    //    (so the foreign key on grades.matric_no is satisfied)
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, matric_no)
       VALUES ($1, $2, 'placeholder', 'Student', $3)
       ON CONFLICT (matric_no) DO NOTHING`,
      [
        matricNo,                                         // name = matric for now
        `${matricNo.replace(/\//g, ".")}@veritas.edu`,   // unique dummy email
        matricNo,
      ]
    );

    // 3. Insert the grade
    await pool.query(
      `INSERT INTO grades (matric_no, course_code, score, grade_letter, semester, session, submitted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        matricNo,
        courseCode,
        Number(score),
        scoreToGrade(Number(score)),
        semester || "1st",
        session  || "2023/2024",
        user.id,
      ]
    );

    inserted++;
  }

  return NextResponse.json({ success: true, inserted });
}