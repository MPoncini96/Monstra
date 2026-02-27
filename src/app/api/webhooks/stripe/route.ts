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
  await prisma.bot.upsert({
    where: { id: botId },
    update: {},
    create: {
      id: botId,
      name: botId,
      isOfficial: false,
      isPublic: false,
    },
  });
}

async function resolveUserId(
  stripeCustomerId: string,
  subscription: Stripe.Subscription
) {
  if (subscription.metadata?.clerkUserId) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: subscription.metadata.clerkUserId },
    });
    return user?.id ?? null;
  }

  const linkedCustomer = await prisma.stripeCustomer.findUnique({
    where: { stripeCustomerId },
  });

  if (linkedCustomer) {
    return linkedCustomer.userId;
  }

  try {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (!customer || customer.deleted) {
      return null;
    }

    const clerkUserId = customer.metadata?.clerkUserId;
    if (!clerkUserId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
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

  await prisma.$transaction(async (tx) => {
    await tx.stripeCustomer.upsert({
      where: { stripeCustomerId },
      update: { userId },
      create: { stripeCustomerId, userId },
    });

    await tx.stripeSubscription.upsert({
      where: { stripeSubscriptionId },
      update: {
        status: subscription.status,
        currentPeriodEnd: unixToDate(subscription.current_period_end),
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        planKey: planKeys[0] ?? null,
        customerUserId: userId,
      },
      create: {
        stripeSubscriptionId,
        status: subscription.status,
        currentPeriodEnd: unixToDate(subscription.current_period_end),
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        planKey: planKeys[0] ?? null,
        customerUserId: userId,
      },
    });

    for (const entitlement of entitlements) {
      await ensureBot(entitlement.botId);

      await tx.userBotAccess.upsert({
        where: {
          userId_botId_source: {
            userId,
            botId: entitlement.botId,
            source: entitlement.source,
          },
        },
        update: {
          status: isActive ? "ACTIVE" : "CANCELED",
          endsAt,
        },
        create: {
          userId,
          botId: entitlement.botId,
          source: entitlement.source,
          status: isActive ? "ACTIVE" : "CANCELED",
          endsAt,
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
