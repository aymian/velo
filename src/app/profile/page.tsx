"use client";

import React, { useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
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
    MessageCircle
} from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { VideoPost } from "@/components/VideoPost";
import { useCreatorPosts } from "@/lib/hooks/usePosts";
import { useUser, useIsFollowing, useFollowUser, useUnfollowUser } from "@/lib/firebase/hooks";
import * as Tabs from "@radix-ui/react-tabs";
import { cn, isUserVerified } from "@/lib/utils";

// Lazy-load the heavy edit profile dialog
const EditProfileDialog = lazy(() => import("@/components/EditProfileDialog"));

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser } = useAuthStore();
    const { data: userProfile } = useUser(authUser?.uid || "");
    const user = (userProfile || authUser) as any;
    const isVerified = isUserVerified(user);

    const [activeTab, setActiveTab] = useState("all");
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);

    // 🚀 High-Performance Fetching with TanStack Query
    const { data: posts = [], isLoading: postsLoading } = useCreatorPosts(user?.uid);

    const tabs = useMemo(() => [
        { id: "all", label: "All", icon: Columns },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "veeloo Cards", icon: Layout },
        { id: "collections", label: "Collections", icon: Gift },
    ], []);



    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#ff3b5c]">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">

                {/* --- Profile Header (STAY SHARP) --- */}
                <div className="flex items-start gap-8 mb-12">
                    <div className="relative">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/[0.03] border border-white/10">
                            <img
                                src={user?.photoURL || "https://ui-avatars.com/api/?name=Funny+Badger&background=333&color=fff"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 w-9 h-9 bg-black border border-white/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 pt-2">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <h1 className="text-[20px] font-semibold leading-tight">{user?.displayName || "Funny Badger"}</h1>
                                    <VerifiedBadge showOnCondition={isVerified} />
                                </div>
                                <p className="text-white/40 text-[13px]">Rwanda, 19 y.o.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 mt-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">{posts.length}</span>
                                <span className="text-[11px] text-white/30">Posts</span>
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
                                onClick={() => router.push('/create')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#ff3b5c] text-white rounded-full font-bold text-[13px] hover:bg-[#d6304d] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create Post
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: `Check out ${user?.displayName || 'this profile'} on Velo`,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 border border-white/20 rounded-full font-bold text-[13px] hover:bg-white/5 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button
                                onClick={() => setIsEditCardOpen(true)}
                                className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all text-white/40 hover:text-white"
                                title="Edit Profile"
                            >
                                <Pencil className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Interactive Tabs (Instagram/Threads Style) --- */}
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
                                    {[1, 2, 3].map((i) => (
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

            {/* --- FLOATING INSTAGRAM STYLE EDIT PROFILE (Lazy Loaded) --- */}
            {isEditCardOpen && (
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
