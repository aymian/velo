"use client";

import React, { useState, useEffect } from "react";
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
    Layout,
    Columns
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { VideoPost } from "@/components/VideoPost";

import { useCreatorPosts } from "@/lib/hooks/usePosts";

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("all");

    // 🚀 High-Performance Fetching with TanStack Query
    const { data: posts = [], isLoading: postsLoading } = useCreatorPosts(user?.uid);

    const tabs = [
        { id: "all", label: "All", icon: Columns },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "Tango Cards", icon: Layout },
        { id: "collections", label: "Collections", icon: Gift },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">

                {/* --- Profile Header (EXACT MATCH) --- */}
                <div className="flex items-start gap-6 mb-10">
                    {/* Avatar with Camera Icon */}
                    <div className="relative">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/5">
                            <img
                                src={user?.photoURL || "https://ui-avatars.com/api/?name=Funny+Badger&background=333&color=fff"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#111] border-2 border-[#0a0a0a] rounded-full flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Identity & Actions Container */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-0.5">
                            <h1 className="text-xl font-bold">{user?.displayName || "Funny Badger"}</h1>
                            <div className="flex items-center gap-4">
                                <Share2 className="w-5 h-5 text-white/60 cursor-pointer" />
                                <Pencil className="w-5 h-5 text-white/60 cursor-pointer" />
                            </div>
                        </div>
                        <p className="text-white/40 text-xs font-medium mb-4">Rwanda, 19 y.o.</p>

                        {/* Flat Stats Row */}
                        <div className="flex items-center gap-8 mb-6">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">7</span>
                                <div className="flex items-center gap-1 text-white/40">
                                    <Gem className="w-3 h-3" />
                                    <span className="text-[11px] font-medium">Earned</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">1</span>
                                <span className="text-[11px] text-white/40 font-medium">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">9</span>
                                <span className="text-[11px] text-white/40 font-medium">Following</span>
                            </div>
                        </div>

                        {/* Action Row (Gradient + Outline + Gem) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/create')}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#ff0080] to-[#ff4081] rounded-full font-bold text-xs shadow-lg shadow-pink-500/10 transition-transform active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Create Post
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded-full font-bold text-xs hover:bg-white/5 transition-colors">
                                <Video className="w-4 h-4" />
                                Start stream
                            </button>
                            <div className="relative w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                <Layout className="w-4 h-4 text-white/40" />
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 border-2 border-[#0a0a0a] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Interactive Navigation Tabs (EXACT MATCH) --- */}
                <div className="border-b border-white/5 mb-8">
                    <div className="flex items-center justify-between px-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex flex-col items-center gap-2 px-6 py-4 transition-all ${isActive ? "text-white" : "text-white/40 hover:text-white/60"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[11px] font-bold">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="profileTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- Content Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <VideoPost
                                    id={post.id}
                                    publicId={post.cloudinaryPublicId}
                                    videoUrl={post.videoUrl}
                                    status={post.status || 'ready'}
                                    isLocked={post.visibility === 'locked'}
                                    price={post.price || 0}
                                    caption={post.caption}
                                    blurEnabled={post.blurEnabled}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!postsLoading && posts.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-40">
                            <ImageIcon className="w-16 h-16 mb-4" strokeWidth={1} />
                            <p className="text-sm font-bold">No Posts</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
