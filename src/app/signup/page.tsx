"use client";

import React, { useState, useEffect } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { LoginForm } from "@/components/auth/LoginForm";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const [step, setStep] = useState<"intro" | "form">("intro");

    useEffect(() => {
        // 1. The "Auth-Less" Entry & Progressive Disclosure
        // Show just the vibe video and text first to hook the user
        // Then automatically transition to the login form after they have "felt" the vibe
        const timer = setTimeout(() => {
            setStep("form");
        }, 2800); // 2.8s total intro: gives time to read "Join the Vibe"

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* 1. Background Video - Blurred for focus but visible for vibe */}
            <BackgroundVideo blur={true} className="opacity-80 contrast-125 saturate-150" />

            {/* Dark overlay for accessibility */}
            <div className="fixed inset-0 bg-black/60 z-0" />

            {/* Top Bar with Home Link */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <VeloLogo showText={true} className="scale-75 origin-top-left hover:opacity-80 transition-opacity drop-shadow-lg" />
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[400px] max-w-lg">
                <AnimatePresence mode="wait">
                    {step === "intro" ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6"
                        >
                            <motion.h1
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                className="text-6xl md:text-8xl font-black text-white tracking-tighter"
                            >
                                Join the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1493] to-purple-600 animate-pulse">Vibe</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="text-white/60 text-xl tracking-wide font-light"
                            >
                                Create your account today.
                            </motion.p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full"
                        >
                            {/* For now reusing LoginForm but ideally should be SignupForm */}
                            <LoginForm title="Create Account" subtitle="Join the Velo community today" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Links */}
            <div className="absolute bottom-6 w-full text-center z-20">
                <div className="flex items-center justify-center gap-6 text-[10px] md:text-xs text-white/20 font-medium uppercase tracking-widest">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Help</Link>
                </div>
            </div>
        </div>
    );
}
