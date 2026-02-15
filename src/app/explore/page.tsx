"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Grid,
    Layout,
    Flame,
    Sparkles,
    Play,
    Heart,
    MessageSquare,
    MoreHorizontal,
    ArrowUpRight,
    Command,
    X,
    Maximize2,
    Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock categories for the discovery bar
const CATEGORIES = ["All", "Hot", "Trending", "Videos", "Exclusive", "New", "POV", "After Dark"];

// Generate entries from your public/images folder (1.png to 32.png)
const GALLERY_ITEMS = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    src: `/images/${i + 1}.png`,
    title: `Collection Entry ${i + 1}`,
    creator: i % 3 === 0 ? "elena_v" : i % 3 === 1 ? "marcus_velo" : "alpha_m",
    likes: Math.floor(Math.random() * 5000) + 1000,
    comments: Math.floor(Math.random() * 200) + 50,
    isPremium: i % 4 === 0,
    type: i % 5 === 0 ? "video" : "image",
    priority: i < 6
}));

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {/* STICKY DISCOVERY HEADER */}
            <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/95 backdrop-blur-3xl border-b border-white/5 py-3" : "bg-transparent py-8"}`}>
                <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/">
                            <h1 className="text-2xl font-black tracking-tighter">VELO.</h1>
                        </Link>

                        {/* Categories Bar */}
                        <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                            ? "bg-white text-black shadow-lg"
                                            : "text-zinc-600 hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 max-w-md hidden lg:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Command Search..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Command className="w-4 h-4 text-zinc-500" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
                            <img src="https://i.pravatar.cc/100?u=me" alt="me" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <main className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto">

                {/* HERO STATS / SECTION TITLE */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-purple-500/10 border-purple-500/20 text-purple-400 py-0.5 px-2">Discovery Live</Badge>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 italic">Exploring: Velocity Network</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
                            Global Collective
                            <Sparkles className="w-6 h-6 text-zinc-800" />
                        </h2>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                        <div className="flex flex-col items-end">
                            <span className="text-white">1,240</span>
                            <span>Live Creators</span>
                        </div>
                        <div className="w-px h-10 bg-white/5" />
                        <div className="flex flex-col items-end">
                            <span className="text-white">12.5k</span>
                            <span>New Collections</span>
                        </div>
                    </div>
                </div>

                {/* BENTO MASONRY GRID */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {GALLERY_ITEMS.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.02 }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative break-inside-avoid group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-[24px] bg-zinc-900/50 border border-white/5 group-hover:border-white/20 transition-all duration-500 shadow-2xl">

                                {/* Image Overlay/Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                {/* Tag/Badges */}
                                <div className="absolute top-4 left-4 z-20 flex gap-2">
                                    {item.isPremium && (
                                        <div className="bg-black/40 backdrop-blur-md border border-amber-500/30 text-amber-500 p-2 rounded-xl">
                                            <Flame className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    {item.type === "video" && (
                                        <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white p-2 rounded-xl">
                                            <Play className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                </div>

                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                    <button className="bg-white text-black p-2 rounded-xl shadow-2xl">
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Actual Image */}
                                <img
                                    src={item.src}
                                    className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-110 ${item.isPremium ? 'blur-[4px] group-hover:blur-0' : ''}`}
                                    alt={item.title}
                                    loading="lazy"
                                />

                                {/* BOTTOM INFO - Visible on Hover */}
                                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-lg">
                                            <img src={`https://i.pravatar.cc/100?u=${item.creator}`} alt="" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black tracking-tight text-white">@{item.creator}</span>
                                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">View Collection</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-white/70">
                                                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                                {(item.likes / 1000).toFixed(1)}k
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-white/70">
                                                <MessageSquare className="w-3 h-3" />
                                                {item.comments}
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg">
                                            <ArrowUpRight className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* PREMIUM OVERLAY HINT */}
                                {item.isPremium && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 group-hover:opacity-0 transition-opacity pointer-events-none">
                                        <Lock className="w-10 h-10 text-white/20 mb-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">VIP Collection</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* END OF FEED INDICATOR */}
                <div className="mt-32 text-center">
                    <div className="inline-flex flex-col items-center gap-6">
                        <div className="w-px h-20 bg-gradient-to-b from-zinc-900 to-transparent" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">Operational Registry End</h4>
                        <div className="flex items-center gap-3">
                            <span className="p-3 bg-white/5 border border-white/10 rounded-full text-zinc-600">
                                <Search className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-medium text-zinc-600">Nothing left to show for now.</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* FLOATING ACTION BAR */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="flex items-center gap-2 p-2 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                >
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Flame className="w-4 h-4" /> Discover New
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
                        <Layout className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
