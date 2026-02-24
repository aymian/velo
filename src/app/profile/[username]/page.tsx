"use client";

import React, { useState, useMemo, lazy, Suspense, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Share2,
    Pencil,
    Plus,
    Gem,
    Star,
    PlaySquare,
    Gift,
    Image as ImageIcon,
    Layout,
    Columns,
    MessageCircle,
    MoreHorizontal,
    UserMinus,
    Flag,
    ShieldOff,
    LogIn
} from "lucide-react";
import { ReportModal } from "@/components/modals/ReportModal";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { VideoPost } from "@/components/VideoPost";
import { useCreatorPosts } from "@/lib/hooks/usePosts";
import { useUserByUsername, useUserRealtime, useIsFollowing, useFollowUser, useUnfollowUser } from "@/lib/firebase/hooks";
import * as Tabs from "@radix-ui/react-tabs";
import { cn, isUserVerified } from "@/lib/utils";

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
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setShowMoreMenu(false);
            }
        };
        if (showMoreMenu) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showMoreMenu]);

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
        { id: "cards", label: "veeloo Cards", icon: Layout },
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
    const isVerified = isUserVerified(user);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#ff3b5c]">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">

                {/* --- Profile Header (Redesigned) --- */}
                <div className="relative mb-12">
                    {/* Top Right Actions */}
                    <div className="absolute top-0 right-0 flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Check out ${user?.displayName || 'this profile'} on Velo`,
                                        url: window.location.href
                                    });
                                }
                            }}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>

                        {/* Three-dots menu — only visible on other people's profiles */}
                        {!isOwnProfile && (
                            <div className="relative" ref={moreMenuRef}>
                                <button
                                    onClick={() => setShowMoreMenu(v => !v)}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {showMoreMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl z-50"
                                        >
                                            {/* Unfollow — only shown if currently following */}
                                            {isFollowing && (
                                                <button
                                                    onClick={() => { handleFollowToggle(); setShowMoreMenu(false); }}
                                                    className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                                                >
                                                    <UserMinus className="w-4 h-4 text-white/40" />
                                                    Unfollow
                                                </button>
                                            )}

                                            <div className="h-px bg-white/[0.04] mx-3" />

                                            {/* Report */}
                                            <button
                                                onClick={() => { setShowReportModal(true); setShowMoreMenu(false); }}
                                                className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
                                            >
                                                <Flag className="w-4 h-4 text-white/40" />
                                                Report
                                            </button>

                                            <div className="h-px bg-white/[0.04] mx-3" />

                                            {/* Block */}
                                            <button
                                                onClick={() => { setIsBlocked(b => !b); setShowMoreMenu(false); }}
                                                className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-medium text-[#ff3b5c]/80 hover:bg-[#ff3b5c]/[0.06] hover:text-[#ff3b5c] transition-colors"
                                            >
                                                <ShieldOff className="w-4 h-4" />
                                                {isBlocked ? "Unblock" : "Block"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/[0.03] border border-white/10 p-[2px]">
                                <img
                                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || username)}&background=333&color=fff`}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditCardOpen(true)}
                                    className="absolute bottom-1 right-1 w-9 h-9 bg-black border border-white/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                >
                                    <Camera className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>

                        {/* Info & Stats */}
                        <div className="flex-1 text-center md:text-left pt-2">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-2xl font-bold tracking-tight text-white">{user?.displayName || user?.username || username}</h1>
                                <VerifiedBadge showOnCondition={isVerified} size={20} />
                            </div>

                            <p className="text-white/50 text-sm font-medium mb-6">
                                {user?.bio || (user?.location ? `${user.location}${user.age ? `, ${user.age} y.o.` : ''}` : "Dominican Republic, 21 y.o.")}
                            </p>

                            {/* Internal Stats Header style */}
                            <div className="flex items-center justify-center md:justify-start gap-12 mb-8">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xl font-bold text-white">{user?.earned || 87}</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                                        <Gem className="w-3 h-3 text-white/40" /> Earned
                                    </span>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-xl font-bold text-white">{user?.followers || 14}</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Followers</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            onClick={() => router.push('/create')}
                                            className="px-8 py-3 bg-[#ff3b5c] text-white rounded-full font-bold text-[14px] hover:bg-[#d6304d] transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Post
                                        </button>
                                        <button
                                            onClick={() => setIsEditCardOpen(true)}
                                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-[14px] hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={!authUser}
                                            className={cn(
                                                "px-8 py-3 rounded-full font-bold text-[14px] transition-all active:scale-95 flex items-center gap-2",
                                                isFollowing
                                                    ? "bg-white/10 text-white hover:bg-white/15"
                                                    : "bg-gradient-to-r from-[#ff3b5c] to-[#f127a3] text-white hover:opacity-90 shadow-[0_10px_20px_rgba(255,59,92,0.3)]"
                                            )}
                                        >
                                            {!isFollowing && <Plus className="w-4 h-4" />}
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                        <button
                                            onClick={() => router.push(`/chat?u=${user.uid}`)}
                                            disabled={!authUser}
                                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-[14px] hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
                                            Message
                                        </button>
                                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-[14px] hover:bg-white/10 transition-all flex items-center gap-2">
                                            <Gift className="w-4 h-4" strokeWidth={2.5} />
                                            Send gift
                                        </button>
                                    </>
                                )}
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

            {/* --- Report Modal --- */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetName={user?.displayName || user?.username || username}
                targetId={targetUserId || ""}
            />
        </div>
    );
}
