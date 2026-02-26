import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "pg";
import prisma from "@/libs/prismaDB";

const FREE_DELAY_DAYS = 14;

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

  const { userId: clerkUserId } = await auth();
  let isEntitled = false;

  if (clerkUserId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { id: true },
      });

      if (user) {
        const access = await prisma.userBotAccess.findFirst({
          where: {
            userId: user.id,
            status: "ACTIVE",
            OR: [
              { source: "PREMIUM" },
              { AND: [{ source: "BOT_SUBSCRIPTION" }, { botId: bot }] },
              { AND: [{ source: "GRANT" }, { botId: bot }] },
            ],
          },
        });

        isEntitled = Boolean(access);
        console.log(`Entitlement check for user ${clerkUserId}, bot ${bot}: ${isEntitled}`);
      }
    } catch (err) {
      console.error("Error checking entitlements:", err);
      // Fall through to free tier on error
    }
  }

  let effectiveStart = start;
  let effectiveEnd = end;

  if (!isEntitled) {
    const cutoffDate = new Date();
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - FREE_DELAY_DAYS);
    const cutoff = cutoffDate.toISOString().slice(0, 10);

    if (start > cutoff) {
      return NextResponse.json([]);
    }

    if (end > cutoff) {
      effectiveEnd = cutoff;
    }
  }

  let client: Client | undefined;
  try {
    console.log(
      `Fetching equity data for bot: ${bot}, range: ${effectiveStart} to ${effectiveEnd}`
    );
    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 20000,
      statement_timeout: 30000,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    
    console.log("Attempting to connect to database...");
    await client.connect();
    console.log("Database connection successful");
    
    // Query 1: Get the starting equity value
    console.log(`Querying bot_equity for bot=${bot}, start=${effectiveStart}`);
    const startRes = await client.query(
      "SELECT equity FROM public.bot_equity WHERE bot_id = $1 AND d >= $2 ORDER BY d LIMIT 1",
      [bot, effectiveStart]
    );

    if (startRes.rows.length === 0) {
      console.log(
        `No equity data found for bot: ${bot} starting from ${effectiveStart}`
      );
      await client.end();
      return NextResponse.json([]);
    }

    const e0 = startRes.rows[0].equity;
    console.log(`Starting equity: ${e0}`);

    // Query 2: Get all data normalized by starting equity
    console.log(`Querying equity range for bot=${bot}, start=${effectiveStart}, end=${effectiveEnd}`);
    const res = await client.query(
      "SELECT d, equity / $3 AS equity, holdings FROM public.bot_equity WHERE bot_id = $1 AND d BETWEEN $2 AND $4 ORDER BY d",
      [bot, effectiveStart, e0, effectiveEnd]
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
      start: effectiveStart,
      end: effectiveEnd,
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
