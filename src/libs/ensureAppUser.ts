import prisma from "@/libs/prismaDB";

type SessionClaims = Record<string, unknown> | null | undefined;

const getClaimString = (claims: SessionClaims, key: string) => {
  const value = claims?.[key];
  return typeof value === "string" ? value.trim() : "";
};

export async function ensureAppUser(userId: string, sessionClaims?: SessionClaims) {
  const claimEmail =
    getClaimString(sessionClaims, "email") ||
    getClaimString(sessionClaims, "email_address");

  const email = claimEmail || `${userId}@monstra.local`;
  const username =
    getClaimString(sessionClaims, "username") ||
    getClaimString(sessionClaims, "preferred_username") ||
    null;

  await prisma.users.upsert({
    where: { id: userId },
    update: {
      email,
      username: username || undefined,
    },
    create: {
      id: userId,
      email,
      username,
    },
  });
}
