import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDB";
import { DEFAULT_CURRENCIES, initializeUserCurrencyBalances } from "@/libs/currencyDefaults";
import { ensureAppUser } from "@/libs/ensureAppUser";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureAppUser(userId, (sessionClaims ?? undefined) as Record<string, unknown> | undefined);
    await initializeUserCurrencyBalances(userId, false);

    const balances = await prisma.user_currency_balance.findMany({
      where: { user_id: userId },
      select: {
        currency_code: true,
        balance: true,
        game_currency: {
          select: {
            display_name: true,
          },
        },
      },
    });

    const balanceByCode = new Map(
      balances.map((row) => [
        row.currency_code,
        {
          currencyCode: row.currency_code,
          displayName: row.game_currency?.display_name ?? row.currency_code,
          balance: Number(row.balance),
        },
      ])
    );

    const orderedBalances = DEFAULT_CURRENCIES.map((currency) => {
      const existing = balanceByCode.get(currency.code);
      if (existing) return existing;

      return {
        currencyCode: currency.code,
        displayName: currency.displayName,
        balance: 0,
      };
    });

    return NextResponse.json({ balances: orderedBalances });
  } catch (error) {
    console.error("Error fetching currency balances:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
