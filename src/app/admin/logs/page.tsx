"use client";

import React from "react";
import { Terminal, Database, Shield, Zap, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_LOGS = [
    { id: 1, event: "Financial Parameter Change", user: "admin_1", details: "Commission was updated to 20%", type: "System", date: "1m ago" },
    { id: 2, event: "User Status Changed", user: "mod_jade", details: "User @alex_r was banned (Reason: Spam)", type: "Mod", date: "12m ago" },
    { id: 3, event: "Database Backup", user: "System", details: "Snapshot created: backup_2026_02_23.sql", type: "Storage", date: "45m ago" },
    { id: 4, event: "Cache Purge", user: "admin_2", details: "Global edge cache cleared", type: "Dev", date: "2h ago" },
    { id: 5, event: "Access Denied", user: "guest_84", details: "Failed login attempt detected from 192.168.1.1", type: "Security", date: "3h ago" },
    { id: 6, event: "API Key Generated", user: "admin_1", details: "New integration key created for billing_service", type: "Dev", date: "5h ago" },
];

export default function AdminLogs() {
    return (
        <div className="space-y-10 max-w-6xl mx-auto text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter mb-1">System Logs</h1>
                    <p className="text-white/40 text-sm font-medium">Real-time terminal for all administrative and system events.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" placeholder="Search logs..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-xs font-bold focus:outline-none" />
                    </div>
                </div>
            </div>

            <div className="bg-black border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl font-mono">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF2D55] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF2D55] font-sans">Live Runtime Log Feed</span>
                    </div>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {MOCK_LOGS.map((log) => (
                        <div key={log.id} className="p-6 flex items-start gap-10 hover:bg-white/[0.02] transition-colors group">
                            <span className="text-[11px] text-white/10 shrink-0 w-16">{log.date}</span>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest font-sans",
                                        log.type === "Security" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : "text-white/30 bg-white/5 border-white/10"
                                    )}>{log.type}</span>
                                    <span className="text-sm font-black text-white group-hover:text-[#FF2D55] transition-colors">{log.event}</span>
                                    <span className="text-xs text-white/20">by @{log.user}</span>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed font-sans">{log.details}</p>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-white transition-colors font-sans opacity-0 group-hover:opacity-100 italic">Trace Event</button>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white/[0.01] text-center">
                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-white transition-all">End of Log Stream</button>
                </div>
            </div>
        </div>
    );
}
