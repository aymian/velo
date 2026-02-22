"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            // Verify session and save to DB
            fetch(`/api/confirm-subscription?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log("Subscription saved to DB");
                    } else {
                        console.error("Failed to save subscription:", data.error);
                    }
                })
                .catch(err => console.error("Error confirming subscription:", err));
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl text-center backdrop-blur-xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-emerald-500/10 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-zinc-400 mb-8">
                    Thank you for upgrading! Your premium features are now active.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => router.push("/")}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Go to Feed
                    </button>

                    <button
                        onClick={() => router.push("/profile")}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-700 transition-all"
                    >
                        View Profile
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
