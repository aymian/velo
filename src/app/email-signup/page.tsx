"use client";

import React, { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function EmailSignupPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"form" | "success">("form");

    const validateForm = () => {
        if (!formData.name || formData.name.length < 2) {
            setError("Please enter your name");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        if (!/[A-Z]/.test(formData.password)) {
            setError("Password must contain at least one uppercase letter");
            return false;
        }

        if (!/[0-9]/.test(formData.password)) {
            setError("Password must contain at least one number");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Simulate API call - replace with actual Firebase/backend call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Creating account:", {
                name: formData.name,
                email: formData.email,
            });

            setStep("success");

            // Redirect after showing success
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err: any) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setError("");
    };

    if (step === "success") {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
                <BackgroundVideo blur={true} className="fixed inset-0 w-full h-full object-cover -z-20 opacity-80 contrast-125 saturate-150" />
                <div className="fixed inset-0 bg-black/40 -z-10 pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-xl">Welcome to Velo!</h1>
                    <p className="text-white/60 text-lg mb-2">Your account has been created</p>
                    <p className="text-white/40 text-sm">Redirecting you to the app...</p>
                </motion.div>
            </div>
        );
    }

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
            <div className="w-full max-w-[480px] mx-auto px-4 z-20 relative">

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => router.back()}
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
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                        Create Account
                    </h1>
                    <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md">
                        Join the Velo community today
                    </p>
                </motion.div>

                {/* Signup Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    {/* Name Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                        <div className="relative flex items-center px-2">
                            <div className="pl-4 pr-3 text-white/50">
                                <User className="w-5 h-5" />
                            </div>

                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleChange("name")}
                                placeholder="Full Name"
                                className="w-full bg-transparent border-none outline-none py-4 text-white placeholder-white/40 text-base font-light tracking-wide"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                        <div className="relative flex items-center px-2">
                            <div className="pl-4 pr-3 text-white/50">
                                <Mail className="w-5 h-5" />
                            </div>

                            <input
                                type="email"
                                value={formData.email}
                                onChange={handleChange("email")}
                                placeholder="Email Address"
                                className="w-full bg-transparent border-none outline-none py-4 text-white placeholder-white/40 text-base font-light tracking-wide"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                        <div className="relative flex items-center px-2">
                            <div className="pl-4 pr-3 text-white/50">
                                <Lock className="w-5 h-5" />
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange("password")}
                                placeholder="Create Password"
                                className="w-full bg-transparent border-none outline-none py-4 text-white placeholder-white/40 text-base font-light tracking-wide pr-12"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-4 text-white/50 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                        <div className="relative flex items-center px-2">
                            <div className="pl-4 pr-3 text-white/50">
                                <Lock className="w-5 h-5" />
                            </div>

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                                placeholder="Confirm Password"
                                className="w-full bg-transparent border-none outline-none py-4 text-white placeholder-white/40 text-base font-light tracking-wide pr-12"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="pr-4 text-white/50 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
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

                    {/* Password Requirements */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                        <p className="text-white/60 text-xs font-medium mb-2">Password must contain:</p>
                        <ul className="space-y-1 text-white/50 text-xs">
                            <li className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-emerald-400' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                At least 6 characters
                            </li>
                            <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                One uppercase letter
                            </li>
                            <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                One number
                            </li>
                            <li className={`flex items-center gap-2 ${formData.password && formData.password === formData.confirmPassword ? 'text-emerald-400' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${formData.password && formData.password === formData.confirmPassword ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                Passwords match
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span className="text-base">Create Account</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                        <p className="text-white/60 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </motion.form>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-white/40 text-xs mb-2">
                        By creating an account, you agree to our
                    </p>
                    <div className="flex items-center justify-center gap-4 text-white/40 hover:text-white text-xs">
                        <Link href="#" className="hover:underline">Terms of Service</Link>
                        <span>•</span>
                        <Link href="#" className="hover:underline">Privacy Policy</Link>
                    </div>
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
