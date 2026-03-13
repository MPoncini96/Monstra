import { auth } from "@clerk/nextjs/server";
import prisma from "@/libs/prismaDB";
import { NextResponse } from "next/server";
import { initializeUserCurrencyBalances } from "@/libs/currencyDefaults";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
