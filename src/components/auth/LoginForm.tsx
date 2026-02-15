"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Loader2, AlertCircle, Smartphone, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

interface LoginFormProps {
    title?: string;
    subtitle?: string;
}

export function LoginForm({
    title = "Welcome Back",
    subtitle = "Access your Velo account"
}: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false);

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setIsValid(validateEmail(value));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        setIsLoading(true);
        try {
            // Simulate check
            await new Promise((resolve) => setTimeout(resolve, 800));
            const isNewUser = Math.random() > 0.5;
            const encodedEmail = encodeURIComponent(email);
            router.push(`/email-login?email=${encodedEmail}&type=${isNewUser}`);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    // 🚀 Google Popup Authentication with user syncing
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
            }

            await setDoc(userRef, userData, { merge: true });

            useAuthStore.getState().setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

            router.push('/profile');
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Failed to authenticate with Google");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] mx-auto px-4 z-20 relative">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                    {title}
                </h1>
                <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md">
                    {subtitle}
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
                    <span className="text-base tracking-wide">Continue with Google</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => { }} className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                        <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        <span className="text-sm font-medium">Continue with X</span>
                    </button>
                    <button onClick={() => { }} className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                        <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.7.9 3.4 1.9-3.06 1.83-2.47 5.76.62 7.07-.63 1.61-1.54 3.2-2.61 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" /></svg>
                        <span className="text-sm font-medium">Continue with Apple</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => router.push('/phone-login')} className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                        <Smartphone className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium">Continue with Phone</span>
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

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative z-20"
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />
                    <div className="relative flex items-center px-2">
                        <div className="pl-4 pr-3 text-white/50">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email address"
                            className="w-full bg-transparent border-none outline-none py-5 text-white placeholder-white/40 text-lg font-light tracking-wide"
                        />
                        <div className="pl-2 pr-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-10 h-10 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-8 left-4 flex items-center gap-2 text-rose-400 text-sm font-medium drop-shadow-md">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </motion.div>
                )}
            </motion.form>

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
    );
}
