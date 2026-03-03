import { NextResponse } from "next/server";
import { Client } from "pg";

type LeaderboardRow = {
  botId: string;
  returnPct: number;
};

type PeriodKey =
  | "lastDay"
  | "lastWeek"
  | "lastTwoWeeks"
  | "lastMonth"
  | "lastThreeMonths"
  | "ytd"
  | "lastYear";

const VALID_PERIODS: PeriodKey[] = [
  "lastDay",
  "lastWeek",
  "lastTwoWeeks",
  "lastMonth",
  "lastThreeMonths",
  "ytd",
  "lastYear",
];

function toDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getRange(period: PeriodKey) {
  const endDate = new Date();
  endDate.setUTCHours(0, 0, 0, 0);

  const startDate = new Date(endDate);

  switch (period) {
    case "lastDay":
      startDate.setUTCDate(startDate.getUTCDate() - 1);
      break;
    case "lastWeek":
      startDate.setUTCDate(startDate.getUTCDate() - 7);
      break;
    case "lastTwoWeeks":
      startDate.setUTCDate(startDate.getUTCDate() - 14);
      break;
    case "lastMonth":
      startDate.setUTCMonth(startDate.getUTCMonth() - 1);
      break;
    case "lastThreeMonths":
      startDate.setUTCMonth(startDate.getUTCMonth() - 3);
      break;
    case "ytd":
      startDate.setUTCMonth(0, 1);
      break;
    case "lastYear":
      startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
      break;
    default:
      startDate.setUTCDate(startDate.getUTCDate() - 14);
      break;
  }

  return {
    startDate: toDateString(startDate),
    endDate: toDateString(endDate),
  };
}

export async function GET(req: Request) {
  let client: Client | undefined;

  try {
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get("period") as PeriodKey | null;
    const period: PeriodKey =
      periodParam && VALID_PERIODS.includes(periodParam)
        ? periodParam
        : "lastTwoWeeks";

    const { startDate, endDate } = getRange(period);

    if (!process.env.DATABASE_URL) {
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

    await client.connect();

    const query = `
      WITH start_values AS (
        SELECT DISTINCT ON (be.bot_id)
          be.bot_id,
          be.equity AS start_equity
        FROM trading.bot_equity be
        WHERE be.d BETWEEN $1::date AND $2::date
        ORDER BY be.bot_id, be.d ASC
      ),
      end_values AS (
        SELECT DISTINCT ON (be.bot_id)
          be.bot_id,
          be.equity AS end_equity
        FROM trading.bot_equity be
        WHERE be.d BETWEEN $1::date AND $2::date
        ORDER BY be.bot_id, be.d DESC
      )
      SELECT
        s.bot_id,
        s.start_equity,
        e.end_equity,
        ((e.end_equity - s.start_equity) / NULLIF(s.start_equity, 0)) * 100 AS return_pct
      FROM start_values s
      JOIN end_values e ON e.bot_id = s.bot_id
      ORDER BY return_pct DESC NULLS LAST
      LIMIT 5;
    `;

    const result = await client.query(query, [startDate, endDate]);

    const leaderboard: LeaderboardRow[] = result.rows.map((row) => ({
      botId: row.bot_id,
      returnPct: Number(row.return_pct),
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error("Leaderboard API error:", details);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard", details },
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
