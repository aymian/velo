"use client";

import React from "react";
import {
    Users,
    Zap,
    PlaySquare,
    ShieldAlert,
    DollarSign,
    MoreHorizontal,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";

import { useAdminStats, useAdminReports } from "@/lib/firebase/admin-hooks";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = useAdminStats();
    const { data: reports, isLoading: reportsLoading } = useAdminReports();

    if (statsLoading || reportsLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Gathering Intelligence...</span>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Command Dashboard</h1>
                    <p className="text-white/40 text-sm font-medium">Real-time platform overview and intelligence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FF2D55] rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-pink-500/10 hover:scale-105 transition-all">
                        <Zap className="w-3.5 h-3.5" /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers?.toLocaleString() || "0"}
                    change="+12%"
                    trend="up"
                    icon={Users}
                    color="white"
                />
                <StatCard
                    title="Active Today"
                    value={stats?.activeToday?.toLocaleString() || "0"}
                    change="+5.4%"
                    trend="up"
                    icon={Zap}
                    color="green"
                />
                <StatCard
                    title="Total Posts"
                    value={stats?.totalPosts?.toLocaleString() || "0"}
                    change="-2.1%"
                    trend="down"
                    icon={PlaySquare}
                    color="blue"
                />
                <StatCard
                    title="Reports Pending"
                    value={stats?.pendingReports?.toString() || "0"}
                    change="Critical"
                    trend="down"
                    icon={ShieldAlert}
                    color="pink"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`}
                    change="+24%"
                    trend="up"
                    icon={DollarSign}
                    color="purple"
                />
            </div>

            {/* Main Charts / Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Growth Chart Placeholder & Recent Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white tracking-tight">Growth Analytics</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF2D55]">7 Days</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">30 Days</span>
                            </div>
                        </div>
                        {/* Simplified Chart Visualization */}
                        <div className="flex-1 flex items-end gap-1.5 pt-4">
                            {[30, 45, 25, 60, 80, 55, 90, 40, 70, 85, 50, 65, 95, 45, 60, 30, 80, 20, 55, 90].map((h, i) => (
                                <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="flex-1 bg-gradient-to-t from-[#FF2D55]/5 to-[#FF2D55]/60 rounded-t-lg transition-all duration-500 hover:from-[#FF2D55]/20 hover:to-[#FF2D55]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent Reports Table */}
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-black text-white tracking-tight">Urgent Reports</h3>
                            <button className="text-xs font-bold text-white/30 hover:text-[#FF2D55] transition-colors uppercase tracking-widest">View All</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {reports?.slice(0, 4).map((report: any, i) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">@{report.targetId || 'unknown'}</span>
                                            <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest">{report.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[11px] text-white/20 font-bold uppercase">{report.createdAt?.toDate?.() ? report.createdAt.toDate().toLocaleDateString() : 'recent'}</span>
                                        <span className={cn(
                                            "text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest",
                                            report.priority === "Critical" ? "bg-[#FF2D55]/10 border-[#FF2D55]/20 text-[#FF2D55]" : "bg-white/5 border-white/10 text-white/40"
                                        )}>
                                            {report.status || 'New'}
                                        </span>
                                        <button className="p-2 text-white/20 group-hover:text-white transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {reports?.length === 0 && (
                                <div className="p-10 text-center">
                                    <span className="text-white/20 text-xs font-black uppercase tracking-widest">Platform is secured. No pending threats.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Top Creators & Engagement Stats */}
                <div className="space-y-8">
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6">
                        <h3 className="text-lg font-black text-white tracking-tight mb-6">Top Performers</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Sienna Blaze", username: "sienna_v", revenue: "$12,402", growth: "+15%" },
                                { name: "Maximus Velo", username: "max_power", revenue: "$9,840", growth: "+8%" },
                                { name: "Luna Digital", username: "luna_stream", revenue: "$8,200", growth: "+22%" },
                                { name: "Aris Thorne", username: "aris_t", revenue: "$7,550", growth: "+5%" },
                                { name: "Vera Storm", username: "vera_vip", revenue: "$6,900", growth: "+12%" },
                            ].map((creator, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white/40">
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-white">{creator.name}</span>
                                            <span className="text-[11px] text-white/30 font-medium">@{creator.username}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[13px] font-black text-white">{creator.revenue}</span>
                                        <span className="text-[10px] font-bold text-emerald-500">{creator.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            Full Leaderboard
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#FF2D55] to-[#A855F7] rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10 space-y-6">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit">
                                <ShieldAlert className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-white leading-tight">System Operational Status</h4>
                                <p className="text-white/80 text-sm font-medium">All nodes active. Cache pulse optimal. Total uptime 99.98%.</p>
                            </div>
                            <button className="w-full py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                                Check Logs
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
