"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MessageCircle, Star, Shield, Zap, Info, MoreHorizontal, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

// Tinder-style card component
function DatingCard({ image, name, age, city, bio, isPremium }: any) {
    return (
        <div className="flex flex-col group w-full bg-[#111] rounded-[1.25rem] overflow-hidden border border-white/5 transition-all hover:border-white/10 selection:bg-none">
            {/* The Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Top Badges (Still on image but minimal) */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                    {isPremium && (
                        <div className="bg-[#a855f7] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-2 h-2 fill-current" />
                            PREMIUM
                        </div>
                    )}
                    <button className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all ml-auto">
                        <MoreHorizontal className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Content Below Image */}
            <div className="p-3.5 space-y-4">
                {/* Profile Content */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 leading-none">
                        <h2 className="text-[15px] font-black text-white">{name}, {age}</h2>
                        <Shield className="w-3 h-3 text-blue-400 fill-blue-400" />
                    </div>

                    <div className="flex items-center gap-1 text-white/40 text-[11px] font-medium">
                        <Zap className="w-2.5 h-2.5 text-[#FF2D55] fill-[#FF2D55]" />
                        <span>{city}</span>
                    </div>
                </div>

                {/* Interaction Bar */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-2.5">
                        <button className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all active:scale-95">
                            <X className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/30 hover:text-[#FF2D55] hover:bg-white/[0.06] transition-all active:scale-95">
                            <Heart className="w-4 h-4 fill-current" />
                        </button>
                    </div>

                    <button className="h-8 px-3.5 rounded-full bg-gradient-to-r from-[#FF2D55] to-[#a855f7] flex items-center gap-1.5 text-[10px] font-black text-white shadow-lg shadow-pink-500/10 hover:opacity-90 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight">
                        <UserPlus className="w-3 h-3" />
                        Follow
                    </button>
                </div>
            </div>
        </div>
    );
}

export function FollowingFeed() {
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        // Sample profile data using wide variety of images
        const names = ["Lexi", "Jade", "Sienna", "Mila", "Aria", "Luna", "Chloe", "Sophie", "Zoe", "Eva", "Mia", "Bella"];
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

        const mockProfiles = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: names[i % names.length],
            age: 21 + (i % 5),
            city: ["L.A.", "N.Y.", "London", "Berlin"][i % 4],
            bio: bios[i % bios.length],
            image: `/images/${(i % 30) + 1}.png`,
            isPremium: i % 3 === 0
        }));

        setProfiles(mockProfiles);
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full pb-32">
            <div className="flex items-center justify-between px-2">
                <h1 className="text-[16px] font-black tracking-tight text-white uppercase opacity-40">Recommended for you</h1>
                <div className="flex gap-2">
                    <button className="p-2 transition-colors text-white/20 hover:text-white">
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-2">
                <AnimatePresence>
                    {profiles.map((profile, idx) => (
                        <motion.div
                            key={profile.id}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                        >
                            <DatingCard {...profile} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Load more indicator */}
            <div className="mt-8 flex flex-col items-center justify-center p-12 border border-white/5 rounded-[1.5rem] bg-white/[0.02] gap-3">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white/20 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-white/15 uppercase tracking-[0.2em]">End of transmission</p>
            </div>
        </div>
    );
}
