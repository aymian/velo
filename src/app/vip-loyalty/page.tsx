"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Lock,
    EyeOff,
    UserPlus,
    Gift,
    Headphones,
    Users,
    Crown
} from "lucide-react";
import * as Separator from "@radix-ui/react-separator";

export default function LoyaltyPage() {
    const benefits = [
        {
            title: "Avatar Gift",
            desc: "Send a Gift of your VIP Status icon",
            icon: <Crown className="w-5 h-5 text-slate-300" />,
            status: "unlocked"
        },
        {
            title: "Invisible Mode",
            desc: "Watch live streams anonymously",
            icon: <EyeOff className="w-5 h-5 text-slate-300" />,
            status: "unlocked"
        },
        {
            title: "Custom Gift",
            desc: "Create your own Gift each month",
            val: "3",
            status: "unlocked"
        },
        {
            title: "Status Gifts",
            desc: "Get a free Gift every week",
            val: "100",
            status: "unlocked"
        },
        {
            title: "Coin Coupons",
            desc: "Extra Coins on selected offers monthly",
            icon: <Lock className="w-5 h-5 text-white/20" />,
            status: "locked"
        },
        {
            title: "VIP Manager",
            desc: "Access personal support anytime",
            icon: <Lock className="w-5 h-5 text-white/20" />,
            status: "locked"
        },
        {
            title: "VIP Friend",
            desc: "Add a VIP badge to your friend's profile",
            icon: <Lock className="w-5 h-5 text-white/20" />,
            status: "locked"
        }
    ];

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-[#ff2d55]">
            <Navbar />

            <div className="relative z-10 pt-32 pb-40 flex flex-col items-center">
                {/* VIP Loyalty Title */}
                <h1 className="text-3xl font-bold mb-12">VIP Loyalty</h1>

                {/* Status Carousel/Selector */}
                <div className="flex items-center gap-12 mb-4">
                    <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="relative flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-400 to-slate-200 p-1 mb-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                            <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://ui-avatars.com/api/?name=VIP&background=333&color=fff&size=128"
                                    alt="Status Avatar"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                            {/* Status Badge Overlap */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 p-1.5 rounded-full shadow-lg">
                                <Crown className="w-4 h-4 text-black" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Silver Status</h2>
                    </div>

                    <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Carousel Dots */}
                <div className="flex gap-2 mb-16">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                </div>

                {/* Progress Section */}
                <div className="w-full max-w-lg px-6 mb-12">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-lg font-bold text-white">$250 to upgrade your Status</span>
                        <span className="text-sm font-medium text-white/50 lowercase">Silver</span>
                    </div>

                    <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-2">
                        <div className="absolute top-0 left-0 h-full w-[0%] bg-white/20 rounded-full" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#1a1a1a] bg-white/20 flex items-center justify-center text-[10px] font-bold">
                            0%
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full border-4 border-[#1a1a1a] bg-white/10 flex items-center justify-center">
                            <div className="p-2 bg-[#222] rounded-full border border-white/10">
                                <Lock className="w-5 h-5 text-white/40" />
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-10">
                        Based on your purchases in the last 30 days
                    </p>
                </div>

                {/* Main Upgrade Action */}
                <button className="w-full max-w-[340px] py-4 rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF4D6D] text-white font-bold text-lg shadow-[0_10px_30px_rgba(255,45,85,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mb-20">
                    Upgrade Status
                </button>

                <Separator.Root className="w-full max-w-2xl bg-white/5 h-px mb-12 dashed" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 50%, transparent 50%)', backgroundSize: '10px 1px', backgroundRepeat: 'repeat-x', height: '1px', backgroundColor: 'transparent' }} />

                {/* Benefits Section */}
                <div className="w-full max-w-2xl px-6 align-left">
                    <h3 className="text-xl font-bold mb-8 text-left">Benefits</h3>
                    <div className="flex flex-col gap-8">
                        {benefits.map((item, idx) => (
                            <div key={idx} className={`flex items-center justify-between group ${item.status === 'locked' ? 'opacity-30' : ''}`}>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                                    <p className="text-sm text-white/40">{item.desc}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {item.val && <span className="text-lg font-black text-white">{item.val === '100' && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block mr-2" />} {item.val}</span>}
                                    {item.icon && <div className="p-1">{item.icon}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
