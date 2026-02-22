import Stripe from "stripe";

let stripeServer: Stripe | null = null;

/**
 * Lazy-initializes Stripe to prevent build-time failures
 * occurring when environment variables are unavailable during static analysis.
 */
export const getStripeServer = () => {
    if (stripeServer) return stripeServer;

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        console.warn('⚠️ Missing STRIPE_SECRET_KEY. Stripe will not be initialized.');
        // We throw here because at runtime this is a terminal error for Stripe operations
        throw new Error("Missing STRIPE_SECRET_KEY");
    }

    stripeServer = new Stripe(key, {
        apiVersion: "2026-01-28.clover" as any,
    });

    return stripeServer;
};
