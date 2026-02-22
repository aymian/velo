"use client";

import React, { useState, useMemo, lazy, Suspense } from "react";
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
    Gift,
    Image as ImageIcon,
    Layout,
    Columns,
    Shield,
    MessageCircle,
    MoreHorizontal
} from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { VideoPost } from "@/components/VideoPost";
import { useCreatorPosts } from "@/lib/hooks/usePosts";
import { useUserByUsername, useUserRealtime, useIsFollowing, useFollowUser, useUnfollowUser } from "@/lib/firebase/hooks";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Lazy-load the heavy edit profile dialog
const EditProfileDialog = lazy(() => import("@/components/EditProfileDialog"));

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user: authUser } = useAuthStore();

    const rawUsername = params?.username as string || "";
    const username = rawUsername.startsWith("%40")
        ? rawUsername.replace("%40", "")
        : rawUsername.startsWith("@")
            ? rawUsername.substring(1)
            : rawUsername;

    // 1. Fetch user ID by username
    const { data: initialUserData, isLoading: initialUserLoading } = useUserByUsername(username);
    const targetUserId = initialUserData?.uid || (initialUserData as any)?.id;

    // 2. Real-time synchronization for the target user
    const { data: userData, isLoading: userRealtimeLoading } = useUserRealtime(targetUserId);

    const [activeTab, setActiveTab] = useState("all");
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);

    // 3. Fetch posts for this user
    const { data: posts = [], isLoading: postsLoading } = useCreatorPosts(targetUserId);

    const isOwnProfile = authUser?.uid === targetUserId;

    // 4. Follow Logic
    const { data: isFollowing, isLoading: followStatusLoading } = useIsFollowing(authUser?.uid, targetUserId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const handleFollowToggle = async () => {
        if (!authUser || !targetUserId) return;
        try {
            if (isFollowing) {
                await unfollowMutation.mutateAsync({
                    followerId: authUser.uid,
                    followingId: targetUserId
                });
            } else {
                await followMutation.mutateAsync({
                    followerId: authUser.uid,
                    followingId: targetUserId
                });
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    const tabs = useMemo(() => [
        { id: "all", label: "All", icon: Columns },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "Tango Cards", icon: Layout },
        { id: "collections", label: "Collections", icon: Gift },
    ], []);

    if (initialUserLoading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="pt-24 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#ff3b5c]/20 border-t-[#ff3b5c] rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!initialUserData && !initialUserLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
                <Navbar />
                <p className="text-xl font-bold opacity-40">User not found</p>
                <button onClick={() => router.push('/')} className="text-[#ff3b5c] font-bold">Go Home</button>
            </div>
        );
    }

    const user = (userData || initialUserData) as any;
    const isVerified = !!(user?.verified || (user?.plan && user.plan !== "free"));

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#ff3b5c]">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">

                {/* --- Profile Header --- */}
                <div className="flex items-start gap-8 mb-12">
                    <div className="relative">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/[0.03] border border-white/10">
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || username)}&background=333&color=fff`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditCardOpen(true)}
                                className="absolute bottom-1 right-1 w-9 h-9 bg-black border border-white/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 pt-2">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <h1 className="text-[20px] font-semibold leading-tight">{user?.displayName || user?.username || username}</h1>
                                    <VerifiedBadge showOnCondition={isVerified} />
                                </div>
                                <p className="text-white/40 text-[13px]">{user?.bio || "No bio yet."}</p>
                            </div>
                            <div className="flex items-center gap-5 pt-1">
                                <Share2 className="w-[20px] h-[20px] text-white/40 cursor-pointer hover:text-white transition-colors" />
                                {isOwnProfile ? (
                                    <Pencil
                                        className="w-[20px] h-[20px] text-white/40 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => setIsEditCardOpen(true)}
                                    />
                                ) : (
                                    <MoreHorizontal className="w-[20px] h-[20px] text-white/40 cursor-pointer hover:text-white transition-colors" />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-10 mt-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">{user?.earned || 0}</span>
                                <div className="flex items-center gap-1.5 text-white/30">
                                    <Gem className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">Earned</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">{user?.followers || 0}</span>
                                <span className="text-[11px] text-white/30">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">{user?.following || 0}</span>
                                <span className="text-[11px] text-white/30">Following</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleFollowToggle}
                                disabled={isOwnProfile || !authUser}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95",
                                    isFollowing
                                        ? "bg-white/10 text-white hover:bg-white/15"
                                        : "bg-gradient-to-r from-[#ff3b5c] to-[#f127a3] text-white hover:opacity-90"
                                )}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            <button
                                onClick={() => router.push(`/chat?u=${user.uid}`)}
                                disabled={isOwnProfile || !authUser}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-white/20 rounded-full font-bold text-[13px] hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </button>

                            <div className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                                <Gem className="w-[20px] h-[20px] text-white/40" />
                                {isOwnProfile && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff3b5c] border-2 border-black rounded-full" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Interactive Tabs --- */}
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Tabs.List className="flex items-center justify-between border-b border-white/5 px-2 mb-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <Tabs.Trigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={`relative flex flex-col items-center gap-2 px-6 py-4 transition-all outline-none ${isActive ? "text-white" : "text-white/30 hover:text-white"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                                    <span className="text-[11px] font-medium">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                        />
                                    )}
                                </Tabs.Trigger>
                            );
                        })}
                    </Tabs.List>

                    <Tabs.Content value={activeTab} className="outline-none">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {postsLoading && (
                                <>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-[9/16] rounded-[32px] bg-white/[0.03] border border-white/5 animate-pulse" />
                                    ))}
                                </>
                            )}

                            {!postsLoading && posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="animate-in fade-in duration-300"
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
                                        tags={post.tags}
                                    />
                                </div>
                            ))}

                            {!postsLoading && posts.length === 0 && (
                                <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
                                    <ImageIcon className="w-16 h-16 mb-4" strokeWidth={1} />
                                    <p className="text-[13px] font-medium tracking-wide">No Posts</p>
                                </div>
                            )}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </main>

            {/* --- Edit Profile Dialog --- */}
            {isEditCardOpen && isOwnProfile && (
                <Suspense fallback={null}>
                    <EditProfileDialog
                        isOpen={isEditCardOpen}
                        onClose={() => setIsEditCardOpen(false)}
                        user={user}
                    />
                </Suspense>
            )}

        </div>
    );
}
