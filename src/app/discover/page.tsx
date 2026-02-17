"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function DiscoverPage() {
    const { user } = useAuthStore();

    const categories = [
        "Live Now", "Trending", "New", "Recommended", "Nearby"
    ];

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <section className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
                        <p className="text-white/60">Explore the best live streams and creators on Veeloo.</p>
                    </div>
                    {user && (
                        <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                            <span className="text-sm">Welcome back, <span className="font-semibold text-[#FF2D55]">{user.displayName || "User"}</span></span>
                        </div>
                    )}
                </header>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((cat, i) => (
                        <button key={i} className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Grid (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer border border-white/5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                            <div className="absolute bottom-4 left-4 z-20">
                                <h3 className="font-bold text-lg">Live Stream {i}</h3>
                                <p className="text-xs text-white/70">@creator{i} • 1.2k watching</p>
                            </div>
                            <div className="absolute top-4 left-4 z-20 bg-[#FF2D55] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                Live
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State / CTA */}
                <div className="py-20 text-center space-y-4">
                    <p className="text-white/40">More content loading...</p>
                </div>
            </section>
        </main>
    );
}
