"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Share2,
    Pencil,
    Plus,
    Video,
    Gem,
    Star,
    PlaySquare,
    Layers,
    Gift,
    Image as ImageIcon,
    Contact,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("all");

    const tabs = [
        { id: "all", label: "All", icon: Contact },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "Veeloo Cards", icon: Layers },
        { id: "collections", label: "Collections", icon: Gift },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
                    {/* Avatar with Edit Overlay */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/5 transition-all group-hover:ring-white/10">
                            <img
                                src={user?.photoURL || "https://ui-avatars.com/api/?name=Funny+Badger&background=ff4081&color=fff"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 w-10 h-10 bg-[#1a1a1a] border-4 border-[#0a0a0a] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* User Info & Stats */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Funny Badger</h1>
                                <p className="text-white/40 text-[14px] mt-1 font-medium">Rwanda, 19 y.o.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors group">
                                    <Share2 className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                                </button>
                                <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors group">
                                    <Pencil className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">7</span>
                                </div>
                                <span className="text-[13px] text-white/40 font-medium flex items-center gap-1.5">
                                    <Gem className="w-3.5 h-3.5" /> Earned
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold">1</span>
                                <span className="text-[13px] text-white/40 font-medium">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold">9</span>
                                <span className="text-[13px] text-white/40 font-medium">Following</span>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-3 pt-2">
                            <button className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#ff0080] to-[#ff4081] rounded-full font-bold text-[15px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-500/20">
                                <Plus className="w-5 h-5 stroke-[3]" />
                                Create Post
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-full font-bold text-[15px] hover:bg-white/10 transition-all">
                                <Video className="w-5 h-5" />
                                Start stream
                            </button>
                            <button className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
                                <Gem className="w-5 h-5 text-white/60" />
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff4081] border-2 border-[#0a0a0a] rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-white/5">
                    <div className="flex items-center justify-between">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex flex-col items-center gap-3 px-6 py-4 transition-all group ${isActive ? "text-white" : "text-white/40 hover:text-white/60"
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : "scale-100 group-hover:scale-105"}`} />
                                    <span className="text-[13px] font-bold">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Section (Empty State) */}
                <div className="py-32 flex flex-col items-center justify-center text-center opacity-60">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative mb-6"
                    >
                        <ImageIcon className="w-20 h-20 text-white/20" strokeWidth={1} />
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-lg border-2 border-white/10 rotate-12 -z-10" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-lg border-2 border-white/10 -rotate-12 -z-10" />
                    </motion.div>
                    <p className="text-xl font-bold tracking-wide">No Posts</p>
                </div>
            </main>
        </div>
    );
}
