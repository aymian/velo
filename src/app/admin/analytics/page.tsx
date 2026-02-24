"use client";

import React from "react";
import {
    BarChart3,
    PieChart,
    LineChart,
    Globe,
    Smartphone,
    TrendingUp,
    Users,
    Zap,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAnalytics() {
    return (
        <div className="space-y-10 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Deep Intelligence</h1>
                    <p className="text-white/40 text-sm font-medium">Aggregated platform analytics, retention metrics and demographic data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                        <Calendar className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Retention Rate", value: "64.8%", change: "+2.1%", trend: "up", icon: TrendingUp },
                    { label: "Avg Session", value: "14m 24s", change: "+14s", trend: "up", icon: Zap },
                    { label: "Daily Active Users", value: "8,940", change: "+412", trend: "up", icon: Users },
                    { label: "Bounce Rate", value: "24.2%", change: "-1.4%", trend: "up", icon: ArrowDownRight },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0d0d0d] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 bg-white/5 rounded-xl text-white/30">
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1",
                                stat.trend === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1 block">{stat.label}</span>
                            <span className="text-2xl font-black text-white">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Growth Chart Placeholder */}
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 flex flex-col h-[450px]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-[#FF2D55]" />
                            <h3 className="text-xl font-black text-white tracking-tight">Revenue Dynamics</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-white/30">
                                <div className="w-2 h-2 rounded-full bg-[#FF2D55]" /> Subscription
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-white/30 ml-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Gems
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 pb-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                                <div style={{ height: `${Math.random() * 40 + 20}%` }} className="w-full bg-blue-500/40 rounded-t-sm" />
                                <div style={{ height: `${Math.random() * 40 + 10}%` }} className="w-full bg-[#FF2D55]/60 rounded-t-sm" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between pt-6 border-t border-white/5 text-[10px] font-black text-white/10 uppercase tracking-widest">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Country breakdown */}
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-10">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-black text-white tracking-tight">Global Distribution</h3>
                    </div>
                    <div className="space-y-8 flex-1">
                        {[
                            { name: "United States", val: 42, color: "#FF2D55" },
                            { name: "Germany", val: 18, color: "#7c4dff" },
                            { name: "Japan", val: 14, color: "#A855F7" },
                            { name: "United Kingdom", val: 12, color: "#3b82f6" },
                            { name: "Others", val: 14, color: "#ffffff20" },
                        ].map((c, i) => (
                            <div key={i} className="space-y-2.5 text-xs font-bold uppercase tracking-widest group">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/40 group-hover:text-white transition-colors">{c.name}</span>
                                    <span className="text-white">{c.val}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                    <div style={{ width: `${c.val}%`, backgroundColor: c.color }} className="h-full rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Device breakdown */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-3 mb-10">
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xl font-black text-white tracking-tight">Platform Utilization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center text-center gap-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Mobile iOS</span>
                        <span className="text-4xl font-black text-white">58%</span>
                        <div className="w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
                    </div>
                    <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center text-center gap-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Mobile Android</span>
                        <span className="text-4xl font-black text-white">32%</span>
                        <div className="w-full h-1 bg-gradient-to-r from-emerald-500/0 via-blue-500 to-emerald-500/0" />
                    </div>
                    <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center text-center gap-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Desktop / Web</span>
                        <span className="text-4xl font-black text-white">10%</span>
                        <div className="w-full h-1 bg-gradient-to-r from-emerald-500/0 via-white/20 to-emerald-500/0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
