"use client";

import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, DollarSign, Bookmark, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, User } from "@/lib/firebase/collections";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeedCardProps {
    post: Post & { creator?: User };
}

export function FeedCard({ post }: FeedCardProps) {
    const [isLiked, setIsLiked] = useState(false);

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
                <div className="relative aspect-[9/16] bg-black">
                    {post.videoUrl ? (
                        <video
                            src={post.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
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
                                    {post.creator?.verified && (
                                        <CheckCircle2 className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]/20" />
                                    )}
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
                        </div>
                    </div>
                </div>

                {/* Subtle Pink Shadow Overlay on Hover */}
                <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_30px_rgba(255,45,85,0.08)] transition-all duration-500" />
            </motion.div>
        </Link>
    );
}
