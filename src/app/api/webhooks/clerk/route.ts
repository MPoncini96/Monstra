import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/libs/prismaDB";

type ClerkWebhookEvent = {
  type: "user.created" | "user.updated" | "user.deleted" | string;
  data: {
    id: string;

    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;

    // Clerk commonly sends these:
    email_addresses?: Array<{
      id?: string;
      email_address: string;
    }>;
    primary_email_address_id?: string | null;

    image_url?: string | null;
  };
};

function getPrimaryEmail(data: ClerkWebhookEvent["data"]): string | null {
  const emails = data.email_addresses ?? [];
  if (!emails.length) return null;

  // Prefer primary email if Clerk provides it
  if (data.primary_email_address_id) {
    const primary = emails.find((e) => e.id === data.primary_email_address_id);
    if (primary?.email_address) return primary.email_address;
  }

  // Fallback to first email
  return emails[0]?.email_address ?? null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[clerk webhook] Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing CLERK_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const payload = await req.text();

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("[clerk webhook] Missing Svix headers");
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const wh = new Webhook(secret);

  let evt: ClerkWebhookEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[clerk webhook] Invalid signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { type, data } = evt;
  const userId = data?.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  try {
    // Handle deletes
    if (type === "user.deleted") {
      await prisma.users.delete({
        where: { id: userId }
      });
      console.log("[clerk webhook] User deleted:", userId);
      return NextResponse.json({ ok: true, type, userId });
    }

    if (type === "user.created" || type === "user.updated") {
      const email = getPrimaryEmail(data);

      // Email is required for user creation
      if (!email) {
        console.error("[clerk webhook] No email found for user", userId);
        return NextResponse.json(
          { error: "No email found on Clerk user" },
          { status: 400 }
        );
      }

      const username = data.username ?? null;

      // Upsert user via Prisma
      await prisma.users.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email,
          username,
          role: "user",
          level: 1,
          xp: 0,
        },
        update: {
          email,
          username,
        },
      });

      console.log("[clerk webhook] User upserted:", userId);
      return NextResponse.json({ ok: true, type, userId });
    }

    // Ignore other event types
    return NextResponse.json({ ok: true, ignored: type });
  } catch (err) {
    console.error("[clerk webhook] Handler error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[clerk webhook] Error details:", errorMessage);
    return NextResponse.json({ error: "Webhook handler failed", details: errorMessage }, { status: 500 });
  }
}