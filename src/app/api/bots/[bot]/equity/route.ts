import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type HoldingsValue = Record<string, unknown> | string | null | undefined;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const parseHoldingsObject = (value: HoldingsValue): Record<string, unknown> => {
  if (!value) return {};

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }

  return typeof value === "object" ? value : {};
};

const extractNumericHoldings = (value: HoldingsValue): Record<string, number> => {
  const parsed = parseHoldingsObject(value);

  const topLevel = Object.entries(parsed)
    .filter(([key, val]) => !key.startsWith("_") && isFiniteNumber(val))
    .reduce<Record<string, number>>((acc, [key, val]) => {
      acc[key] = val as number;
      return acc;
    }, {});

  if (Object.keys(topLevel).length > 0) {
    return topLevel;
  }

  const payload = parsed._payload;
  if (payload && typeof payload === "object") {
    const targetWeights = (payload as Record<string, unknown>).target_weights;
    if (targetWeights && typeof targetWeights === "object") {
      return Object.entries(targetWeights as Record<string, unknown>)
        .filter(([, val]) => isFiniteNumber(val))
        .reduce<Record<string, number>>((acc, [key, val]) => {
          acc[key] = val as number;
          return acc;
        }, {});
    }
  }

  return {};
};

const isCarryForwardRow = (value: HoldingsValue): boolean => {
  const parsed = parseHoldingsObject(value);
  const note = String(parsed._note ?? "").toLowerCase();
  if (note.includes("carry forward")) {
    return true;
  }

  const payload = parsed._payload;
  if (payload && typeof payload === "object") {
    const payloadObj = payload as Record<string, unknown>;
    const riskReason = String(payloadObj.risk_reason ?? "").toLowerCase();
    const rebalancedToday = payloadObj.rebalanced_today;
    if (riskReason === "carry_forward" || rebalancedToday === false) {
      return true;
    }
  }

  return false;
};

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

  let effectiveStart = start;
  let effectiveEnd = end;

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
    console.log(`Querying trading.bot_equity for bot=${bot}, start=${effectiveStart}`);
    const startRes = await client.query(
      "SELECT equity FROM trading.bot_equity WHERE bot_id = $1 AND d >= $2 ORDER BY d LIMIT 1",
      [bot, effectiveStart]
    );

    if (startRes.rows.length === 0) {
      console.log(
        `No equity data found for bot: ${bot} starting from ${effectiveStart}`
      );
      return NextResponse.json([]);
    }

    const e0 = Number(startRes.rows[0].equity);
    if (!Number.isFinite(e0) || e0 === 0) {
      throw new Error(`Invalid starting equity value: ${String(startRes.rows[0].equity)}`);
    }
    console.log(`Starting equity: ${e0}`);

    // Query 2: Get all data normalized by starting equity
    console.log(`Querying equity range for bot=${bot}, start=${effectiveStart}, end=${effectiveEnd}`);
    const res = await client.query(
      "SELECT d, equity / $3::double precision AS equity, holdings FROM trading.bot_equity WHERE bot_id = $1 AND d BETWEEN $2 AND $4 ORDER BY d",
      [bot, effectiveStart, e0, effectiveEnd]
    );

    const normalizedRows = res.rows.map((row) => ({ ...row }));
    let lastKnownHoldings: Record<string, number> = {};

    for (const row of normalizedRows) {
      const extracted = extractNumericHoldings(row.holdings);
      if (Object.keys(extracted).length > 0) {
        row.holdings = extracted;
        lastKnownHoldings = extracted;
        continue;
      }

      if (isCarryForwardRow(row.holdings) && Object.keys(lastKnownHoldings).length > 0) {
        row.holdings = lastKnownHoldings;
      } else {
        row.holdings = extracted;
      }
    }

    console.log(`Returned ${normalizedRows.length} equity records for bot: ${bot}`);
    return NextResponse.json(normalizedRows, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
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
