"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Play,
    Eye,
    Gem,
    ArrowLeft,
    Hash,
    BarChart3,
    Clock,
    Flame,
    TrendingUp
} from "lucide-react";
import { useForYouPosts } from "@/lib/hooks/usePosts";
import { ForYouVideo } from "@/components/feed/ForYouVideo";
import { usePlayerStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";

export default function ForYouPage() {
    const { data: posts = [], isLoading } = useForYouPosts();
    const { setCurrentVideo } = usePlayerStore();
    const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Keyboard Navigation for Feed Mode
    useEffect(() => {
        if (viewMode !== 'feed') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!scrollContainerRef.current) return;
            const height = scrollContainerRef.current.clientHeight;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                scrollContainerRef.current.scrollBy({ top: height, behavior: "smooth" });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                scrollContainerRef.current.scrollBy({ top: -height, behavior: "smooth" });
            } else if (e.key === "Escape") {
                setViewMode('grid');
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [viewMode]);

    // Handle video sync in feed mode
    useEffect(() => {
        if (viewMode === 'feed' && posts.length > 0 && posts[activeIndex]) {
            setCurrentVideo(posts[activeIndex].id);
        } else if (viewMode === 'grid') {
            setCurrentVideo(null);
        }
    }, [posts, activeIndex, viewMode, setCurrentVideo]);

    const handleScroll = () => {
        if (!scrollContainerRef.current || viewMode !== 'feed') return;
        const index = Math.round(scrollContainerRef.current.scrollTop / scrollContainerRef.current.clientHeight);
        if (index !== activeIndex && index < posts.length) {
            setActiveIndex(index);
        }
    };

    const handleVideoClick = (index: number) => {
        setActiveIndex(index);
        setViewMode('feed');
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
                <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">Loading Discovery</span>
            </div>
        );
    }

    const activePost = posts[activeIndex];

    return (
        <div className="h-screen bg-[#050505] overflow-hidden relative font-sans antialiased text-white">
            <Navbar />

            <div className="flex h-full pt-16 md:pt-20">

                {/* 🚀 Conditional Sidebar (Only for Feed Mode) */}
                <AnimatePresence>
                    {viewMode === 'feed' && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className="hidden xl:flex w-[380px] border-r border-white/5 flex-col p-10 space-y-12 bg-[#050505] overflow-y-auto"
                        >
                            <button
                                onClick={() => setViewMode('grid')}
                                className="flex items-center gap-2 text-white/40 hover:text-[#FF2D55] transition-colors group mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Back to Grid</span>
                            </button>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 italic">Active Manuscript</label>
                                <h1 className="text-xl font-bold tracking-tight leading-relaxed text-white">
                                    {activePost?.caption || "Viewing Thread"}
                                </h1>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-[#111] rounded-[32px] border border-white/5 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                                            <Users className="w-4 h-4 text-[#FF2D55]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Post Creator</span>
                                            <span className="text-sm font-black text-white">@{activePost?.creatorId?.slice(0, 12) || 'anonymous'}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[22px] font-black tracking-tighter text-[#FF2D55]">12.8k</p>
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">Followers</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[22px] font-black tracking-tighter text-[#FF2D55]">{activePost?.engagement?.likes || 0}</p>
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">Total Likes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-6">
                                <button className="w-full h-14 bg-[#FF2D55] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-pink-500/10 hover:bg-[#FF0040] active:scale-[0.98] transition-all">Support Creator</button>
                                <p className="text-center text-[9px] font-black text-white/10 uppercase tracking-[0.4em] italic">Protocol v2.0</p>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 relative bg-[#050505]">

                    {/* GRID VIEW MODE */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full overflow-y-auto p-6 md:p-12 custom-scrollbar"
                            >
                                <div className="max-w-7xl mx-auto space-y-10 pb-20">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black tracking-tight uppercase italic">Discover</h2>
                                            <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">Curated Manuscripts for you</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                                <Flame className="w-4 h-4 text-white/40" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Trending</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mapped Grid Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {posts.map((post, index) => (
                                            <motion.div
                                                key={post.id}
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                onClick={() => handleVideoClick(index)}
                                                className="group aspect-[9/12] bg-[#111] rounded-[32px] overflow-hidden relative border border-white/5 cursor-pointer shadow-2xl"
                                            >
                                                {/* Thumbnail/Preview - Engineered Auto-Generation */}
                                                <div className="absolute inset-0">
                                                    {/* Static Thumbnail (Default) */}
                                                    <img
                                                        src={post.cloudinaryPublicId
                                                            ? `https://res.cloudinary.com/dqr6idmre/video/upload/c_fill,w_400,h_600,so_auto,q_auto,f_auto/${post.cloudinaryPublicId}.jpg`
                                                            : post.videoUrl?.replace('.mp4', '.jpg') || '/placeholder-thumb.jpg'
                                                        }
                                                        className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-0"
                                                        alt=""
                                                    />
                                                    {/* Animated Preview (Hover) */}
                                                    <img
                                                        src={post.cloudinaryPublicId
                                                            ? `https://res.cloudinary.com/dqr6idmre/video/upload/c_fill,w_400,h_600,e_loop,q_auto,f_webp/${post.cloudinaryPublicId}.webp`
                                                            : ''
                                                        }
                                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                                        alt="preview"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
                                                </div>

                                                {/* Top Badge: Views & Status */}
                                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-full border border-white/5">
                                                        <Eye className="w-3.5 h-3.5 text-[#FF2D55]" />
                                                        <span className="text-[10px] font-black text-white">{post.engagement?.views || 10}</span>
                                                    </div>
                                                    <div className="text-[10px] font-black text-[#FF2D55] tracking-tighter uppercase italic drop-shadow-lg">TANGO</div>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 overflow-hidden">
                                                            <img src={`https://ui-avatars.com/api/?name=${post.creatorId}&background=222&color=fff`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <span className="text-xs font-black text-white group-hover:text-[#FF2D55] transition-colors uppercase tracking-tight">
                                                            {post.creatorId?.slice(0, 8) || 'user'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/80">
                                                        <Gem className="w-3.5 h-3.5 text-[#FF2D55]" />
                                                        <span className="text-[10px] font-black">{post.engagement?.likes || 0}</span>
                                                    </div>
                                                </div>

                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-12 h-12 bg-[#FF2D55] rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500">
                                                        <Play className="w-6 h-6 text-white fill-current" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* FEED VIEW MODE (TikTok Style) */
                            <motion.div
                                key="feed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full"
                            >
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

                                {/* Floating Back Control for Mobile */}
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/60 xl:hidden z-50 hover:text-white transition-all active:scale-95"
                                >
                                    Grid View
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Discovery Breedcrumb/Badge (Only for Small Screens) */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 py-2 px-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 xl:hidden pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                            {viewMode === 'grid' ? 'Grid Mode' : 'Feed Mode'}
                        </span>
                    </div>

                </main>
            </div>
        </div>
    );
}
