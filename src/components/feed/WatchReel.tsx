"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Share2, DollarSign, Bookmark, ChevronLeft, Maximize2, Flag, MoreHorizontal, CheckCircle2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post, User } from "@/lib/firebase/collections";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VerifiedBadge } from "../ui/VerifiedBadge";

interface WatchReelProps {
    post: Post & { creator?: User };
}

export function WatchReel({ post }: WatchReelProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showTapIndicator, setShowTapIndicator] = useState<null | 'play' | 'pause'>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setShowTapIndicator('pause');
        } else {
            videoRef.current.play();
            setShowTapIndicator('play');
        }
        setIsPlaying(!isPlaying);
        setTimeout(() => setShowTapIndicator(null), 500);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    return (
        <div className="relative w-full h-full bg-[#0F0F14] flex flex-col lg:flex-row overflow-hidden">

            {/* 🎥 Video Player Section (Left/Center) */}
            <div className="relative flex-1 bg-black flex items-center justify-center group" onClick={togglePlay}>
                {post.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={post.videoUrl}
                        className="w-full h-full object-contain"
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                    />
                ) : (
                    <div className="text-white/20">No video content</div>
                )}

                {/* Watermark */}
                <div className="absolute top-6 left-6 pointer-events-none opacity-30 select-none">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">@Velo_{post.creator?.username}</span>
                </div>

                {/* Tap Feedback Overlay */}
                <AnimatePresence>
                    {showTapIndicator && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                        >
                            <div className="bg-black/40 backdrop-blur-md rounded-full p-6">
                                {showTapIndicator === 'play' ? <Play className="w-12 h-12 text-white fill-white" /> : <Pause className="w-12 h-12 text-white fill-white" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Video Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

                <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-4">
                    <button
                        onClick={toggleMute}
                        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all pointer-events-auto shadow-xl"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <button className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all pointer-events-auto">
                        <Maximize2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* 💬 Info & Engagement Panel (Right) */}
            <div className="w-full lg:w-[420px] bg-[#16161D] border-l border-[#27272A] flex flex-col h-full z-30">
                {/* Header */}
                <div className="p-6 border-b border-[#27272A]">
                    <div className="flex items-center justify-between">
                        <Link href={`/profile/${post.creator?.username}`} className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-[#FF2D55]/20">
                                <AvatarImage src={post.creator?.photoURL || ""} />
                                <AvatarFallback className="bg-[#222] text-sm text-white/50">{post.creator?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="text-base font-bold text-white">{post.creator?.displayName || post.creator?.username}</span>
                                    <VerifiedBadge
                                        showOnCondition={!!(post.creator?.verified || (post.creator?.followers && post.creator.followers >= 1))}
                                        size={16}
                                    />
                                </div>
                                <span className="text-xs text-white/40">@{post.creator?.username || "user"}</span>
                            </div>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
                            <MoreHorizontal className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm text-white/80 leading-relaxed font-light">
                            {post.caption || "No description provided."}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags?.map(tag => (
                                <Link key={tag} href={`/discover?tag=${tag}`}>
                                    <Badge className="bg-[#27272A] hover:bg-[#323238] border-none text-[#FF2D55] px-3 py-1 font-medium text-xs rounded-full">
                                        #{tag}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Big Action Buttons */}
                <div className="p-6 grid grid-cols-4 gap-4 border-b border-[#27272A]">
                    <ActionButton
                        icon={Heart}
                        label={isLiked ? "Liked" : (post.engagement?.likes || 0).toString()}
                        active={isLiked}
                        onClick={() => setIsLiked(!isLiked)}
                        activeColor="text-[#FF2D55]"
                        fill={isLiked}
                    />
                    <ActionButton
                        icon={DollarSign}
                        label="Tip"
                        activeColor="text-[#FFD700]"
                        onClick={() => { }}
                    />
                    <ActionButton
                        icon={Bookmark}
                        label={isSaved ? "Saved" : "Save"}
                        active={isSaved}
                        onClick={() => setIsSaved(!isSaved)}
                        activeColor="text-white"
                        fill={isSaved}
                    />
                    <ActionButton
                        icon={Share2}
                        label="Share"
                        onClick={() => { }}
                    />
                </div>

                {/* Comments / Engagement Section Preview */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Comments</h3>
                        <span className="text-[10px] text-white/20 font-bold">{post.engagement?.comments || 0} ITEMS</span>
                    </div>

                    {/* Placeholder for comments */}
                    <div className="space-y-6">
                        <div className="text-center py-10">
                            <MessageSquare className="w-12 h-12 text-[#27272A] mx-auto mb-3" />
                            <p className="text-xs text-white/20 font-medium">Join the conversation</p>
                            <Button variant="link" className="text-[#FF2D55] text-xs p-0 h-auto mt-2">Sign in to comment</Button>
                        </div>
                    </div>
                </div>

                {/* Footer Input */}
                <div className="p-4 border-t border-[#27272A] bg-[#0F0F14]/50">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#27272A]/50 rounded-full border border-white/5 group focus-within:border-[#FF2D55]/30 transition-all">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder:text-white/20"
                        />
                        <button className="text-[#FF2D55] font-bold text-xs px-2 opacity-50 hover:opacity-100 transition-opacity">POST</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, label, active, onClick, activeColor = "text-[#FF2D55]", fill = false }: any) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 group transition-all"
        >
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border border-[#27272A] transition-all group-hover:scale-110 active:scale-95 group-hover:border-white/10",
                active ? "bg-white/5 " + activeColor : "bg-[#1A1A22] text-white/40"
            )}>
                <Icon className={cn("w-6 h-6", active && fill ? "fill-current" : "")} />
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-tighter", active ? activeColor : "text-white/20")}>{label}</span>
        </button>
    );
}
