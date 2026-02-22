"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Star, Zap, Crown, Shield } from "lucide-react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        icon: Shield,
        description: "Get started for free",
        memberFeatures: [
            "Browse public profiles",
            "Like & follow creators",
            "Limited preview content",
            "Basic search filters",
            "3 messages per day",
            "Ads shown",
        ],
        creatorFeatures: [
            "Create profile",
            "Upload limited posts (10/month)",
            "Basic analytics",
            "Receive likes",
            "Limited chat replies",
            "20% platform fee",
        ],
    },
    {
        name: "Basic",
        price: "$9",
        period: "/month",
        icon: Star,
        description: "Perfect for getting started",
        memberFeatures: [
            "Unlimited profile browsing",
            "Unlimited likes & follows",
            "20 messages per day",
            "HD content viewing",
            "No ads",
            "Basic creator recommendations",
            "Can tip creators",
        ],
        creatorFeatures: [
            "Unlimited uploads",
            "HD content",
            "Priority in search ranking",
            "Basic earnings dashboard",
            "Withdraw earnings",
            "15% platform fee",
        ],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        icon: Zap,
        popular: true,
        description: "Most popular choice",
        memberFeatures: [
            "Unlimited messaging",
            "Send images & files in chat",
            "View exclusive locked content",
            "Advanced search filters",
            "Early access to new creators",
            "\"Top Supporter\" badge",
            "10% discount on tips",
        ],
        creatorFeatures: [
            "Verified badge eligibility",
            "Boosted discovery ranking",
            "Monetize locked posts",
            "Set subscription pricing",
            "Private premium chat rooms",
            "Advanced analytics",
            "10% platform fee",
            "Faster withdrawals",
        ],
    },
    {
        name: "Elite",
        price: "$79",
        period: "/month",
        icon: Crown,
        description: "For ultimate experience",
        memberFeatures: [
            "Priority inbox placement",
            "Exclusive VIP-only creators",
            "Unlimited file sharing",
            "Private request submissions",
            "VIP badge",
            "Profile highlighted in chats",
            "Dedicated support",
            "20% tip discount",
        ],
        creatorFeatures: [
            "Maximum algorithm boost",
            "Featured on homepage",
            "VIP creator badge",
            "Custom subscription tiers",
            "AI-powered growth insights",
            "5% platform fee",
            "Dedicated account manager",
            "Early payout access",
        ],
    },
];

