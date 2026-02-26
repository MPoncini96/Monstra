import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
  });
  let data = await request.json();
  let priceId = data.priceId;

  const session = await stripe.checkout.sessions.create({
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      clerkUserId: userId,
    },
    mode: "subscription",
    success_url: process.env.SITE_URL,
    cancel_url: process.env.SITE_URL,
  });

  return NextResponse.json(session.url);
}
