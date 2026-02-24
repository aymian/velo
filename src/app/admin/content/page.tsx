"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    Play,
    ShieldAlert,
    Trash2,
    Eye,
    MessageSquare,
    Flag,
    MoreHorizontal,
    LayoutGrid,
    LayoutList
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAdminPosts } from "@/lib/firebase/admin-hooks";
import { Loader2 } from "lucide-react";

export default function AdminContent() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState("all");
    const { data: posts, isLoading } = useAdminPosts(filter);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Downloading Transmissions...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Content Oversight</h1>
                    <p className="text-white/40 text-sm font-medium">Monitor and manage all visual transmissions on the network.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#0d0d0d] p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setView("grid")}
                        className={cn(
                            "p-2 rounded-xl transition-all",
                            view === "grid" ? "bg-white/10 text-white" : "text-white/20 hover:text-white"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={cn(
                            "p-2 rounded-xl transition-all",
                            view === "list" ? "bg-white/10 text-white" : "text-white/20 hover:text-white"
                        )}
                    >
                        <LayoutList className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FF2D55] transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter by creator, tag, or content ID..."
                        className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#FF2D55]/30 transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {["All", "Most Reported", "Trending", "Videos", "Flagged"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            className={cn(
                                "whitespace-nowrap px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f.toLowerCase() ? "bg-[#FF2D55] border-[#FF2D55] text-white" : "bg-[#0d0d0d] border-white/5 text-white/40 hover:text-white hover:border-white/10"
                            )}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts?.map((item: any) => (
                    <div key={item.id} className="group bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl">
                        {/* Preview */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                            {item.imageUrl || item.videoUrl ? (
                                <img
                                    src={item.imageUrl || item.videoUrl}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Play className="w-10 h-10 text-white/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                            {/* Overlay Controls */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {item.status === "error" && (
                                    <div className="bg-[#FF2D55] text-white p-1.5 rounded-lg shadow-xl shadow-red-500/20">
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white/70 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    #{item.id.slice(0, 6)}
                                </div>
                            </div>
                        </div>

                        {/* Info & Actions */}
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                                        {item.creator?.photoURL && <img src={item.creator.photoURL} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="text-xs font-bold text-white">@{item.creator?.username || 'unknown'}</span>
                                </div>
                                <span className="text-[10px] font-bold text-white/20">{item.createdAt?.toDate?.() ? item.createdAt.toDate().toLocaleDateString() : 'recent'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl flex flex-col">
                                    <div className="flex items-center gap-1.5 text-white/30 mb-1">
                                        <Eye className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase">Views</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{item.engagement?.views?.toLocaleString() || 0}</span>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl flex flex-col">
                                    <div className="flex items-center gap-1.5 text-white/30 mb-1">
                                        <MessageSquare className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase">Comments</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{item.engagement?.comments || 0}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-white/20 hover:text-emerald-500 transition-colors">
                                        <Flag className="w-4 h-4" />
                                    </button>
                                </div>
                                <button className="p-2 text-white/20 hover:text-[#FF2D55] transition-colors rounded-xl hover:bg-[#FF2D55]/5">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center py-10">
                <button className="px-10 py-4 bg-[#0d0d0d] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:border-[#FF2D55]/30 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                    Decrypt More Content
                </button>
            </div>
        </div>
    );
}
