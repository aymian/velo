"use client";

import React, { useState } from "react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Gift,
    Star,
    Shield,
    Zap,
    CreditCard,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, useMarkNotificationRead, useUser, useMarkAllNotificationsRead } from "@/lib/firebase/hooks";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationsPage() {
    const { isAuthenticated, user: authUser } = useAuthStore();
    const router = useRouter();
    const [filter, setFilter] = useState("all");

    const { data: notifications = [], isLoading } = useNotifications(authUser?.uid);
    const markReadMutation = useMarkNotificationRead();
    const markAllReadMutation = useMarkAllNotificationsRead();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handleMarkAllRead = () => {
        if (authUser) {
            markAllReadMutation.mutate(authUser.uid);
        }
    };

    const handleNotifClick = (notif: any) => {
        if (!notif.read && authUser) {
            markReadMutation.mutate({ userId: authUser.uid, notificationId: notif.id });
        }
        if (notif.link) {
            router.push(notif.link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'follow': return { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' };
            case 'comment': return { icon: MessageCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' };
            case 'offer': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            case 'system': return { icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
            case 'subscription': return { icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            case 'verification': return { icon: CheckCircle2, color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
            default: return { icon: Bell, color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ff3b5c]">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                {/* Left Sidebar */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                {/* Main Content */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen">
                    <div className="max-w-[800px] mx-auto min-h-screen border-x border-white/5 bg-[#050505]">
                        {/* Header */}
                        <div className="sticky top-16 bg-black/80 backdrop-blur-xl z-20 px-6 py-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-black tracking-tight">Activity</h1>
                                {notifications.some(n => !n.read) && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#ff3b5c] mt-1 text-left hover:opacity-80 transition-opacity"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
                                {["all", "mentions", "verified"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilter(tab)}
                                        className={cn(
                                            "px-6 py-1.5 rounded-full text-[12px] font-bold transition-all uppercase tracking-widest",
                                            filter === tab
                                                ? "bg-white text-black shadow-lg"
                                                : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="px-6 py-6 flex gap-4 animate-pulse">
                                            <div className="w-12 h-12 rounded-full bg-white/5" />
                                            <div className="flex-grow space-y-2">
                                                <div className="h-4 w-1/3 bg-white/5 rounded" />
                                                <div className="h-3 w-2/3 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    ))
                                ) : notifications.length > 0 ? (
                                    notifications.map((notif, idx) => {
                                        const { icon: Icon, color, bg } = getIcon(notif.type);
                                        return (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.03 }}
                                                onClick={() => handleNotifClick(notif)}
                                                className={cn(
                                                    "px-6 py-6 flex gap-5 transition-all cursor-pointer group relative",
                                                    notif.read ? "opacity-60 grayscale-[0.5]" : "bg-gradient-to-r from-white/[0.03] to-transparent"
                                                )}
                                            >
                                                {!notif.read && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff3b5c]" />
                                                )}

                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110", bg)}>
                                                    <Icon className={cn("w-6 h-6", color)} />
                                                </div>

                                                <div className="flex-grow space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={cn("text-[15px] font-bold", !notif.read ? "text-white" : "text-white/80")}>
                                                            {notif.title || (notif.type.charAt(0).toUpperCase() + notif.type.slice(1))}
                                                        </h4>
                                                        <span className="text-[11px] font-medium text-white/20 uppercase tracking-tighter">
                                                            {dayjs(notif.createdAt?.toDate?.() || notif.createdAt).fromNow()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] text-white/50 leading-relaxed max-w-[90%]">
                                                        {notif.message}
                                                    </p>

                                                    {notif.fromSystem && (
                                                        <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                                                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-purple-200">System Update</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="py-40 flex flex-col items-center justify-center text-center px-10">
                                        <div className="relative mb-8">
                                            <Bell className="w-16 h-16 text-white/5" strokeWidth={1} />
                                            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No updates yet</h3>
                                        <p className="text-white/30 text-sm max-w-[200px] leading-relaxed">
                                            We'll let you know when something important happens.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
