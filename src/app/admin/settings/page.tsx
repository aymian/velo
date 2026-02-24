"use client";

import React, { useState } from "react";
import {
    Settings,
    Shield,
    HardDrive,
    MessageSquare,
    Users,
    Bell,
    Globe,
    Lock,
    Save,
    Power,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
    const [maintenance, setMaintenance] = useState(false);

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">System Configuration</h1>
                    <p className="text-white/40 text-sm font-medium">Global environment variables, policy editors and system toggles.</p>
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-[#FF2D55] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20">
                    <Save className="w-4 h-4" /> Save Global State
                </button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Critical System Control */}
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#FF2D55]/10 rounded-xl text-[#FF2D55]">
                                <Power className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-white">Maintenance Mode</span>
                                <span className="text-xs text-white/30 font-medium">Immediately restrict public access to all nodes</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setMaintenance(!maintenance)}
                            className={cn(
                                "w-16 h-8 rounded-full relative transition-all duration-300 p-1",
                                maintenance ? "bg-[#FF2D55]" : "bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-all duration-300",
                                maintenance ? "translate-x-8" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>

                {/* Normal Settings Categories */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Upload Limits */}
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <HardDrive className="w-5 h-5 text-blue-500" />
                            <h3 className="text-xl font-black text-white tracking-tight">Resource Management</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Max Upload Size (MB)</label>
                                <input type="number" defaultValue={500} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500/30 transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Daily Creation Limit</label>
                                <input type="number" defaultValue={20} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500/30 transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Social Controls */}
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-purple-500" />
                            <h3 className="text-xl font-black text-white tracking-tight">Social Parameters</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Enable Global Comments", desc: "Allow users to post replies on all content", default: true },
                                { label: "Content Transcription", desc: "AI generated captions for accessibility", default: true },
                                { label: "Strict 18+ Verification", desc: "Force ID check for all creator accounts", default: true },
                                { label: "Push Event Notifications", desc: "Global broadcast for all live events", default: false }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-[#FF2D55] transition-colors">{s.label}</span>
                                        <span className="text-xs text-white/20 font-medium">{s.desc}</span>
                                    </div>
                                    <button className={cn(
                                        "w-12 h-6 rounded-full relative transition-all p-1",
                                        s.default ? "bg-emerald-500/40" : "bg-white/5"
                                    )}>
                                        <div className={cn("w-4 h-4 rounded-full bg-white", s.default ? "translate-x-6" : "translate-x-0")} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Policy */}
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <h3 className="text-xl font-black text-white tracking-tight">Policy & Governance</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Platform Content Policy (Markdown)</label>
                            <textarea
                                className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-sm font-medium text-white/70 focus:outline-none focus:border-amber-500/20 transition-all resize-none font-mono leading-relaxed"
                                defaultValue={`# Veeloo Safety Standards\n\n1. No illegal content.\n2. Respect intellectual property.\n3. Zero tolerance for harassment.\n4. Age disclosure is mandatory.`}
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-950/20 border border-red-900/30 rounded-[2rem] p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                        <h3 className="text-xl font-black text-rose-500 tracking-tight">Danger Zone</h3>
                    </div>
                    <p className="text-rose-500/40 text-sm font-medium">Critical system operations. These actions cannot be undone and may cause platform instability.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 border border-red-900/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">Clear Edge Cache</button>
                        <button className="px-6 py-3 border border-red-900/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">Re-index All Posts</button>
                        <button className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Reset System State</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
