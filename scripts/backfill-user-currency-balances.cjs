const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const DEFAULT_CURRENCIES = [
  { code: "MonstraBytes", displayName: "MonstraBytes", balance: 3n },
  { code: "AurumBytes", displayName: "AurumBytes", balance: 0n },
  { code: "Nums", displayName: "Nums", balance: 10n },
  { code: "Flamma", displayName: "Flamma", balance: 5n },
  { code: "Mutates", displayName: "Mutates", balance: 5n },
  { code: "Fortuna", displayName: "Fortuna", balance: 1000n },
];

async function ensureCurrencyCatalog() {
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

async function backfillAllUsers() {
  await ensureCurrencyCatalog();

  const users = await prisma.users.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await prisma.$transaction(
      DEFAULT_CURRENCIES.map((currency) =>
        prisma.user_currency_balance.upsert({
          where: {
            user_id_currency_code: {
              user_id: user.id,
              currency_code: currency.code,
            },
          },
          create: {
            user_id: user.id,
            currency_code: currency.code,
            balance: currency.balance,
          },
          update: {
            balance: currency.balance,
          },
        })
      )
    );
  }

  console.log(`Backfilled currency balances for ${users.length} users.`);
}

backfillAllUsers()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
