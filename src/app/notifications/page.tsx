"use client";

import React from "react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Gift, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const notifications = [
        { id: 1, type: 'like', user: 'alex_pink', content: 'liked your post', time: '2m ago', icon: Heart, iconColor: 'text-pink-500' },
        { id: 2, type: 'follow', user: 'sarah_sky', content: 'started following you', time: '15m ago', icon: UserPlus, iconColor: 'text-blue-500' },
        { id: 3, type: 'comment', user: 'marco_v', content: 'commented: "This is fire! 🔥"', time: '1h ago', icon: MessageCircle, iconColor: 'text-purple-500' },
        { id: 4, type: 'gift', user: 'luna_veil', content: 'sent you a gift', time: '3h ago', icon: Gift, iconColor: 'text-yellow-500' },
        { id: 5, type: 'mention', user: 'jake_prime', content: 'mentioned you in a post', time: '5h ago', icon: Star, iconColor: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                {/* Left Sidebar */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                {/* Main Content - No Right Sidebar */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen">
                    <div className="max-w-[800px] mx-auto min-h-screen border-x border-white/5 bg-[#0d0d0d]">
                        {/* Header */}
                        <div className="sticky top-16 bg-black/80 backdrop-blur-xl z-20 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h1 className="text-xl font-black tracking-tight">Notifications</h1>
                            <div className="flex gap-4">
                                <button className="text-[13px] font-bold text-white">All</button>
                                <button className="text-[13px] font-bold text-white/40 hover:text-white transition-colors">Mentions</button>
                                <button className="text-[13px] font-bold text-white/40 hover:text-white transition-colors">Verified</button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="divide-y divide-white/5">
                            {notifications.map((notif, idx) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="px-6 py-5 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                >
                                    <div className={notif.iconColor}>
                                        <notif.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${notif.user}&background=333&color=fff`}
                                                    alt={notif.user}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-[14px] font-bold">{notif.user}</span>
                                            <span className="text-[14px] text-white/90">{notif.content}</span>
                                        </div>
                                        <p className="text-[12px] text-white/30">{notif.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
