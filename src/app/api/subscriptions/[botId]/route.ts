import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/libs/prismaDB";
import { initializeUserCurrencyBalances } from "@/libs/currencyDefaults";
import { ensureSubscriptionsTable } from "@/libs/subscriptionsTable";
import { randomUUID } from "crypto";
import { ensureAppUser } from "@/libs/ensureAppUser";

const MONSTRA_BYTES_CODE = "MonstraBytes";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ botId: string }>;
};

const normalizeBotId = (rawBotId: string) => rawBotId.trim().toLowerCase();

export async function GET(_: Request, { params }: RouteContext) {
  await ensureSubscriptionsTable();

  const { botId } = await params;
  const normalizedBotId = normalizeBotId(botId);

  if (!normalizedBotId) {
    return NextResponse.json({ error: "Invalid bot id" }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ subscribed: false, monstraBytes: 0, requiresAuth: true });
  }

  const subscriptions = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT id FROM app.subscriptions WHERE user_id = $1 AND bot_id = $2 LIMIT 1`,
    userId,
    normalizedBotId
  );

  return NextResponse.json({
    subscribed: subscriptions.length > 0,
    monstraBytes: 0,
    requiresAuth: false,
  });
}

export async function POST(_: Request, { params }: RouteContext) {
  await ensureSubscriptionsTable();

  const { botId } = await params;
  const normalizedBotId = normalizeBotId(botId);

  if (!normalizedBotId) {
    return NextResponse.json({ error: "Invalid bot id" }, { status: 400 });
  }

  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureAppUser(userId, (sessionClaims ?? undefined) as Record<string, unknown> | undefined);
  await initializeUserCurrencyBalances(userId, false);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingSubscription = await tx.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM app.subscriptions WHERE user_id = $1 AND bot_id = $2 LIMIT 1`,
        userId,
        normalizedBotId
      );

      const balanceRow = await tx.user_currency_balance.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: MONSTRA_BYTES_CODE,
          },
        },
        select: { balance: true },
      });

      const currentBalance = balanceRow?.balance ?? BigInt(0);

      if (existingSubscription.length > 0) {
        return {
          subscribed: true,
          monstraBytes: Number(currentBalance),
          alreadySubscribed: true,
        };
      }

      if (currentBalance < BigInt(1)) {
        throw new Error("INSUFFICIENT_MONSTRA_BYTES");
      }

      await tx.$executeRawUnsafe(
        `INSERT INTO app.subscriptions (id, user_id, bot_id) VALUES ($1, $2, $3)`,
        randomUUID(),
        userId,
        normalizedBotId
      );

      const updatedBalance = currentBalance - BigInt(1);

      await tx.user_currency_balance.update({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: MONSTRA_BYTES_CODE,
          },
        },
        data: {
          balance: updatedBalance,
        },
      });

      return {
        subscribed: true,
        monstraBytes: Number(updatedBalance),
        alreadySubscribed: false,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_MONSTRA_BYTES") {
      return NextResponse.json(
        { error: "Not enough MonstraBytes to subscribe." },
        { status: 400 }
      );
    }

    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  await ensureSubscriptionsTable();

  const { botId } = await params;
  const normalizedBotId = normalizeBotId(botId);

  if (!normalizedBotId) {
    return NextResponse.json({ error: "Invalid bot id" }, { status: 400 });
  }

  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureAppUser(userId, (sessionClaims ?? undefined) as Record<string, unknown> | undefined);

  await prisma.$executeRawUnsafe(
    `DELETE FROM app.subscriptions WHERE user_id = $1 AND bot_id = $2`,
    userId,
    normalizedBotId
  );

  const balanceRow = await prisma.user_currency_balance.findUnique({
    where: {
      user_id_currency_code: {
        user_id: userId,
        currency_code: MONSTRA_BYTES_CODE,
      },
    },
    select: { balance: true },
  });

  return NextResponse.json({
    subscribed: false,
    monstraBytes: Number(balanceRow?.balance ?? BigInt(0)),
  });
}
