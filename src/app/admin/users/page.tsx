"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    CheckCircle2,
    Ban,
    Mail,
    ExternalLink,
    Trash2,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useAdminUsers, useUpdateUserStatus } from "@/lib/firebase/admin-hooks";
import { Loader2 } from "lucide-react";

export default function AdminUsers() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const router = useRouter();
    const { data: users, isLoading } = useAdminUsers(filter);
    const updateUserStatus = useUpdateUserStatus();

    const filteredUsers = users?.filter(u =>
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Querying Database...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">User Directory</h1>
                    <p className="text-white/40 text-sm font-medium">Manage all platform members, permissions and status.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    <UserPlus className="w-4 h-4" /> Add User
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0d0d0d] p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FF2D55] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#FF2D55]/30 transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {["All", "Creators", "Verified", "Banned"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat.toLowerCase())}
                            className={cn(
                                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                filter === cat.toLowerCase()
                                    ? "bg-[#FF2D55] border-[#FF2D55] text-white"
                                    : "bg-white/[0.03] border-white/5 text-white/40 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Avatar</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Role</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Earnings</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers?.map((u) => (
                                <tr key={u.uid} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                                            {u.photoURL ? (
                                                <img src={u.photoURL} alt={u.displayName || ''} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-white group-hover:text-[#FF2D55] transition-colors">{u.displayName || 'Anonymous'}</span>
                                                {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />}
                                            </div>
                                            <span className="text-[11px] text-white/30 font-medium">@{u.username || 'user'} · {u.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-[0.1em]",
                                            u.role === "creator" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-white/5 border-white/10 text-white/30"
                                        )}>
                                            {u.role || 'member'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                !u.subscriptionStatus || u.subscriptionStatus === "expired" ? "bg-white/20" : "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                            )} />
                                            <span className={cn(
                                                "text-xs font-bold",
                                                !u.subscriptionStatus || u.subscriptionStatus === "expired" ? "text-white/20" : "text-emerald-500"
                                            )}>{u.subscriptionStatus || 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-white text-sm">
                                        ${u.earned?.toLocaleString() || '0'}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => router.push(`/profile/${u.username || u.uid}`)}
                                                className="p-2 text-white/20 hover:text-white transition-colors"
                                                title="View Profile"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateUserStatus.mutate({ userId: u.uid, data: { verified: !u.verified } })}
                                                className={cn("p-2 transition-colors", u.verified ? "text-blue-500" : "text-white/20 hover:text-emerald-500")}
                                                title="Verify"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-white/20 hover:text-amber-500 transition-colors" title="Message">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-white/20 hover:text-[#FF2D55] transition-colors" title="Ban">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-white/20 hover:text-rose-600 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/20 font-bold uppercase tracking-widest">Showing {filteredUsers?.length || 0} Users</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/30 disabled:opacity-30" disabled>Prev</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/60 hover:text-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
