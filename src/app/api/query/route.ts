import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Block any write or destructive operations
const BLOCKED_KEYWORDS = [
  "insert", "update", "delete", "drop", "truncate",
  "alter", "create", "grant", "revoke", "pg_", "information_schema",
];

function isSafeQuery(sql: string): boolean {
  const lower = sql.toLowerCase();
  return !BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== "Faculty" && user.role !== "Admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { sql } = await req.json();

  if (!sql || typeof sql !== "string") {
    return NextResponse.json({ error: "No query provided." }, { status: 400 });
  }

  if (!isSafeQuery(sql)) {
    return NextResponse.json(
      { error: "Write operations are not permitted. This system is read-only." },
      { status: 403 }
    );
  }

  try {
    const { rows } = await pool.query(sql);
    return NextResponse.json({ rows });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Query execution failed." },
      { status: 400 }
    );
  }
}