import prisma from "@/libs/prismaDB";

export async function ensureSubscriptionsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS app.subscriptions (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
      bot_id text NOT NULL,
      created_at timestamptz(6) NOT NULL DEFAULT now()
    )
  `);

  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_bot_id_key ON app.subscriptions(user_id, bot_id)`
  );

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON app.subscriptions(user_id)`
  );
}
