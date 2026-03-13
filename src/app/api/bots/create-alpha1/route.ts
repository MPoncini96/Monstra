import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const claims = (sessionClaims ?? {}) as Record<string, unknown>;
  const usernameFromClaims =
    (typeof claims.username === "string" && claims.username) ||
    (typeof claims.preferred_username === "string" && claims.preferred_username) ||
    (typeof claims.email === "string" && claims.email.split("@")[0]) ||
    userId;
  const username = String(usernameFromClaims).trim();

  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    botName,
    description,
    tickers,
    safetyNetEquity,
    lookback,
    portfolioSize,
    weights,
  } = body as {
    botName: string;
    description: string;
    tickers: string[];
    safetyNetEquity: string;
    lookback: string;
    portfolioSize: string;
    weights: number[];
  };

  if (!botName || !tickers?.length || !portfolioSize || !weights?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Derive bot_id: lowercase, spaces → hyphens, strip non-alphanumeric except hyphens
  const botId = botName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const topN = Math.min(parseInt(portfolioSize, 10), weights.length);
  const lookbackDays = parseInt(lookback, 10) || 60;

  // Convert percentage weights to fractions, take top topN, normalise
  const rawFractions = weights.slice(0, topN).map((w) => Number(w) / 100);
  const total = rawFractions.reduce((s, v) => s + v, 0);
  const rankWeights = total > 0
    ? rawFractions.map((v) => Math.round((v / total) * 10000) / 10000)
    : rawFractions;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  let client: Client | undefined;
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 20000,
      statement_timeout: 30000,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    // Respect origin column length constraints if present
    const originInfo = await client.query(
      `SELECT character_maximum_length
       FROM information_schema.columns
       WHERE table_schema = 'trading'
         AND table_name = 'alpha1'
         AND column_name = 'origin'`
    );
    const maxOriginLen: number | null = originInfo.rows[0]?.character_maximum_length ?? null;
    const origin = maxOriginLen ? username.slice(0, maxOriginLen) : username;

    // Check for duplicate bot_id
    const existing = await client.query(
      "SELECT bot_id FROM trading.alpha1 WHERE bot_id = $1",
      [botId]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: `A bot with id "${botId}" already exists.` },
        { status: 409 }
      );
    }

    const insertParams = [
      botId,
      botName,
      description || "",
      JSON.stringify(tickers),
      safetyNetEquity || "VOO",
      topN,
      JSON.stringify(rankWeights),
      lookbackDays,
      `${lookbackDays}d`,
      "1d",
      origin,
    ];

    try {
      await client.query(
        `INSERT INTO trading.alpha1 (
          bot_id, name, description, universe, cash_equivalent,
          top_n, rank_weights, lookback_days, history_period, interval,
          is_active, origin, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4::jsonb, $5,
          $6, $7::jsonb, $8, $9, $10,
          true, $11, now(), now()
        )`,
        insertParams
      );
    } catch (insertErr) {
      const code = (insertErr as { code?: string }).code;
      const message = (insertErr as { message?: string }).message ?? "";

      // Backward compatibility for schemas that use `weights` instead of `rank_weights`
      if (code === "42703" && message.includes("rank_weights")) {
        await client.query(
          `INSERT INTO trading.alpha1 (
            bot_id, name, description, universe, cash_equivalent,
            top_n, weights, lookback_days, history_period, interval,
            is_active, origin, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4::jsonb, $5,
            $6, $7::jsonb, $8, $9, $10,
            true, $11, now(), now()
          )`,
          insertParams
        );
      } else {
        throw insertErr;
      }
    }

    return NextResponse.json({ success: true, botId });
  } catch (err) {
    console.error("create-alpha1 error", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (closeErr) {
        console.error("create-alpha1 close error", closeErr);
      }
    }
  }
}
