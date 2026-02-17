"use client";

import React, { useState, useEffect } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Smartphone, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EmailSignupForm } from "@/components/auth/EmailSignupForm";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<"intro" | "form">("intro");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showEmailDialog, setShowEmailDialog] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStep("form");
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
            const { auth, db } = await import("@/lib/firebase/config");
            const { doc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");
            const { COLLECTIONS } = await import("@/lib/firebase/collections");

            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            const userSnap = await getDoc(userRef);

            let targetRoute = '/discover';

            const userData: any = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            if (!userSnap.exists()) {
                userData.createdAt = serverTimestamp();
                userData.bio = "";
                userData.role = "user";
                userData.stats = { followers: 0, following: 0, impact: 0 };
                userData.onboardingCompleted = false;
                targetRoute = '/onboarding';
            } else {
                const data = userSnap.data();
                if (data?.onboardingCompleted) {
                    targetRoute = '/discover';
                } else {
                    targetRoute = '/onboarding';
                }
            }

            await setDoc(userRef, userData, { merge: true });

            useAuthStore.getState().setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

            router.push(targetRoute);
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Failed to authenticate with Google");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <BackgroundVideo blur={true} className="opacity-80 contrast-125 saturate-150" />
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
                            <div className="w-full max-w-[440px] mx-auto px-4 z-20 relative">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center mb-12"
                                >
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                                        Create Account
                                    </h1>
                                    <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md">
                                        Join the Velo community today
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="space-y-4 mb-10"
                                >
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-14 rounded-full flex items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-98 shadow-lg group disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        )}
                                        <span className="text-base tracking-wide">Sign up with Google</span>
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                                            <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                            <span className="text-sm font-medium">Sign up with X</span>
                                        </button>
                                        <button className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                                            <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.7.9 3.4 1.9-3.06 1.83-2.47 5.76.62 7.07-.63 1.61-1.54 3.2-2.61 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" /></svg>
                                            <span className="text-sm font-medium">Sign up with Apple</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => router.push('/phone-login')} className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                                            <Smartphone className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                            <span className="text-sm font-medium">Sign up with Phone</span>
                                        </button>
                                        <button onClick={() => router.push('/passkey-login')} className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                                            <Fingerprint className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                            <span className="text-sm font-medium">Use Passkey</span>
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="relative w-full flex items-center justify-center mb-10"
                                >
                                    <div className="h-px bg-white/20 w-full max-w-[200px]" />
                                    <span className="mx-4 text-xs font-medium text-white/60 tracking-widest uppercase">OR</span>
                                    <div className="h-px bg-white/20 w-full max-w-[200px]" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="relative z-20"
                                >
                                    <button
                                        onClick={() => setShowEmailDialog(true)}
                                        className="w-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                                    >
                                        <Mail className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-medium">Sign up with Email</span>
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="mt-16 text-center"
                                >
                                    <Link href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium tracking-wider uppercase drop-shadow-md">
                                        Protected by Velo Auth
                                    </Link>
                                </motion.div>
                            </div>
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

            {/* Email Signup Dialog */}
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogContent className="sm:max-w-[440px] bg-transparent border-none p-0 shadow-none" showCloseButton={false}>
                    <DialogTitle className="sr-only">Sign up with Email</DialogTitle>
                    <EmailSignupForm />
                </DialogContent>
            </Dialog>
        </div>
    );
}
