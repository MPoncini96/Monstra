import { auth } from "@clerk/nextjs/server";
import { Client } from "pg";
import Link from "next/link";
import prisma from "@/libs/prismaDB";
import { ensureSubscriptionsTable } from "@/libs/subscriptionsTable";

type BotRow = {
  bot_id: string;
  name: string;
};

const DEFAULT_BOT_NAMES: Record<string, string> = {
  bellator: "Bellator",
  cyclus: "Cyclus",
  imperium: "Imperium",
  medicus: "Medicus",
  vectura: "Vectura",
  viator: "Viator",
  vis: "Vis",
};

async function getCreatedBots(username: string | null, userId: string): Promise<BotRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000,
    statement_timeout: 30000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const origins = [userId, username].filter((v): v is string => Boolean(v && v.trim()));
    if (origins.length === 0) return [];

    const result = await client.query(
      `SELECT bot_id, COALESCE(NULLIF(name, ''), bot_id) AS name
       FROM trading.alpha1
       WHERE origin = ANY($1::text[])
       ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, bot_id ASC`,
      [origins]
    );

    return result.rows as BotRow[];
  } catch {
    return [];
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function getSubscribedBots(userId: string): Promise<BotRow[]> {
  await ensureSubscriptionsTable();

  const subscriptions = await prisma.$queryRawUnsafe<Array<{ bot_id: string }>>(
    `SELECT bot_id
     FROM app.subscriptions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    userId
  );

  return subscriptions.map((subscription) => {
    const botId = subscription.bot_id;
    const defaultName = DEFAULT_BOT_NAMES[botId];

    return {
      bot_id: botId,
      name: defaultName ?? botId,
    };
  });
}

function BotGrid({ bots }: { bots: BotRow[] }) {
  if (!bots.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/60">
        No bots found yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bots.map((bot) => (
        <Link
          key={`${bot.bot_id}-${bot.name}`}
          href={`/bots/${bot.bot_id}`}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/30 text-sm text-white/40">
            Image Placeholder
          </div>
          <h2 className="mt-3 text-base font-medium text-white">{bot.name}</h2>
        </Link>
      ))}
    </div>
  );
}

export default async function MyBotsPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return (
      <section className="mx-auto max-w-[1170px] px-4 pb-20 pt-32 sm:px-8 xl:px-0">
        <p className="text-white/70">Please sign in to view your bots.</p>
      </section>
    );
  }

  const claims = (sessionClaims ?? {}) as Record<string, unknown>;
  const username =
    (typeof claims.username === "string" && claims.username) ||
    (typeof claims.preferred_username === "string" && claims.preferred_username) ||
    null;

  const [createdBots, subscribedBots] = await Promise.all([
    getCreatedBots(username, userId),
    getSubscribedBots(userId),
  ]);

  return (
    <section className="mx-auto max-w-[1170px] px-4 pb-20 pt-32 sm:px-8 xl:px-0">
      <div className="space-y-12">
        <div>
          <h1 className="mb-5 text-2xl font-semibold text-white">Created Monstra Bots</h1>
          <BotGrid bots={createdBots} />
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-semibold text-white">Subscribed Monstra Bots</h2>
          <BotGrid bots={subscribedBots} />
        </div>
      </div>
    </section>
  );
}
