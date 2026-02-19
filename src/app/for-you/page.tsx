"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Heart, ArrowLeft } from "lucide-react";
import { useForYouPosts } from "@/lib/hooks/usePosts";
import { ForYouVideo } from "@/components/feed/ForYouVideo";
import { usePlayerStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";

export default function ForYouPage() {
    const { data: posts = [], isLoading } = useForYouPosts();
    const { setCurrentVideo } = usePlayerStore();
    const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewMode !== "feed") return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!scrollContainerRef.current) return;
            const h = scrollContainerRef.current.clientHeight;
            if (e.key === "ArrowDown") { e.preventDefault(); scrollContainerRef.current.scrollBy({ top: h, behavior: "smooth" }); }
            else if (e.key === "ArrowUp") { e.preventDefault(); scrollContainerRef.current.scrollBy({ top: -h, behavior: "smooth" }); }
            else if (e.key === "Escape") setViewMode("grid");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === "feed" && posts[activeIndex]) setCurrentVideo(posts[activeIndex].id);
        else setCurrentVideo(null);
    }, [posts, activeIndex, viewMode, setCurrentVideo]);

    const handleScroll = () => {
        if (!scrollContainerRef.current || viewMode !== "feed") return;
        const index = Math.round(scrollContainerRef.current.scrollTop / scrollContainerRef.current.clientHeight);
        if (index !== activeIndex && index < posts.length) setActiveIndex(index);
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-5 h-5 border border-white/10 border-t-white/40 rounded-full animate-spin" />
            </div>
        );
    }

    const activePost = posts[activeIndex];

    return (
        <div className="h-screen bg-[#0d0d0d] overflow-hidden text-white">
            <Navbar />

            <div className="flex h-full pt-16">

                {/* Sidebar — feed mode only, xl+ */}
                {viewMode === "feed" && (
                    <aside className="hidden xl:flex w-72 border-r border-white/[0.06] flex-col p-8 gap-8 bg-[#0d0d0d] overflow-y-auto shrink-0">
                        <button
                            onClick={() => setViewMode("grid")}
                            className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-xs">Back</span>
                        </button>

                        {activePost?.caption && (
                            <div className="space-y-1.5">
                                <p className="text-[11px] text-white/30 uppercase tracking-widest">Now playing</p>
                                <p className="text-sm text-white/80 leading-relaxed line-clamp-4">{activePost.caption}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <p className="text-[11px] text-white/30 uppercase tracking-widest">Creator</p>
                            <p className="text-sm text-white/70">@{activePost?.creatorId?.slice(0, 12) || "—"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div>
                                <p className="text-base font-semibold text-white">{activePost?.engagement?.likes || 0}</p>
                                <p className="text-[11px] text-white/30 mt-0.5">Likes</p>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">{activePost?.engagement?.views || 0}</p>
                                <p className="text-[11px] text-white/30 mt-0.5">Views</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                Support creator
                            </button>
                        </div>
                    </aside>
                )}

                {/* Main */}
                <main className="flex-1 relative overflow-hidden">

                    {viewMode === "grid" ? (
                        <div className="h-full overflow-y-auto px-6 py-8 md:px-10">
                            <div className="max-w-5xl mx-auto space-y-8 pb-20">

                                {/* Header */}
                                <div>
                                    <h1 className="text-lg font-semibold text-white">For You</h1>
                                    <p className="text-sm text-white/30 mt-0.5">Videos picked for you</p>
                                </div>

                                {/* Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {posts.map((post, index) => (
                                        <button
                                            key={post.id}
                                            onClick={() => { setActiveIndex(index); setViewMode("feed"); }}
                                            className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-[#151515] border border-white/[0.06] cursor-pointer text-left"
                                        >
                                            {/* Thumbnail */}
                                            <img
                                                src={
                                                    post.cloudinaryPublicId
                                                        ? `https://res.cloudinary.com/dqr6idmre/video/upload/c_fill,w_400,h_600,so_auto,q_auto,f_auto/${post.cloudinaryPublicId}.jpg`
                                                        : post.videoUrl?.replace(".mp4", ".jpg") || ""
                                                }
                                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                                alt=""
                                            />

                                            {/* Scrim */}
                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

                                            {/* Play — appears on hover, no container */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-7 h-7 text-white fill-white" />
                                            </div>

                                            {/* Bottom meta */}
                                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                                <span className="text-[11px] text-white/60 truncate max-w-[70%]">
                                                    {post.creatorId?.slice(0, 8)}
                                                </span>
                                                <div className="flex items-center gap-1 text-white/40">
                                                    <Heart className="w-3 h-3" />
                                                    <span className="text-[10px] tabular-nums">{post.engagement?.likes || 0}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Feed */
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                        >
                            {posts.map((post, index) => (
                                <ForYouVideo
                                    key={post.id}
                                    post={post}
                                    isActive={index === activeIndex}
                                />
                            ))}
                        </div>
                    )}

                    {/* Back pill — feed mode, mobile only */}
                    {viewMode === "feed" && (
                        <button
                            onClick={() => setViewMode("grid")}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 bg-[#1a1a1a] border border-white/[0.08] rounded-full text-xs text-white/40 hover:text-white/70 transition-colors xl:hidden z-50"
                        >
                            Grid view
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
}
