import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/libs/prismaDB";
import { Prisma } from "@prisma/client";

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
  const clerkUserId = data?.id;

  if (!clerkUserId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  try {
    // Handle deletes (optional but recommended)
    if (type === "user.deleted") {
      await prisma.$executeRaw`
        DELETE FROM app.users
        WHERE id = ${clerkUserId}
      `;
      return NextResponse.json({ ok: true, type, userId: clerkUserId });
    }

    if (type === "user.created" || type === "user.updated") {
      const email = getPrimaryEmail(data);

      // Your app.users.email column is NOT NULL — so we must have an email
      if (!email) {
        console.error("[clerk webhook] No email found for user", clerkUserId);
        return NextResponse.json(
          { error: "No email found on Clerk user" },
          { status: 400 }
        );
      }

      const username = data.username ?? null;

      // Do both user upsert + starting currency grant in ONE transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Upsert into app.users
      await tx.$executeRaw`
        INSERT INTO app.users (id, email, username, role, level, xp, created_at, updated_at)
        VALUES (${clerkUserId}, ${email}, ${username}, 'user', 1, 0, now(), now())
        ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            username = EXCLUDED.username,
            updated_at = now()
      `;

      // Grant starting currencies only on create
      // (This assumes you've created app.grant_starting_currencies(TEXT))
      if (type === "user.created") {
        await tx.$executeRaw`SELECT app.grant_starting_currencies(${clerkUserId})`;
      }
    });

      return NextResponse.json({ ok: true, type, userId: clerkUserId });
    }

    // Ignore other event types
    return NextResponse.json({ ok: true, ignored: type });
  } catch (err) {
    console.error("[clerk webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}