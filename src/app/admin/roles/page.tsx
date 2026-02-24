"use client";

import React from "react";
import { UserCog, ShieldCheck, Lock, ShieldAlert, Key, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminRoles() {
    return (
        <div className="space-y-10 max-w-5xl mx-auto text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter mb-1">Access Control</h1>
                    <p className="text-white/40 text-sm font-medium">Define and manage administrative roles and permissions.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#FF2D55] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                    <Plus className="w-4 h-4" /> Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Super Admin", count: 2, level: "Lvl 10", color: "#FF2D55", desc: "Full system access including financial management." },
                    { name: "Moderator", count: 12, level: "Lvl 5", color: "#A855F7", desc: "Manage content, reports and user status." },
                    { name: "Support", count: 8, level: "Lvl 3", color: "#3b82f6", desc: "Ticket resolution and user communication." },
                    { name: "Financial Auditor", count: 3, level: "Lvl 7", color: "#fbbf24", desc: "Withdrawal approval and revenue tracking." },
                ].map((role, i) => (
                    <div key={i} className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-white/20 transition-all flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                <ShieldCheck className="w-6 h-6" style={{ color: role.color }} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{role.level}</span>
                        </div>
                        <div className="space-y-2 flex-1">
                            <h3 className="text-xl font-black tracking-tighter">{role.name}</h3>
                            <p className="text-xs text-white/40 font-medium leading-relaxed">{role.desc}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <span className="text-xs font-bold text-white/60">{role.count} Active Users</span>
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#FF2D55] hover:underline">Edit Rights</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
