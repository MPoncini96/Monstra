import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/libs/prismaDB";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    username?: string | null;
    first_name?: string | null;
    email_addresses?: Array<{ email_address: string }>;
  };
};

export async function POST(req: Request) {
  const payload = await req.text();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "");

  const headers = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  let evt: ClerkWebhookEvent;
  try {
    evt = wh.verify(payload, headers) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const clerkUserId = data.id;
    const email = data.email_addresses?.[0]?.email_address;
    const displayName = data.username ?? data.first_name ?? null;

    await prisma.user.upsert({
      where: { clerkUserId },
      update: {
        email,
        profile: {
          upsert: {
            update: { displayName },
            create: { displayName },
          },
        },
      },
      create: {
        clerkUserId,
        email,
        monstraBytes: 1000,
        profile: {
          create: { displayName },
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
