"use client";

import React from "react";
import {
    ShieldAlert,
    MoreHorizontal,
    Flag,
    Trash2,
    UserX,
    Eye,
    CheckCircle2,
    X,
    MessageCircle,
    FileSearch
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAdminReports } from "@/lib/firebase/admin-hooks";
import { Loader2 } from "lucide-react";

export default function AdminReports() {
    const { data: reports, isLoading } = useAdminReports();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Analyzing Threats...</span>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Threat Assessment</h1>
                    <p className="text-white/40 text-sm font-medium">Review and resolve platform reports, disputes and violations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] animate-pulse" /> Live Feed
                    </span>
                </div>
            </div>

            {/* Main Reports Table */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button className="text-xs font-black uppercase tracking-widest text-[#FF2D55]">Pending ({reports?.length || 0})</button>
                        <button className="text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">Resolved</button>
                        <button className="text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">Archived</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01] border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold">Ref ID</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold">Reporter</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold">Target Instance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold">Violation Type</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold">Priority</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reports?.map((report: any) => (
                                <tr key={report.id} className="group hover:bg-white/[0.01] transition-colors cursor-pointer">
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-white/40 font-mono tracking-tighter group-hover:text-[#FF2D55] transition-colors">{report.id.slice(0, 8)}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
                                            <span className="text-sm font-bold text-white">@{report.reporterId?.slice(0, 8) || 'anonymous'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:underline">@{report.targetId || 'unknown'}</span>
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{report.contentType || 'Instance'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-3 h-3 text-[#FF2D55]" />
                                            <span className="text-xs font-bold text-white">{report.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest",
                                            report.priority === "Critical" ? "bg-[#FF2D55]/20 border-[#FF2D55]/30 text-[#FF2D55]" :
                                                report.priority === "High" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                                                    "bg-white/5 border-white/10 text-white/30"
                                        )}>
                                            {report.priority || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2.5 bg-white/5 rounded-xl text-white/30 hover:text-white transition-all"><FileSearch className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-white/5 rounded-xl text-white/30 hover:text-emerald-500 transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-[#FF2D55]/10 rounded-xl text-[#FF2D55] hover:bg-[#FF2D55]/20 transition-all"><UserX className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reports?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <span className="text-white/20 text-xs font-black uppercase tracking-widest">No active threats detected.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Status Update Logs */}
                <div className="p-8 bg-black/40 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                            <MessageCircle className="w-3.5 h-3.5" /> 84 Total Actions Taken Today
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Avg Resolution Time: 14.2m
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
