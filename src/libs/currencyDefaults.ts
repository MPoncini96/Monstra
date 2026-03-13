import prisma from "@/libs/prismaDB";

export const DEFAULT_CURRENCIES: Array<{ code: string; displayName: string; balance: bigint }> = [
  { code: "MonstraBytes", displayName: "MonstraBytes", balance: BigInt(3) },
  { code: "AurumBytes", displayName: "AurumBytes", balance: BigInt(0) },
  { code: "Nums", displayName: "Nums", balance: BigInt(10) },
  { code: "Flamma", displayName: "Flamma", balance: BigInt(5) },
  { code: "Mutates", displayName: "Mutates", balance: BigInt(5) },
  { code: "Fortuna", displayName: "Fortuna", balance: BigInt(1000) },
];

export async function ensureCurrencyCatalog() {
  await prisma.$transaction(
    DEFAULT_CURRENCIES.map((currency) =>
      prisma.game_currency.upsert({
        where: { currency_code: currency.code },
        create: {
          currency_code: currency.code,
          display_name: currency.displayName,
          description: null,
          decimals: 0,
          is_active: true,
        },
        update: {
          display_name: currency.displayName,
          is_active: true,
        },
      })
    )
  );
}

export async function initializeUserCurrencyBalances(userId: string, overwriteExisting = false) {
  await ensureCurrencyCatalog();

  if (overwriteExisting) {
    await prisma.$transaction(
      DEFAULT_CURRENCIES.map((currency) =>
        prisma.user_currency_balance.upsert({
          where: {
            user_id_currency_code: {
              user_id: userId,
              currency_code: currency.code,
            },
          },
          create: {
            user_id: userId,
            currency_code: currency.code,
            balance: currency.balance,
          },
          update: {
            balance: currency.balance,
          },
        })
      )
    );
    return;
  }

  await prisma.user_currency_balance.createMany({
    data: DEFAULT_CURRENCIES.map((currency) => ({
      user_id: userId,
      currency_code: currency.code,
      balance: currency.balance,
    })),
    skipDuplicates: true,
  });
}

export async function backfillAllUsersCurrencyBalances(overwriteExisting = true) {
  await ensureCurrencyCatalog();

  const users = await prisma.users.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await initializeUserCurrencyBalances(user.id, overwriteExisting);
  }

  return users.length;
}
