export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: Request) {
    const stripe = getStripeServer();
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
        const adminDb = getAdminDb();
        if (!adminDb) {
            throw new Error('Database connection failed');
        }

        const userRef = adminDb.collection("users").doc(userId);
        await userRef.update({
            plan: plan || 'basic',
            subscriptionStatus: 'active',
            subscriptionEndsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days trial/period
            role: 'creator', // Premium users usually get creator privileges
            stripeCustomerId: session.customer,
            verified: true,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Confirmation Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
