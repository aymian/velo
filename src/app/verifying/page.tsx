"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { VeloLogo } from "@/components/VeloLogo";

function VerifyingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<"loading" | "success">("loading");

    const provider = searchParams.get('provider') || 'google';
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        // Show loading for 1.5 seconds
        const loadingTimer = setTimeout(() => {
            setStep("success");
        }, 1500);

        // Redirect after showing success
        const redirectTimer = setTimeout(() => {
            router.push(redirectTo);
        }, 3000);

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(redirectTimer);
        };
    }, [router, redirectTo]);

    const providerNames: Record<string, string> = {
        google: 'Google',
        x: 'X',
        apple: 'Apple',
        phone: 'Phone',
        passkey: 'Passkey',
        email: 'Email',
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-black">
            {/* Animated gradient background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Logo at top */}
            <div className="absolute top-8 left-8">
                <VeloLogo showText={true} className="scale-90 drop-shadow-2xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    {step === "loading" ? (
                        <div className="relative">
                            {/* Spinning loader */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-24 h-24 mx-auto mb-6"
                            >
                                <div className="w-full h-full rounded-full border-4 border-white/10 border-t-white" />
                            </motion.div>

                            {/* Pulsing inner circle */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full blur-md"
                            />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                            }}
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500/20 backdrop-blur-md border-2 border-emerald-500/50 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Text content */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {step === "loading" ? "Verifying..." : "Success!"}
                    </h1>

                    <p className="text-white/60 text-lg font-light mb-2">
                        {step === "loading"
                            ? `Authenticating with ${providerNames[provider]}`
                            : "Authentication complete"}
                    </p>

                    {step === "success" && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/40 text-sm"
                        >
                            Redirecting you to Velo...
                        </motion.p>
                    )}
                </motion.div>

                {/* Loading dots */}
                {step === "loading" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 mt-8"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                }}
                                className="w-2 h-2 bg-white rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center">
                <p className="text-white/20 text-xs font-medium uppercase tracking-widest">
                    Protected by Velo Auth
                </p>
            </div>
        </div>
    );
}

export default function VerifyingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans uppercase tracking-[0.2em] text-[10px] font-black">
                <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
                <span>Synchronizing Session...</span>
            </div>
        }>
            <VerifyingContent />
        </Suspense>
    );
}
