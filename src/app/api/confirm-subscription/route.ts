export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover" as any,
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId) {
            return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
        }

        // Update user in Firestore
        const userRef = adminDb.collection("users").doc(userId);
        await userRef.update({
            subscription: {
                status: "active",
                plan: plan,
                stripeSessionId: sessionId,
                stripeCustomerId: session.customer,
                updatedAt: new Date(),
                trialEndsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            },
            verified: true, // Optionally mark as verified if they paid
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Confirmation Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
