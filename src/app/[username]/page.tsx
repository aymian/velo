"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Share2,
    Plus,
    MessageCircle,
    Gift,
    Gem,
    PlaySquare,
    Star,
    Layers,
    Image as ImageIcon,
    Contact,
    MoreHorizontal,
    Video
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import {
    useIsFollowing,
    useFollowUser,
    useUnfollowUser,
    useUserByUsername,
    useUserPosts
} from "@/lib/firebase/hooks";
import { TweetCard } from "@/components/x-layout/TweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { User } from "@/lib/firebase/collections";

export default function UserProfilePage() {
    const params = useParams();
    const rawUsername = params?.username as string || "";
    const username = rawUsername.startsWith("%40")
        ? rawUsername.replace("%40", "")
        : rawUsername.startsWith("@")
            ? rawUsername.substring(1)
            : rawUsername;

    const [activeTab, setActiveTab] = useState("all");
    const { user: currentUser } = useAuthStore();

    // UI Force Load State
    const [forceLoading, setForceLoading] = useState(true);
    React.useEffect(() => {
        const timer = setTimeout(() => setForceLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // High-performance data fetching
    const { data: userData, isLoading: userLoading } = useUserByUsername(username);

    // Fallback for ID
    const targetUserId = userData?.uid || (userData as any)?.id;

    const { data: posts, isLoading: postsLoading } = useUserPosts(targetUserId || "", 50);
    const { data: isFollowing, isLoading: followStatusLoading } = useIsFollowing(currentUser?.uid, targetUserId);

    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const handleFollowToggle = async () => {
        if (!currentUser || !targetUserId) return;
        try {
            if (isFollowing) {
                await unfollowMutation.mutateAsync({
                    followerId: currentUser.uid,
                    followingId: targetUserId
                });
            } else {
                await followMutation.mutateAsync({
                    followerId: currentUser.uid,
                    followingId: targetUserId
                });
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    const tabs = [
        { id: "all", label: "All", icon: ImageIcon },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: Video },
        { id: "cards", label: "Tango Cards", icon: Layers },
    ];

    if (userLoading || forceLoading) {
        return (
            <div className="min-h-screen bg-black text-white relative">
                <Navbar />
                <div className="pt-24 min-h-screen">
                    <FeedSkeleton />
                </div>
            </div>
        );
    }

    if (!userData && !userLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
                <Navbar />
                <p className="text-xl font-bold opacity-40">User not found</p>
                <button onClick={() => window.history.back()} className="text-[#ff4081] font-bold">Go Back</button>
            </div>
        );
    }

    const displayName = (userData as any)?.displayName || (userData as any)?.username || username;
    const isVerified = !!(userData?.verified || (userData?.followers && userData.followers >= 1));

    // Stats formatting helper
    const formatStat = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(2) + "K";
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative font-sans selection:bg-[#ff4081]/30">
            <Navbar />

            <div className="relative z-10 max-w-4xl mx-auto pt-24 px-6 pb-20">
                {/* 👑 PREMIUM PROFILE HEADER (SHARP DESIGN) */}
                <div className="flex items-start gap-6 mb-10">
                    {/* AVATAR */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-white/5 bg-[#1a1a1a]">
                            <img
                                src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=333&color=fff&size=512`}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* IDENTITY & STATS */}
                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between w-full mb-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    {displayName}
                                </h1>
                                <VerifiedBadge showOnCondition={isVerified} size={20} />
                            </div>
                            <div className="flex items-center gap-4 text-white/40">
                                <Share2 className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                            </div>
                        </div>

                        {/* STATS (Sharp Design) */}
                        <div className="flex items-center gap-8 mb-6">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    {formatStat((userData as any)?.earned || 0)}
                                </span>
                                <div className="flex items-center gap-1 opacity-40">
                                    <Gem className="w-3 h-3 " />
                                    <span className="text-[11px] font-semibold uppercase tracking-wider">Earned</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    {formatStat((userData as any)?.followers || 0)}
                                </span>
                                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-40">Followers</span>
                            </div>
                        </div>

                        {/* ACTIONS (Sharp Capsule Design) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleFollowToggle}
                                disabled={followStatusLoading || followMutation.isPending || unfollowMutation.isPending || currentUser?.uid === targetUserId}
                                className={cn(
                                    "px-8 py-3 rounded-full font-bold text-[14px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[130px]",
                                    isFollowing
                                        ? "bg-[#1a1a1a] border border-white/10 text-white hover:bg-[#252525]"
                                        : "bg-gradient-to-r from-[#ff3b5c] to-[#ff4081] text-white hover:opacity-90"
                                )}
                            >
                                {!isFollowing && <Plus className="w-4 h-4" />}
                                {isFollowing ? "Following" : "Follow"}
                            </button>

                            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-[#252525] transition-all active:scale-95 font-bold text-[14px] min-w-[110px]">
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </button>

                            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-[#252525] transition-all active:scale-95 font-bold text-[14px] min-w-[110px]">
                                <Gift className="w-4 h-4" />
                                Send gift
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📋 PROFILE TABS (Sharp Design as requested - Icon top of text) */}
                <div className="border-b border-white/5 mb-8 sticky top-[64px] bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
                    <div className="flex items-center justify-center md:justify-start gap-12 sm:gap-16 px-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative flex flex-col items-center gap-2 pb-3 pt-4 transition-all duration-300 min-w-[60px]",
                                        isActive ? "text-white" : "text-white/30 hover:text-white/50"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "opacity-70")} />
                                    <span className="text-[11px] font-bold tracking-tight uppercase">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabProfileUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="px-0"
                    >
                        {postsLoading ? (
                            <div className="grid grid-cols-3 gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <Skeleton key={i} className="aspect-[3/4] w-full bg-[#1a1a1a]" />
                                ))}
                            </div>
                        ) : posts && posts.length > 0 ? (
                            <div className={cn(
                                activeTab === "all" || activeTab === "moments"
                                    ? "grid grid-cols-3 gap-1"
                                    : "flex flex-col gap-0.5"
                            )}>
                                {posts.map((post) => (
                                    (activeTab === "all" || activeTab === "moments") ? (
                                        <div key={post.id} className="aspect-[3/4] bg-black overflow-hidden group relative cursor-pointer">
                                            <img
                                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,w_500,h_700,c_fill/${post.cloudinaryPublicId}.jpg`}
                                                alt="Post"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* Views overlay */}
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-1.5">
                                                    <Gem className="w-3.5 h-3.5 text-white" />
                                                    <span className="text-[11px] font-bold text-white">{post.engagement?.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <TweetCard key={post.id} post={{ ...post, creator: (userData as User) }} />
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center text-center opacity-20">
                                <ImageIcon className="w-16 h-16 mb-4" strokeWidth={1} />
                                <p className="text-lg font-bold">No content yet</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}