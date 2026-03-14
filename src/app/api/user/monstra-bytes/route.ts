import { auth } from "@clerk/nextjs/server";
import prisma from "@/libs/prismaDB";
import { NextResponse } from "next/server";
import { initializeUserCurrencyBalances } from "@/libs/currencyDefaults";
import { ensureAppUser } from "@/libs/ensureAppUser";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureAppUser(userId, (sessionClaims ?? undefined) as Record<string, unknown> | undefined);

    await initializeUserCurrencyBalances(userId, false);

    const monstraBytes = await prisma.user_currency_balance.findUnique({
      where: {
        user_id_currency_code: {
          user_id: userId,
          currency_code: "MonstraBytes",
        },
      },
      select: {
        balance: true,
      },
    });

    return NextResponse.json({ monstraBytes: Number(monstraBytes?.balance ?? BigInt(0)) });
  } catch (error) {
    console.error("Error fetching monstra bytes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
