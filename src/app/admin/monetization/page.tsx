"use client";

import React, { useState } from "react";
import {
    DollarSign,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
    ShieldCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Sliders,
    Zap
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";

export default function AdminMonetization() {
    const [commission, setCommission] = useState(20);

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Financial Intelligence</h1>
                    <p className="text-white/40 text-sm font-medium">Control platform monetization, commissions and withdrawal approvals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#FF2D55]/10 border border-[#FF2D55]/20 text-[#FF2D55] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF2D55]/20 transition-all">
                        <Zap className="w-4 h-4" /> Freeze Payouts
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                        <DollarSign className="w-4 h-4" /> Global Settings
                    </button>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Platform Revenue" value="$482,900" change="+14.2%" trend="up" icon={TrendingUp} color="purple" />
                <StatCard title="Creator Payouts" value="$386,400" change="+8.1%" trend="up" icon={CreditCard} color="blue" />
                <StatCard title="Pending Withdrawals" value="42" change="Action Req." trend="down" icon={Clock} color="pink" />
                <StatCard title="Total Gem Sales" value="1.2M" change="+22%" trend="up" icon={Zap} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Withdrawal Queue */}
                <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-black text-white tracking-tight">Withdrawal Requests</h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-white/40">Latest</button>
                            <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-white/40">Highest</button>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[
                            { name: "Lexi Velo", amount: "$4,200", method: "Circle/USDC", date: "4m ago", status: "Pending" },
                            { name: "Maximus Thorne", amount: "$12,800", method: "Bank Wire", date: "1h ago", status: "Reviewing" },
                            { name: "Jade Moon", amount: "$850", method: "PayPal", date: "3h ago", status: "Pending" },
                            { name: "Sienna Blaze", amount: "$3,120", method: "Stripe", date: "12h ago", status: "Pending" },
                        ].map((req, i) => (
                            <div key={i} className="flex items-center justify-between p-8 group hover:bg-white/[0.01] transition-colors">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white/20" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-white tracking-tight">{req.name}</span>
                                        <span className="text-xs text-white/30 font-medium">{req.method} · {req.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-black text-white">{req.amount}</span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Calculated Net</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">Approve</button>
                                        <button className="p-2 text-white/10 hover:text-[#FF2D55] transition-colors"><XCircle className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-6 text-xs font-black text-white/20 uppercase tracking-[0.2em] hover:text-[#FF2D55] transition-colors">Resolve Full Buffer Queue</button>
                </div>

                {/* Economic Controls */}
                <div className="space-y-8">
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Sliders className="w-5 h-5 text-[#FF2D55]" />
                            <h3 className="text-xl font-black text-white tracking-tight">System Controls</h3>
                        </div>

                        <div className="space-y-10">
                            {/* Commission Slider Placeholder */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Platform Commission</span>
                                        <span className="text-xs text-white/30 font-medium">Global fee taken from creators</span>
                                    </div>
                                    <span className="text-2xl font-black text-[#FF2D55]">{commission}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={commission}
                                    onChange={(e) => setCommission(parseInt(e.target.value))}
                                    className="w-full accent-[#FF2D55] h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    <span>Minimal (0%)</span>
                                    <span>Extreme (50%)</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white">Min. Withdrawal</span>
                                    <span className="text-lg font-black text-white">$50.00</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white">Auto-payouts</span>
                                    <div className="w-12 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full translate-x-6" />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl">
                                Commit Financial Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] mb-6 text-center">Security Buffer</h3>
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 border-4 border-white/5 flex items-center justify-center p-4">
                                <ShieldCheck className="w-full h-full text-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-2xl font-black text-white">$145,200</span>
                                <p className="text-xs text-white/30 font-medium">Current Platform Safety Reserve</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
