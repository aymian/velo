"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    Check, 
    X, 
    Zap, 
    Crown, 
    Star, 
    Shield, 
    Sparkles, 
    Flame, 
    Clock, 
    Lock, 
    Play, 
    Video, 
    MessageSquare, 
    Download, 
    Trophy,
    Heart,
    Search,
    Bell,
    Settings,
    Eye,
    ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PLANS = [
    {
        name: "Free",
        id: "free",
        price: "$0",
        period: "/ month",
        tagline: "Explore safely",
        description: "Best for casual viewers.",
        cta: "Start Free",
        highlight: false,
        popular: false,
        features: [
            "Browse public 18+ feed",
            "Watch limited preview clips",
            "View blurred premium content",
            "Follow creators",
            "Like posts",
            "Comment on public posts",
            "Save posts to favorites",
            "Search creators",
            "Search tags & moods",
            "View trending section",
            "Create personal profile",
            "Upload profile photo",
            "Basic notifications",
            "Access suggested creators",
            "Limited daily previews",
            "Report content",
            "Basic privacy controls",
            "Access community guidelines",
            "720p maximum streaming",
            "Access public creator bios"
        ],
        notIncluded: [
            "Full unblurred premium videos",
            "Exclusive VIP drops",
            "Download videos",
            "Private messaging",
            "4K streaming",
            "Early access content",
            "VIP badge"
        ]
    },
    {
        name: "VIP PRO",
        id: "vip",
        price: "$14.99",
        period: "/ month",
        tagline: "Full access unlocked",
        description: "Full unrestricted access to premium content.",
        cta: "Go VIP Now",
        highlight: true,
        popular: true,
        glowColor: "rgba(139, 92, 246, 0.3)", // Purple glow
        features: [
            "Everything in Free plus:",
            "Full unblurred premium videos",
            "Unlimited streaming access",
            "1080p & 4K playback",
            "Exclusive VIP-only content",
            "Early access to new uploads",
            "Private creator messaging",
            "Request custom content",
            "Download videos (Monthly limit)",
            "Ad-free experience",
            "VIP profile badge",
            "Priority comment ranking",
            "Priority recommendations",
            "Advanced content filters",
            "After Dark exclusive category",
            "Private bookmark collections",
            "Creator tipping feature",
            "Private hidden favorites",
            "Premium support access",
            "VIP-only trending board",
            "Unlock bundle discounts",
            "Access to limited-time drops",
            "Custom notification controls",
            "Priority streaming servers",
            "Multi-device sync",
            "Advanced search filtering",
            "HD preview thumbnails",
            "Creator live drop alerts",
            "Loyalty rewards system",
            "Experimental features access"
        ]
    },
    {
        name: "ELITE",
        id: "elite",
        price: "$29.99",
        period: "/ month",
        tagline: "The power user tier",
        description: "For users who want the absolute best.",
        cta: "Become Elite",
        highlight: false,
        popular: false,
        features: [
            "Everything in VIP plus:",
            "Monthly exclusive private collection",
            "Higher download limits",
            "Priority creator responses",
            "Exclusive Elite badge",
            "Beta feature access",
            "Direct tipping bonuses",
            "VIP-only community access",
            "Personalized recommendations",
            "VIP support concierge"
        ]
    }
];

