"use client";

import React, { useRef, useEffect, useState } from "react";
import { Heart, MessageSquare, Share2, Gem, Volume2, VolumeX } from "lucide-react";
import { VideoPost } from "@/components/VideoPost";
import { useAuthStore, usePlayerStore } from "@/lib/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, User } from "@/lib/firebase/collections";
import { useIsFollowing, useFollowUser } from "@/lib/firebase/hooks";

interface ForYouVideoProps {
    post: any;
    isActive: boolean;
}

export const ForYouVideo = ({ post, isActive }: ForYouVideoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuthStore();
    const { muted, setMuted } = usePlayerStore();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.engagement?.likes || 0);
    const [creator, setCreator] = useState<User | null>(null);

    const { data: isFollowing } = useIsFollowing(currentUser?.uid, post.creatorId);
    const followMutation = useFollowUser();

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser || isFollowing) return;
        await followMutation.mutateAsync({ followerId: currentUser.uid, followingId: post.creatorId });
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked((v) => !v);
        setLikeCount((n: number) => liked ? n - 1 : n + 1);
    };

    useEffect(() => {
        if (!post.creatorId) return;
        getDoc(doc(db, COLLECTIONS.USERS, post.creatorId)).then((snap) => {
            if (snap.exists()) setCreator({ uid: snap.id, ...snap.data() } as User);
        });
    }, [post.creatorId]);

    const avatarUrl = creator?.photoURL
        ?? `https://ui-avatars.com/api/?name=${creator?.displayName ?? post.creatorId}&background=1a1a1a&color=888&size=80`;

    return (
        <div
            ref={containerRef}
            className="w-full h-screen snap-start flex items-center justify-center bg-[#0d0d0d]"
        >
            {/* Card — curved, reduced height, centered */}
            <div className="relative flex items-end gap-3 w-full max-w-[420px] px-4">

                {/* Video card */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#111]" style={{ height: "72vh" }}>
                    <VideoPost
                        id={post.id}
                        publicId={post.cloudinaryPublicId}
                        videoUrl={post.videoUrl}
                        status={post.status || "ready"}
                        isLocked={post.visibility === "locked"}
                        price={post.price || 0}
                        caption={post.caption}
                        blurEnabled={post.blurEnabled}
                        tags={post.tags}
                    />

                    {/* Scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 to-transparent pointer-events-none rounded-b-2xl" />

                    {/* Mute */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                        className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
                        aria-label="Toggle mute"
                    >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Bottom meta */}
                    <div className="absolute left-4 bottom-5 right-4 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-white leading-none">
                                {creator?.displayName ?? `user_${post.creatorId?.slice(0, 6)}`}
                            </span>
                            {currentUser?.uid !== post.creatorId && (
                                <button
                                    onClick={handleFollow}
                                    disabled={!!isFollowing}
                                    className="text-[11px] text-white/40 hover:text-white/70 transition-colors disabled:text-white/20"
                                >
                                    {isFollowing ? "Following" : "· Follow"}
                                </button>
                            )}
                        </div>
                        {post.caption && (
                            <p className="text-[11px] text-white/45 leading-relaxed line-clamp-2">
                                {post.caption}
                            </p>
                        )}
                    </div>
                </div>

                {/* TikTok-style right action column */}
                <div className="flex flex-col items-center gap-5 pb-2">

                    {/* Avatar + follow dot */}
                    <div className="relative mb-1">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#1a1a1a]">
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        {currentUser?.uid !== post.creatorId && !isFollowing && (
                            <button
                                onClick={handleFollow}
                                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                                aria-label="Follow"
                            >
                                <span className="text-black text-[10px] font-bold leading-none">+</span>
                            </button>
                        )}
                    </div>

                    {/* Like */}
                    <button onClick={handleLike} className="flex flex-col items-center gap-0.5" aria-label="Like">
                        <Heart
                            className="w-7 h-7 transition-colors"
                            style={{ color: liked ? "#f472b6" : "rgba(255,255,255,0.7)", fill: liked ? "#f472b6" : "none" }}
                        />
                        <span className="text-[11px] text-white/50 tabular-nums">{likeCount}</span>
                    </button>

                    {/* Comment */}
                    <button className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors" aria-label="Comment">
                        <MessageSquare className="w-7 h-7" />
                        <span className="text-[11px] text-white/50 tabular-nums">{post.engagement?.comments || 0}</span>
                    </button>

                    {/* Tip */}
                    <button className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors" aria-label="Tip">
                        <Gem className="w-7 h-7" />
                        <span className="text-[11px] text-white/50">Tip</span>
                    </button>

                    {/* Share */}
                    <button className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors" aria-label="Share">
                        <Share2 className="w-7 h-7" />
                        <span className="text-[11px] text-white/50">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
