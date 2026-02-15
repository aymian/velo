"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Share2,
    MoreHorizontal,
    Plus,
    MessageCircle,
    Gift,
    Gem,
    Users,
    PlaySquare,
    Star,
    Layers,
    Image as ImageIcon,
    Contact
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { COLLECTIONS, User as UserType } from "@/lib/firebase/collections";

export default function UserProfilePage() {
    const params = useParams();
    const rawUsername = params?.username as string || "";
    const username = rawUsername.startsWith("%40")
        ? rawUsername.replace("%40", "")
        : rawUsername.startsWith("@")
            ? rawUsername.substring(1)
            : rawUsername;

    const [activeTab, setActiveTab] = useState("all");
    const [userData, setUserData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    where("username", "==", username),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setUserData(querySnapshot.docs[0].data() as UserType);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchUser();
    }, [username]);

    const tabs = [
        { id: "all", label: "All", icon: Contact },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "Veeloo Cards", icon: Layers },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* CINEMATIC BACKGROUND VIDEO */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
                >
                    <source src="https://ext.same-assets.com/207502500/2070474510.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>

            <div className="relative z-10">
                <Navbar />

                <main className="max-w-4xl mx-auto pt-28 px-6 pb-20">
                    {/* Header Profile Section */}
                    <div className="relative flex flex-col md:flex-row items-start gap-8 mb-12">
                        {/* Top Right Actions */}
                        <div className="absolute top-0 right-0 flex items-center gap-4 text-white/60">
                            <button className="hover:text-white transition-colors">
                                <Share2 className="w-6 h-6" />
                            </button>
                            <button className="hover:text-white transition-colors">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-1 ring-white/10 shadow-2xl">
                            <img
                                src={userData?.photoURL || `https://ui-avatars.com/api/?name=${userData?.displayName || username}&background=8b5cf6&color=fff&size=256`}
                                alt={username}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-6 pt-2">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {userData?.displayName || username}
                                </h1>
                                <p className="text-white/40 text-[14px] mt-0.5 font-medium">United Kingdom</p>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold">2.09K</span>
                                    <div className="flex items-center gap-1.5 text-white/40">
                                        <Gem className="w-3.5 h-3.5" />
                                        <span className="text-[12px] font-medium">Earned</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold">51</span>
                                    <span className="text-[12px] text-white/40 font-medium">Followers</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff0080] to-[#ff4081] rounded-full font-bold text-[15px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-500/20">
                                    <Plus className="w-5 h-5 stroke-[3]" />
                                    Follow
                                </button>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-[15px] hover:bg-white/10 transition-all">
                                    <MessageCircle className="w-5 h-5" />
                                    Message
                                </button>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-[15px] hover:bg-white/10 transition-all">
                                    <Gift className="w-5 h-5" />
                                    Send gift
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-white/5 mb-8">
                        <div className="flex items-center justify-around md:justify-start md:gap-12">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex flex-col items-center gap-2 px-4 py-4 transition-all group ${isActive ? "text-white" : "text-white/40 hover:text-white/60"
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : "scale-100 group-hover:scale-105"}`} />
                                        <span className="text-[13px] font-bold">{tab.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabProfile"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area - Empty State */}
                    <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="relative mb-6">
                            <ImageIcon className="w-20 h-20 text-white/20" strokeWidth={1} />
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-lg border-2 border-white/10 rotate-12 -z-10" />
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-lg border-2 border-white/10 -rotate-12 -z-10" />
                        </div>
                        <p className="text-xl font-bold tracking-wide">No Posts</p>
                    </div>
                </main>
            </div>
        </div>
    );
}