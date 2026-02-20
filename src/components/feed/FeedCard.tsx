"use client";

import { motion } from "framer-motion";
import { Heart, Share2, DollarSign, Bookmark, Download, Pause, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, User } from "@/lib/firebase/collections";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VerifiedBadge } from "../ui/VerifiedBadge";

interface FeedCardProps {
    post: Post & { creator?: User };
}

export function FeedCard({ post }: FeedCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!post.videoUrl) return;
        try {
            const res = await fetch(post.videoUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${post.id || "video"}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            window.open(post.videoUrl, "_blank");
        }
    };

    return (
        <Link href={`/watch/${post.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-[#16161D] border border-[#27272A] rounded-lg overflow-hidden shadow-sm hover:border-[#FF2D55]/50 transition-all duration-300"
            >
                {/* Video / Thumbnail */}
                <div
                    className="relative aspect-[9/16] bg-black"
                    onClick={togglePlay}
                >
                    {post.videoUrl ? (
                        <>
                            <video
                                ref={videoRef}
                                src={post.videoUrl}
                                className="w-full h-full object-cover cursor-pointer"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                                    <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                            {post.cloudinaryPublicId ? (
                                <img
                                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${post.cloudinaryPublicId}.jpg`}
                                    alt={post.caption}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                "No Preview"
                            )}
                        </div>
                    )}

                    {/* Overlay Credits/Pills */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {post.tags?.map(tag => (
                            <Badge key={tag} className="bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/80 hover:bg-black/80 font-normal py-0 px-2 h-5">
                                {tag}
                            </Badge>
                        ))}
                        {post.visibility === 'subscribers' && (
                            <Badge className="bg-[#FF2D55] text-white border-none text-[10px] font-bold py-0 px-2 h-5">
                                Premium
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Creator Info & Action Bar */}
                <div className="p-3 bg-gradient-to-b from-[#16161D] to-[#0D0D12]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border border-white/10">
                                <AvatarImage src={post.creator?.photoURL || ""} />
                                <AvatarFallback className="bg-[#222] text-[10px] text-white/50">
                                    {post.creator?.displayName?.charAt(0) || post.creator?.username?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-white leading-none">
                                        {post.creator?.displayName || post.creator?.username || "Unknown"}
                                    </span>
                                    <VerifiedBadge
                                        showOnCondition={!!(post.creator?.verified || (post.creator?.followers && post.creator.followers >= 1))}
                                        size={12}
                                    />
                                </div>
                                <span className="text-[10px] text-white/40 leading-none mt-1">
                                    @{post.creator?.username || "user"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsLiked(!isLiked);
                                }}
                                className="flex flex-col items-center gap-1 group/btn transition-transform active:scale-90"
                            >
                                <Heart
                                    className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        isLiked ? "fill-[#FF2D55] text-[#FF2D55] drop-shadow-[0_0_8px_rgba(255,45,85,0.4)]" : "text-white/40 group-hover/btn:text-[#FF2D55]"
                                    )}
                                />
                                <span className="text-[9px] text-white/20 font-medium">{(post.engagement?.likes || 0) + (isLiked ? 1 : 0)}</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="flex flex-col items-center gap-1 group/btn transition-transform active:scale-95"
                            >
                                <DollarSign className="w-5 h-5 text-[#FF2D55] hover:drop-shadow-[0_0_8px_rgba(255,45,85,0.4)] transition-all" />
                                <span className="text-[9px] text-white/20 font-medium">Tip</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="text-white/30 hover:text-white transition-colors"
                            >
                                {isPlaying
                                    ? <Pause className="w-4 h-4" />
                                    : <Play className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="text-white/30 hover:text-white transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="text-white/30 hover:text-white transition-colors"
                            >
                                <Bookmark className="w-4 h-4" />
                            </button>
                            {post.videoUrl && (
                                <button
                                    onClick={handleDownload}
                                    className="text-white/30 hover:text-white transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subtle Pink Shadow Overlay on Hover */}
                <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_30px_rgba(255,45,85,0.08)] transition-all duration-500" />
            </motion.div>
        </Link>
    );
}