export default function PlansPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden pb-20">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-red-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Header section */}
            <section className="relative pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge className="mb-6 bg-white/5 border-white/10 text-zinc-400 py-1 px-4 text-xs font-bold tracking-widest uppercase">
                        Pricing Plans
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Unlock Your Velocity.
                    </h1>
                    <p className="text-zinc-500 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                        Choose the access level that fits your lifestyle. From casual discovery to unrestricted premium content.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${billingCycle === "monthly" ? "text-white" : "text-zinc-600"}`}>Monthly</span>
                        <button 
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-14 h-7 bg-zinc-900 border border-white/5 rounded-full relative transition-all"
                        >
                            <motion.div 
                                animate={{ x: billingCycle === "monthly" ? 4 : 32 }}
                                className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-lg"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${billingCycle === "yearly" ? "text-white" : "text-zinc-600"}`}>Yearly</span>
                            <span className="bg-green-500 text-[10px] text-black font-black px-2 py-0.5 rounded-full uppercase">Save 20%</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="relative max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {PLANS.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 bg-[#0a0a0a]/80 backdrop-blur-xl ${
                                plan.highlight 
                                ? "border-purple-500/50 scale-105 z-10 shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)]" 
                                : "border-white/5 hover:border-white/10"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2 block">{plan.tagline}</span>
                                <h3 className="text-3xl font-black mb-4 tracking-tight flex items-center gap-2">
                                    {plan.name}
                                    {plan.id === 'vip' && <Crown className="w-5 h-5 text-purple-500" />}
                                    {plan.id === 'elite' && <Star className="w-5 h-5 text-amber-500" />}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-5xl font-black tracking-tighter">
                                        {billingCycle === "yearly" ? `$${(parseFloat(plan.price.replace('$','')) * 0.8).toFixed(2)}` : plan.price}
                                    </span>
                                    <span className="text-zinc-600 font-bold uppercase text-xs tracking-widest">{plan.period}</span>
                                </div>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{plan.description}</p>
                            </div>

                            <Link 
                                href={plan.id === 'free' ? '/signup' : `/checkout?plan=${plan.id}`}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-center transition-all mb-10 ${
                                    plan.highlight
                                    ? "bg-white text-black hover:bg-zinc-200"
                                    : "bg-zinc-900 text-white border border-white/5 hover:bg-zinc-800"
                                }`}
                            >
                                {plan.cta}
                            </Link>

                            {/* Features List */}
                            <div className="space-y-4 flex-1">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-4 border-b border-white/5 pb-2">
                                    {plan.features.length} Access Features
                                </span>
                                <ul className="space-y-4">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 group">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? "text-purple-500" : "text-zinc-700"}`}>
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors tracking-tight leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.notIncluded?.map((feature, fIdx) => (
                                        <li key={`not-${fIdx}`} className="flex items-start gap-3 opacity-30 grayscale saturate-0">
                                            <div className="mt-0.5 text-zinc-900">
                                                <X className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-800 tracking-tight leading-relaxed line-through">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {plan.id === "vip" && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase text-center tracking-widest">
                                        Cancel anytime. Instant upgrade.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="mt-32 px-6 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="p-12 rounded-[40px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5"
                >
                    <div className="flex justify-center -space-x-4 mb-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-900 overflow-hidden shadow-2xl">
                                <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-4 border-black bg-purple-600 flex items-center justify-center text-xs font-black shadow-2xl">
                            +24k
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mb-4 tracking-tight">Join 24,000+ VIP Members</h2>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                        Experience Velocity without limits. Limited launch discount currently active.
                    </p>
                </motion.div>
            </section>

            {/* FAQ / Simple Toggle section */}
            <section className="mt-32 max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 mb-4 text-center">Inquiry Registry</h2>
                    <h3 className="text-3xl font-black tracking-tight">Got Questions?</h3>
                </div>
                
                <div className="space-y-4">
                    {[
                        { q: "Is billing discreet?", a: "Yes. All transactions appear as 'VELO DIGITAL' on your statement for total privacy." },
                        { q: "Can I cancel my VIP subscription?", a: "You can cancel anytime from your settings. You will retain access until the end of your billing period." },
                        { q: "What is After Dark exclusive?", a: "After Dark is a premium category reserved for VIP and ELITE members featuring raw, experimental, and behind-the-scenes content." }
                    ].map((faq, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{faq.q}</h4>
                                <ChevronDown className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                            </div>
                            <p className="mt-4 text-zinc-500 text-sm font-medium leading-relaxed hidden group-hover:block transition-all">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-40 border-t border-white/5 py-20 px-6 text-center">
                <Link href="/">
                    <h2 className="text-2xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-zinc-800 bg-clip-text text-transparent">VELO.</h2>
                </Link>
                <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-10">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-white transition-colors">Safety Center</Link>
                    <Link href="#" className="hover:text-white transition-colors">Support</Link>
                </div>
                <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
                    © 2026 VELO MULTIMEDIA. PART OF THE MORA NETWORK.
                </p>
            </footer>
        </div>
    );
}
