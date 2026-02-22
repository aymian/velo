"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Star, Zap, Crown } from "lucide-react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Basic",
        monthlyPrice: 9,
        yearlyPrice: 7,
        icon: Star,
        description: "Small starting point",
        features: [
            "exclusive profile badge",
            "priority comments",
            "ad-free browsing"
        ],
        buttonText: "Subscribe",
        accent: "text-white/20"
    },
    {
        name: "Premium",
        monthlyPrice: 19,
        yearlyPrice: 15,
        isActive: true,
        icon: Zap,
        description: "Status and power",
        features: [
            "unlock content access",
            "direct creator messaging",
            "500 monthly gems",
            "verified status"
        ],
        buttonText: "Upgrade Now",
        accent: "text-[#d147a3]"
    },
    {
        name: "Elite",
        monthlyPrice: 49,
        yearlyPrice: 39,
        icon: Crown,
        description: "Total exclusivity",
        features: [
            "private fan circles",
            "custom profile theme",
            "24/7 dedicated support",
            "early feature access"
        ],
        buttonText: "Join Elite",
        accent: "text-white/20"
    }
];

export default function PremiumPage() {
    const { isAuthenticated } = useAuthStore();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-[#d147a3]/30">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen px-6 lg:px-16 py-24">
                    <div className="max-w-5xl mx-auto">

                        {/* Header Section - Ample Spacing */}
                        <div className="text-center mb-24 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block px-4 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] uppercase tracking-[0.3em] text-[#d147a3] font-bold"
                            >
                                Memberships
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-6xl font-black tracking-tight"
                            >
                                Unlock your status<span className="text-[#d147a3]">.</span>
                            </motion.h1>

                            {/* Refined Billing Toggle */}
                            <div className="flex bg-[#111] p-1.5 rounded-[2rem] border border-white/5 w-fit mx-auto mt-12">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    className={cn(
                                        "px-10 py-3 rounded-[1.8rem] text-[11px] uppercase tracking-widest font-black transition-all duration-300",
                                        billingCycle === "monthly" ? "bg-white text-black shadow-xl" : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle("yearly")}
                                    className={cn(
                                        "px-10 py-3 rounded-[1.8rem] text-[11px] uppercase tracking-widest font-black transition-all duration-300",
                                        billingCycle === "yearly" ? "bg-white text-black shadow-xl" : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>

                        {/* Pricing Cards Grid - Rounded & Spaced */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, idx) => {
                                const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

                                return (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className={cn(
                                            "flex flex-col p-10 rounded-[3rem] bg-[#0c0c0c] border transition-all duration-500 relative group overflow-hidden",
                                            plan.isActive
                                                ? "border-[#d147a3]/30 shadow-[0_40px_100px_rgba(0,0,0,0.8)] scale-105 z-10"
                                                : "border-white/[0.03] hover:border-white/10 hover:bg-[#111]"
                                        )}
                                    >
                                        {/* Subtle Highlight Reflection */}
                                        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                                        {/* Header Info */}
                                        <div className="mb-12 relative z-10">
                                            <div className={cn("mb-6 transition-transform group-hover:scale-110 duration-500", plan.accent)}>
                                                <plan.icon size={28} strokeWidth={1} />
                                            </div>
                                            <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 font-black mb-2">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black tracking-tighter text-white tabular-nums">${price}</span>
                                                <span className="text-[11px] text-white/10 font-black uppercase tracking-widest">/ mo</span>
                                            </div>
                                            <p className="text-[13px] text-white/30 mt-2 font-medium tracking-tight italic">{plan.description}</p>
                                        </div>

                                        {/* Feature Set */}
                                        <div className="flex-grow space-y-5 mb-12 relative z-10">
                                            {plan.features.map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-4 group/item">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover/item:bg-[#d147a3] transition-colors duration-300" />
                                                    <span className="text-[14px] text-white/60 font-medium tracking-tight group-hover/item:text-white transition-colors duration-300">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* The "Sexy" Button */}
                                        <button className={cn(
                                            "w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] border flex items-center justify-center gap-2 group/btn relative overflow-hidden",
                                            plan.isActive
                                                ? "bg-white text-black border-white shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                                                : "text-white/40 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/5"
                                        )}>
                                            <span className="relative z-10">{plan.buttonText}</span>
                                            <ArrowRight size={16} className="relative z-10 opacity-40 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Ultra-Refined Footer Info */}
                        <div className="mt-32 flex flex-wrap justify-between items-center gap-8 border-t border-white/5 pt-12 group cursor-default">
                            {["Global Security", "Instant Credits", "VIP Priority", "No Contract"].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 transition-all duration-700 opacity-20 group-hover:opacity-60">
                                    <div className="w-[4px] h-[4px] bg-[#d147a3] rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
