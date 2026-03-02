import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prismaDB";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

const PREMIUM_BOT_ID = "premium";

type Entitlement = {
  source: "PREMIUM" | "BOT_SUBSCRIPTION";
  botId: string;
};

function unixToDate(value?: number | null) {
  if (!value) {
    return null;
  }
  return new Date(value * 1000);
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getPlanKeys(subscription: Stripe.Subscription) {
  const planKeys: string[] = [];

  if (subscription.metadata?.plan_key) {
    planKeys.push(subscription.metadata.plan_key);
  }

  for (const item of subscription.items.data) {
    const price = item.price as Stripe.Price | null;
    const metadataPlan = price?.metadata?.plan_key;
    const metadataBot = price?.metadata?.bot_id;

    if (metadataPlan) {
      planKeys.push(metadataPlan);
    }

    if (metadataBot) {
      planKeys.push(`bot:${metadataBot}`);
    }
  }

  return uniqueStrings(planKeys);
}

function getEntitlements(planKeys: string[]) {
  const entitlements: Entitlement[] = [];

  for (const planKey of planKeys) {
    if (planKey === "premium") {
      entitlements.push({ source: "PREMIUM", botId: PREMIUM_BOT_ID });
      continue;
    }

    if (planKey.startsWith("bot:")) {
      const botId = planKey.replace("bot:", "").trim();
      if (botId) {
        entitlements.push({ source: "BOT_SUBSCRIPTION", botId });
      }
    }
  }

  return entitlements;
}

async function ensureBot(botId: string) {
  // TODO: Bot table doesn't exist yet
  // await prisma.bot.upsert({
  //   where: { id: botId },
  //   update: {},
  //   create: {
  //     id: botId,
  //     name: botId,
  //     isOfficial: false,
  //     isPublic: false,
  //   },
  // });
  console.log(`Bot ${botId} would be created if bot table existed`);
}

async function resolveUserId(
  stripeCustomerId: string,
  subscription: Stripe.Subscription
) {
  if (subscription.metadata?.clerkUserId) {
    const user = await prisma.users.findUnique({
      where: { id: subscription.metadata.clerkUserId },
    });
    return user?.id ?? null;
  }

  // TODO: StripeCustomer table doesn't exist yet
  // const linkedCustomer = await prisma.stripeCustomer.findUnique({
  //   where: { stripeCustomerId },
  // });
  // if (linkedCustomer) {
  //   return linkedCustomer.userId;
  // }

  try {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (!customer || customer.deleted) {
      return null;
    }

    const clerkUserId = customer.metadata?.clerkUserId;
    if (!clerkUserId) {
      return null;
    }

    const user = await prisma.users.findUnique({
      where: { id: clerkUserId },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const handledEvents = new Set([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);

  if (!handledEvents.has(event.type)) {
    return NextResponse.json({ ok: true });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const stripeSubscriptionId = subscription.id;
  const stripeCustomerId = String(subscription.customer || "");

  if (!stripeCustomerId) {
    return NextResponse.json({ ok: true });
  }

  const userId = await resolveUserId(stripeCustomerId, subscription);
  if (!userId) {
    return NextResponse.json({ ok: true });
  }

  const planKeys = getPlanKeys(subscription);
  const entitlements = getEntitlements(planKeys);
  const isActive = ACTIVE_STATUSES.has(subscription.status);
  const endsAt = isActive ? null : new Date();

  // TODO: Stripe subscription tables (stripeCustomer, stripeSubscription, userBotAccess) don't exist yet
  // For now, just log the webhook event
  console.log(`Stripe webhook received: ${event.type} for user ${userId}`);
  console.log(`Plan keys:`, planKeys);
  console.log(`Entitlements:`, entitlements);
  console.log(`Status: ${isActive ? 'ACTIVE' : 'CANCELED'}`);

  return NextResponse.json({ ok: true, userId, message: "Stripe tables not yet implemented" });
}
