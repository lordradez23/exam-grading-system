import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user || (user.role !== 'Faculty' && user.role !== 'Admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { ids } = await req.json(); // array of grade_ids

  if (!ids?.length)
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });

  await pool.query(
    `UPDATE grades SET status = 'Approved', updated_at = NOW()
     WHERE grade_id = ANY($1::int[]) AND status != 'Approved'`,
    [ids]
  );

  return NextResponse.json({ success: true, count: ids.length });
}