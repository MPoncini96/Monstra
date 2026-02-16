import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bot: string }> }
) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const { bot } = await params;

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Get equity at start date (for normalization)
    const startRes = await client.query(
      `
      SELECT equity
      FROM bot_equity
      WHERE bot_id = $1 AND d >= $2
      ORDER BY d
      LIMIT 1
      `,
      [bot, start]
    );

    if (startRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const e0 = startRes.rows[0].equity;

    const res = await client.query(
      `
      SELECT
        d,
        equity / $3 AS equity
      FROM bot_equity
      WHERE bot_id = $1
        AND d BETWEEN $2 AND $4
      ORDER BY d
      `,
      [bot, start, e0, end]
    );

    return NextResponse.json(res.rows);
  } finally {
    client.release();
  }
}
