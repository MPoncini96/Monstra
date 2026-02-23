import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

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

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    return NextResponse.json(
      { error: "Database not configured", details: "DATABASE_URL is missing" },
      { status: 500 }
    );
  }

  let client: Client | undefined;
  try {
    console.log(`Fetching equity data for bot: ${bot}, range: ${start} to ${end}`);
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 20000,
      statement_timeout: 30000,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    
    // Query 1: Get the starting equity value
    const startRes = await client.query(
      "SELECT equity FROM bot_equity WHERE bot_id = $1 AND d >= $2 ORDER BY d LIMIT 1",
      [bot, start]
    );

    if (startRes.rows.length === 0) {
      console.log(`No equity data found for bot: ${bot} starting from ${start}`);
      await client.end();
      return NextResponse.json([]);
    }

    const e0 = startRes.rows[0].equity;
    console.log(`Starting equity: ${e0}`);

    // Query 2: Get all data normalized by starting equity
    const res = await client.query(
      "SELECT d, equity / $3 AS equity FROM bot_equity WHERE bot_id = $1 AND d BETWEEN $2 AND $4 ORDER BY d",
      [bot, start, e0, end]
    );

    console.log(`Returned ${res.rows.length} equity records for bot: ${bot}`);
    await client.end();
    return NextResponse.json(res.rows);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error("Bot equity API error:", {
      message: errorMessage,
      stack: errorStack,
      bot,
      start,
      end,
      hasDatabase: !!process.env.DATABASE_URL
    });
    return NextResponse.json(
      { error: "Failed to fetch bot equity data", details: errorMessage },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
}
