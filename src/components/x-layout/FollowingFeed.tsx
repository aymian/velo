"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MessageCircle, Star, Shield, Zap, Info, MoreHorizontal, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

// Tinder-style card component
function DatingCard({ image, name, age, city, bio, isPremium }: any) {
    return (
        <div className="relative group w-full aspect-[3/4] sm:aspect-[4/5] bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 selection:bg-none">
            {/* The Image */}
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Top Scrim */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Bottom Scrim/Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                {isPremium && (
                    <div className="bg-[#a855f7] text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-purple-500/20">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        PREMIUM
                    </div>
                )}
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress Indicators (Tinder style) */}
            <div className="absolute top-3 left-4 right-4 flex gap-1 z-10">
                <div className="h-1 flex-1 bg-white rounded-full" />
                <div className="h-1 flex-1 bg-white/20 rounded-full" />
                <div className="h-1 flex-1 bg-white/20 rounded-full" />
            </div>

            {/* Profile Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 z-10 pointer-events-none">
                <div className="space-y-2 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-white">{name}, {age}</h2>
                        <Shield className="w-4 h-4 text-blue-400 fill-blue-400" />
                    </div>

                    <div className="flex items-center gap-1.5 text-white/70 text-sm font-medium">
                        <Zap className="w-3.5 h-3.5 text-[#FF2D55] fill-[#FF2D55]" />
                        <span>{city}</span>
                        <span className="mx-1 opacity-30">•</span>
                        <span>Active now</span>
                    </div>

                    <p className="text-sm text-white/60 line-clamp-2 leading-relaxed max-w-[90%]">
                        {bio}
                    </p>
                </div>
            </div>

            {/* Interaction Bar */}
            <div className="absolute bottom-5 left-0 right-0 px-6 flex items-center justify-between z-20">
                <div className="flex gap-3">
                    <button className="w-11 h-11 rounded-full bg-neutral-800/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-xl">
                        <X className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#FF2D55] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-xl">
                        <Heart className="w-5 h-5 fill-current" />
                    </button>
                </div>

                <button className="h-11 px-5 rounded-full bg-gradient-to-r from-[#FF2D55] to-[#a855f7] flex items-center gap-2 text-xs font-black text-white shadow-lg shadow-pink-500/20 hover:opacity-90 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider">
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                </button>
            </div>
        </div>
    );
}

export function FollowingFeed() {
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        // Sample profile data using the 32 images
        const names = ["Lexi", "Jade", "Sienna", "Mila", "Aria", "Luna", "Chloe", "Sophie"];
        const bios = [
            "Just here for a good transmission. ✨",
            "Art, music, and late night streams.",
            "Living my best life on Veeloo.",
            "Looking for creators to collab with.",
            "Energy is everything. ⚡",
            "Obsessed with digital fashion.",
            "Catch me live every Tuesday!",
            "Transmitting from Tokyo."
        ];

        const mockProfiles = Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            name: names[i % names.length],
            age: 21 + (i % 5),
            city: ["Los Angeles", "New York", "London", "Berlin"][i % 4],
            bio: bios[i % bios.length],
            image: `/images/${i + 10}.png`, // Start from image 10 just for variety
            isPremium: i % 3 === 0
        }));

        setProfiles(mockProfiles);
    }, []);

    return (
        <div className="flex flex-col gap-8 p-4 pt-4 pb-32 max-w-[460px] mx-auto">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-[20px] font-black tracking-tight text-white">Following Feed</h1>
                <div className="flex gap-2">
                    <button className="p-2 transition-colors text-white/40 hover:text-white">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {profiles.map((profile, idx) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <DatingCard {...profile} />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Load more indicator */}
            <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-[2rem] bg-white/[0.02] gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white/20 animate-pulse" />
                </div>
                <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest">End of transmission</p>
            </div>
        </div>
    );
}
