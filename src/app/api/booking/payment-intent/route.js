import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = "usd", metadata } = await req.json();

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
