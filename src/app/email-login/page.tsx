"use client";

import React, { useState, useEffect } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "@/lib/store";

import { Suspense } from "react";

function EmailLoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        // Get email from query params
        const emailParam = searchParams.get("email");
        const typeParam = searchParams.get("type");

        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }

        // type=true means new user (signup), type=false means existing user (login)
        if (typeParam === "true") {
            setIsNewUser(true);
        } else {
            setIsNewUser(false);
        }
    }, [searchParams]);

    const toggleMode = () => {
        setIsNewUser(!isNewUser);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { setUser } = useAuthStore.getState();

            if (isNewUser) {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase/config");
                await setDoc(doc(db, "users", result.user.uid), {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName || "",
                    photoURL: null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    onboardingCompleted: false,
                    role: "user",
                    bio: "",
                    stats: { followers: 0, following: 0, impact: 0 },
                });
                setUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                });
                router.push("/onboarding");
            } else {
                const result = await signInWithEmailAndPassword(auth, email, password);
                setUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                });
                router.push("/");
            }
        } catch (err: any) {
            console.error("Auth error:", err.code, err.message);
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Incorrect password. Please try again.");
            } else if (err.code === "auth/user-not-found") {
                setError("User not found. Please check your email.");
            } else if (err.code === "auth/email-already-in-use") {
                setError("Email already in use. Try logging in instead.");
            } else {
                setError("Authentication failed. " + (err.message || "Please try again."));
            }
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Video */}
            <BackgroundVideo blur={true} className="fixed inset-0 w-full h-full object-cover -z-20 opacity-80 contrast-125 saturate-150" />

            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/40 -z-10 pointer-events-none" />

            {/* Top Bar with Home Link */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <VeloLogo showText={true} className="scale-75 origin-top-left hover:opacity-80 transition-opacity drop-shadow-lg" />
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-[440px] mx-auto px-4 z-20 relative">

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={handleBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                        {isNewUser ? "Create Your Password" : "Enter Your Password"}
                    </h1>
                    <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md mb-4">
                        {isNewUser ? "Secure your account with a strong password" : "Welcome back! Enter your password to continue"}
                    </p>

                    {/* Email Display & Mode Toggle */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mt-2">
                            <span className="text-white/80 text-sm font-medium">{email}</span>
                            <button
                                onClick={handleBack}
                                className="text-white/60 hover:text-white text-xs underline"
                            >
                                Change
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-white/40 hover:text-white text-xs transition-colors hover:underline"
                        >
                            {isNewUser ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </motion.div>

                {/* Password Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                        <div className="relative flex items-center px-2">
                            <div className="pl-4 pr-3 text-white/50">
                                <Lock className="w-5 h-5" />
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder={isNewUser ? "Create a strong password" : "Enter your password"}
                                className="w-full bg-transparent border-none outline-none py-5 text-white placeholder-white/40 text-lg font-light tracking-wide pr-24"
                                autoFocus
                            />

                            <div className="flex items-center gap-2 pr-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 text-white/50 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-10 h-10 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-rose-400 text-sm font-medium drop-shadow-md px-4"
                        >
                            <AlertCircle className="w-4 h-4" /> {error}
                        </motion.div>
                    )}

                    {/* Password Requirements (for new users) */}
                    {isNewUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4"
                        >
                            <p className="text-white/60 text-xs font-medium mb-2">Password must contain:</p>
                            <ul className="space-y-1 text-white/50 text-xs">
                                <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-emerald-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                    At least 6 characters
                                </li>
                                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-emerald-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                    One uppercase letter
                                </li>
                                <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-emerald-400' : ''}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                    One number
                                </li>
                            </ul>
                        </motion.div>
                    )}

                    {/* Forgot Password Link (for existing users) */}
                    {!isNewUser && (
                        <div className="text-center">
                            <Link
                                href="/forgot-password"
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}
                </motion.form>

                {/* Footer */}
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

export default function EmailLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
            </div>
        }>
            <EmailLoginContent />
        </Suspense>
    );
}
