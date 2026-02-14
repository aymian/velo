"use client";

import React, { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Smartphone, ArrowRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function PhoneLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            console.log('OTP sent:', data.debug?.otp); // Development only
            setStep("otp");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/phone', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            // Success - redirect to home
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step === "otp") {
            setStep("phone");
            setOtp("");
            setError("");
        } else {
            router.back();
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <style jsx global>{`
                .PhoneInput {
                    width: 100%;
                }
                .PhoneInputInput {
                    background: transparent !important;
                    border: none !important;
                    color: white !important;
                    padding: 20px 0 !important;
                    font-size: 1.125rem !important;
                    outline: none !important;
                }
                .PhoneInputCountry {
                    padding-left: 15px !important;
                    margin-right: 10px !important;
                }
                .PhoneInputCountrySelect {
                    background: #1a1a1a !important;
                    color: white !important;
                }
            `}</style>

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
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                        {step === "phone" ? "Phone Login" : "Enter Code"}
                    </h1>
                    <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md">
                        {step === "phone"
                            ? "We'll send you a verification code"
                            : `Code sent to ${phoneNumber}`}
                    </p>
                </motion.div>

                {/* Phone Number Form */}
                {step === "phone" && (
                    <motion.form
                        onSubmit={handleSendOTP}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                            <div className="relative flex items-center pr-2 min-h-[64px]">
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    defaultCountry="US"
                                    international
                                    className="velo-phone-input"
                                />

                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
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

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-rose-400 text-sm font-medium drop-shadow-md px-4"
                            >
                                <AlertCircle className="w-4 h-4" /> {error}
                            </motion.div>
                        )}
                    </motion.form>
                )}

                {/* OTP Verification Form */}
                {step === "otp" && (
                    <motion.form
                        onSubmit={handleVerifyOTP}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 group-focus-within:border-white/30 group-focus-within:bg-white/10 transition-all duration-300 shadow-xl" />

                            <div className="relative flex items-center px-2">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(value);
                                        setError("");
                                    }}
                                    placeholder="000000"
                                    className="w-full bg-transparent border-none outline-none py-5 text-white placeholder-white/40 text-2xl font-mono tracking-[0.5em] text-center"
                                    autoFocus
                                    maxLength={6}
                                />

                                <div className="absolute right-2">
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

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-rose-400 text-sm font-medium drop-shadow-md px-4"
                            >
                                <AlertCircle className="w-4 h-4" /> {error}
                            </motion.div>
                        )}

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("phone");
                                    setOtp("");
                                }}
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors underline"
                            >
                                Resend code
                            </button>
                        </div>
                    </motion.form>
                )}

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