export default function PremiumPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = useState<"member" | "creator">("member");

    const handleUpgrade = (planName: string, price: string) => {
        if (price === "$0") {
            router.push("/");
        } else if (!user) {
            router.push("/login");
        } else {
            router.push(`/payment?plan=${planName.toLowerCase()}`);
        }
    };

    return (
        <div className="min-h-screen text-white">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/10 hidden sm:block">
                    <XSidebar />
                </header>

                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] px-6 py-12">
                    <div className="max-w-5xl mx-auto">

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-14"
                        >
                            <h1 className="text-4xl font-bold mb-4">
                                Upgrade to <span className="text-pink-500">Premium</span>
                            </h1>
                            <p className="text-zinc-400 text-lg mb-8">
                                Unlock exclusive features and enjoy the full experience.
                            </p>

                            {/* Member / Creator Toggle */}
                            <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10">
                                <button
                                    onClick={() => setViewMode("member")}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                                        viewMode === "member"
                                            ? "bg-pink-500 text-black shadow-lg"
                                            : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    👨 For Members
                                </button>
                                <button
                                    onClick={() => setViewMode("creator")}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                                        viewMode === "creator"
                                            ? "bg-pink-500 text-black shadow-lg"
                                            : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    👩 For Creators
                                </button>
                            </div>
                        </motion.div>

                        {/* First Row: Free, Basic, Pro */}
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            {plans.slice(0, 3).map((plan, index) => {
                                const Icon = plan.icon;

                                return (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.15 }}
                                        className={cn(
                                            "relative rounded-3xl p-8 border backdrop-blur-xl bg-white/5 shadow-xl transition-all duration-300 hover:scale-105",
                                            plan.popular
                                                ? "border-pink-500 shadow-pink-500/20"
                                                : "border-zinc-800"
                                        )}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-black text-sm px-4 py-1 rounded-full font-semibold">
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center mb-6">
                                            <div className="p-4 rounded-full bg-pink-500/10">
                                                <Icon className="w-8 h-8 text-pink-500" />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-center mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-zinc-400 text-center mb-6">
                                            {plan.description}
                                        </p>

                                        <div className="text-center mb-8">
                                            <span className="text-4xl font-bold">
                                                {plan.price}
                                            </span>
                                            <span className="text-zinc-400">
                                                {plan.period}
                                            </span>
                                        </div>

                                        <ul className="space-y-4 mb-8">
                                            {(viewMode === "member" ? plan.memberFeatures : plan.creatorFeatures).map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-center gap-3 text-sm text-zinc-300"
                                                >
                                                    <Check className="w-4 h-4 text-pink-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleUpgrade(plan.name, plan.price)}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
                                                plan.popular
                                                    ? "bg-pink-500 text-black hover:bg-pink-400"
                                                    : plan.price === "$0"
                                                        ? "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                                        : "bg-zinc-800 hover:bg-zinc-700"
                                            )}
                                        >
                                            {plan.price === "$0" ? "Continue Free" : "Get Started"}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Second Row: Elite (centered) */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-start-2">
                                {(() => {
                                    const plan = plans[3];
                                    const Icon = plan.icon;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.45 }}
                                            className="relative rounded-3xl p-8 border backdrop-blur-xl bg-white/5 shadow-xl transition-all duration-300 hover:scale-105 border-zinc-800"
                                        >
                                            <div className="flex items-center justify-center mb-6">
                                                <div className="p-4 rounded-full bg-pink-500/10">
                                                    <Icon className="w-8 h-8 text-pink-500" />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-center mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-zinc-400 text-center mb-6">
                                                {plan.description}
                                            </p>

                                            <div className="text-center mb-8">
                                                <span className="text-4xl font-bold">{plan.price}</span>
                                                <span className="text-zinc-400">{plan.period}</span>
                                            </div>

                                            <ul className="space-y-4 mb-8">
                                                {(viewMode === "member" ? plan.memberFeatures : plan.creatorFeatures).map((feature) => (
                                                    <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                                                        <Check className="w-4 h-4 text-pink-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handleUpgrade(plan.name, plan.price)}
                                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all bg-zinc-800 hover:bg-zinc-700"
                                            >
                                                Get Started
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* ── Feature Comparison Table ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mt-20"
                        >
                            <h2 className="text-2xl font-bold text-center mb-2">Compare Plans</h2>
                            <p className="text-white/25 text-sm text-center mb-10">See what&apos;s included in each tier</p>

                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-5 border-b border-white/[0.06]">
                                    <div className="px-5 py-4 text-[13px] font-bold text-white/40">Enhanced Experience</div>
                                    <div className="px-4 py-4 text-[13px] font-bold text-emerald-400 text-center">Free</div>
                                    <div className="px-4 py-4 text-[13px] font-bold text-blue-400 text-center">Basic</div>
                                    <div className="px-4 py-4 text-[13px] font-bold text-pink-400 text-center">Pro</div>
                                    <div className="px-4 py-4 text-[13px] font-bold text-purple-400 text-center">Elite</div>
                                </div>

                                {[
                                    { feature: "Ads", values: ["Ads shown", "No ads", "No ads", "No ads"] },
                                    { feature: "Reply boost", values: ["—", "Smallest", "Larger", "Largest"] },
                                    { feature: "Profile badge", values: ["x", "x", "check", "check"] },
                                    { feature: "Edit posts", values: ["x", "check", "check", "check"] },
                                    { feature: "Longer posts", values: ["x", "check", "check", "check"] },
                                    { feature: "HD content", values: ["x", "check", "check", "check"] },
                                    { feature: "Download content", values: ["x", "x", "check", "check"] },
                                ].map((row, i) => (
                                    <div key={row.feature} className={cn("grid grid-cols-5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                                        <div className="px-5 py-3.5 text-[13px] text-white/50 font-medium">{row.feature}</div>
                                        {row.values.map((v, j) => (
                                            <div key={j} className="px-4 py-3.5 flex items-center justify-center">
                                                {v === "check" ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : v === "x" ? (
                                                    <span className="text-white/15 text-sm">✕</span>
                                                ) : (
                                                    <span className="text-[12px] text-white/40 text-center font-medium">{v}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Section: Messaging */}
                                <div className="grid grid-cols-5 border-t border-white/[0.06]">
                                    <div className="px-5 py-4 text-[13px] font-bold text-white/40">Messaging</div>
                                    <div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" />
                                </div>

                                {[
                                    { feature: "Daily messages", values: ["3/day", "20/day", "Unlimited", "Unlimited"] },
                                    { feature: "Send images in chat", values: ["x", "x", "check", "check"] },
                                    { feature: "Send files in chat", values: ["x", "x", "check", "check"] },
                                    { feature: "Priority inbox", values: ["x", "x", "x", "check"] },
                                    { feature: "Private requests", values: ["x", "x", "x", "check"] },
                                ].map((row, i) => (
                                    <div key={row.feature} className={cn("grid grid-cols-5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                                        <div className="px-5 py-3.5 text-[13px] text-white/50 font-medium">{row.feature}</div>
                                        {row.values.map((v, j) => (
                                            <div key={j} className="px-4 py-3.5 flex items-center justify-center">
                                                {v === "check" ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : v === "x" ? (
                                                    <span className="text-white/15 text-sm">✕</span>
                                                ) : (
                                                    <span className="text-[12px] text-white/40 text-center font-medium">{v}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Section: Creator Tools */}
                                <div className="grid grid-cols-5 border-t border-white/[0.06]">
                                    <div className="px-5 py-4 text-[13px] font-bold text-white/40">Creator Tools</div>
                                    <div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" />
                                </div>

                                {[
                                    { feature: "Upload limit", values: ["10/month", "Unlimited", "Unlimited", "Unlimited"] },
                                    { feature: "Verified badge", values: ["x", "x", "check", "check"] },
                                    { feature: "Discovery boost", values: ["x", "Small", "Large", "Maximum"] },
                                    { feature: "Monetize locked posts", values: ["x", "x", "check", "check"] },
                                    { feature: "Subscription pricing", values: ["x", "x", "check", "check"] },
                                    { feature: "Premium chat rooms", values: ["x", "x", "check", "check"] },
                                    { feature: "Custom sub tiers", values: ["x", "x", "x", "check"] },
                                    { feature: "Featured on homepage", values: ["x", "x", "x", "check"] },
                                    { feature: "AI growth insights", values: ["x", "x", "x", "check"] },
                                ].map((row, i) => (
                                    <div key={row.feature} className={cn("grid grid-cols-5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                                        <div className="px-5 py-3.5 text-[13px] text-white/50 font-medium">{row.feature}</div>
                                        {row.values.map((v, j) => (
                                            <div key={j} className="px-4 py-3.5 flex items-center justify-center">
                                                {v === "check" ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : v === "x" ? (
                                                    <span className="text-white/15 text-sm">✕</span>
                                                ) : (
                                                    <span className="text-[12px] text-white/40 text-center font-medium">{v}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Section: Monetization */}
                                <div className="grid grid-cols-5 border-t border-white/[0.06]">
                                    <div className="px-5 py-4 text-[13px] font-bold text-white/40">Monetization</div>
                                    <div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" /><div className="px-4 py-4" />
                                </div>

                                {[
                                    { feature: "Platform fee", values: ["20%", "15%", "10%", "5%"] },
                                    { feature: "Tip creators", values: ["x", "check", "check", "check"] },
                                    { feature: "Tip discount", values: ["—", "—", "10% off", "20% off"] },
                                    { feature: "Withdraw earnings", values: ["x", "check", "check", "check"] },
                                    { feature: "Fast withdrawals", values: ["x", "x", "check", "check"] },
                                    { feature: "Early payout access", values: ["x", "x", "x", "check"] },
                                    { feature: "Account manager", values: ["x", "x", "x", "check"] },
                                ].map((row, i) => (
                                    <div key={row.feature} className={cn("grid grid-cols-5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                                        <div className="px-5 py-3.5 text-[13px] text-white/50 font-medium">{row.feature}</div>
                                        {row.values.map((v, j) => (
                                            <div key={j} className="px-4 py-3.5 flex items-center justify-center">
                                                {v === "check" ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : v === "x" ? (
                                                    <span className="text-white/15 text-sm">✕</span>
                                                ) : (
                                                    <span className="text-[12px] text-white/40 text-center font-medium">{v}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
}
