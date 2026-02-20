"use client";

import React from "react";
import { Post, User } from "@/lib/firebase/collections";
import { CustomVideoPlayer } from "../video/CustomVideoPlayer";
import { CardDropdown } from "./CardDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePostLiked, useToggleLike, usePostEngagement } from "@/lib/firebase/hooks";
import { useAuthStore } from "@/lib/store";
import { CommentModal } from "./CommentModal";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "../ui/VerifiedBadge";

dayjs.extend(relativeTime);

interface TweetCardProps {
    post: Post & { creator?: User };
}

export function TweetCard({ post }: TweetCardProps) {
    const { creator } = post;
    const { user: currentUser } = useAuthStore();
    const timeAgo = dayjs(post.createdAt?.toDate?.() || post.createdAt).fromNow(true);

    const [isCommentModalOpen, setIsCommentModalOpen] = React.useState(false);

    // Likes & Realtime Engagement Logic
    const { data: isLiked } = usePostLiked(currentUser?.uid, post.id);
    const toggleLikeMutation = useToggleLike();
    const rtEngagement = usePostEngagement(post.id);

    // Merge fallback counts (Firestore) with real-time counts (RTDB)
    const displayLikes = rtEngagement.likes || post.engagement?.likes || 0;
    const displayComments = rtEngagement.comments || post.engagement?.comments || 0;

    const handleLike = async () => {
        if (!currentUser) return;
        try {
            await toggleLikeMutation.mutateAsync({
                userId: currentUser.uid,
                postId: post.id
            });
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Extract hashtags from caption
    const hashtags = post.caption?.match(/#[a-z0-9]+/gi) || [];
    const cleanCaption = post.caption?.replace(/#[a-z0-9]+/gi, "").trim();

    return (
        <div className="flex flex-col w-full max-w-[350px] mx-auto mb-12 animate-in fade-in duration-500">
            {/* 1. INSTAGRAM STYLE HEADER */}
            <div className="flex items-center justify-between px-2 py-3">
                <Link
                    href={`/${creator?.username || "user"}`}
                    className="flex items-center gap-3 active:opacity-60 transition-opacity"
                >
                    <Avatar className="w-8 h-8 ring-1 ring-white/10">
                        <AvatarImage src={creator?.photoURL || ""} />
                        <AvatarFallback className="bg-zinc-900 text-[10px] font-bold">
                            {creator?.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-none">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-[13px] text-white">
                                {creator?.username || "user"}
                            </span>
                            <VerifiedBadge 
                                showOnCondition={!!(creator?.verified || (creator?.followers && creator.followers >= 1))} 
                                size={14}
                            />
                            <span className="text-white/30 text-[12px] ml-1">· {timeAgo}</span>
                        </div>
                        <span className="text-white/40 text-[11px] font-medium mt-0.5">
                            {creator?.displayName || "Veeloo User"}
                        </span>
                    </div>
                </Link>
                <button className="p-1 hover:bg-white/5 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white/40" />
                </button>
            </div>

            {/* 2. MEDIA - Reduced Height (Instagram Portrait Standard 4:5) */}
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/5 bg-black aspect-[4/5] shadow-lg group">
                {(post.videoUrl || (post.cloudinaryPublicId && !post.caption?.toLowerCase().includes("pic") && !post.caption?.toLowerCase().includes("img"))) ? (
                    <CustomVideoPlayer
                        id={post.id}
                        url={post.cloudinaryPublicId
                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/${post.cloudinaryPublicId}.mp4`
                            : post.videoUrl || ""
                        }
                        poster={post.cloudinaryPublicId ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,q_auto,f_auto/${post.cloudinaryPublicId}.jpg` : undefined}
                        className="w-full h-full object-cover"
                        autoPlay={true}
                    />
                ) : post.cloudinaryPublicId ? (
                    <img
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${post.cloudinaryPublicId}.jpg`}
                        alt="Post Media"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-8 text-center text-white/20 italic">
                        {post.caption}
                    </div>
                )}
            </div>

            {/* 3. SIMPLE ACTIONS (NO CIRCLES) */}
            <div className="flex items-center justify-between px-1 py-3 text-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "active:scale-90 transition-all",
                            isLiked ? "text-[#ff4081]" : "hover:text-white/60"
                        )}
                    >
                        <Heart className={cn("w-6 h-6 stroke-[1.5]", isLiked && "fill-current")} />
                    </button>
                    <button
                        onClick={() => setIsCommentModalOpen(true)}
                        className="hover:text-white/60 active:scale-90 transition-all"
                    >
                        <MessageCircle className="w-6 h-6 stroke-[1.5]" />
                    </button>
                    <button className="hover:text-white/60 active:scale-90 transition-all">
                        <Send className="w-6 h-6 stroke-[1.5] -rotate-12" />
                    </button>
                </div>
                <button className="hover:text-white/60 active:scale-90 transition-all">
                    <Bookmark className="w-6 h-6 stroke-[1.5]" />
                </button>
            </div>

            {/* 4. FEEDBACK & CAPTION */}
            <div className="px-2 space-y-1">
                <div className="text-[13px] font-bold mb-1">
                    {displayLikes.toLocaleString()} likes
                </div>

                <div className="text-[14px] leading-snug">
                    <span className="font-bold mr-2 text-white">
                        {creator?.username || "user"}
                    </span>
                    <span className="text-white/90">
                        {cleanCaption}
                    </span>
                </div>

                {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {hashtags.map((tag, idx) => (
                            <span key={idx} className="text-[#7c4dff] text-[13px] font-medium hover:underline cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setIsCommentModalOpen(true)}
                    className="text-[13px] text-white/40 block pt-1 hover:text-white/60 transition-colors"
                >
                    View all {displayComments.toLocaleString()} comments
                </button>
            </div>

            {/* Comment Modal */}
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                post={post}
            />
        </div>
    );
}
