export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error("Missing STRIPE_SECRET_KEY");
    }
    return new Stripe(key, {
        apiVersion: "2026-01-28.clover" as any,
    });
};

export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        const { plan, billing = "monthly", userId } = await req.json();

        // Prices in cents
        const prices = {
            basic: { monthly: 900, yearly: 7500 },
            pro: { monthly: 2900, yearly: 20300 },
            elite: { monthly: 7900, yearly: 55300 },
        };

        const unitAmount = prices[plan as keyof typeof prices]?.[billing as "monthly" | "yearly"] || 2900;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            client_reference_id: userId,
            metadata: {
                userId,
                plan,
                billing
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Velo ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                            description: billing === "monthly" ? "Monthly subscription" : "Yearly subscription (Save 30%)",
                        },
                        unit_amount: unitAmount,
                        recurring: {
                            interval: billing === "monthly" ? "month" : "year",
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "subscription",
            subscription_data: {
                trial_period_days: 60,
            },
            success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/premium`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
