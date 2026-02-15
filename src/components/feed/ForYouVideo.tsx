"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, Gem, UserPlus, Volume2, VolumeX } from 'lucide-react';
import { VideoPost } from '@/components/VideoPost';
import { useAuthStore, usePlayerStore } from '@/lib/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, User } from '@/lib/firebase/collections';

interface ForYouVideoProps {
    post: any;
    isActive: boolean;
}

export const ForYouVideo = ({ post, isActive }: ForYouVideoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuthStore();
    const { muted, setMuted } = usePlayerStore();
    const [liked, setLiked] = useState(false);
    const [creator, setCreator] = useState<User | null>(null);

    useEffect(() => {
        const fetchCreator = async () => {
            if (!post.creatorId) return;
            try {
                const docRef = doc(db, COLLECTIONS.USERS, post.creatorId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCreator({ uid: docSnap.id, ...docSnap.data() } as User);
                }
            } catch (error) {
                console.error("Error fetching creator:", error);
            }
        };
        fetchCreator();
    }, [post.creatorId]);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen snap-start flex items-center justify-center bg-[#050505] overflow-hidden p-6 md:p-12"
        >
            {/* 1. Modal-Style Video Content - Now Ultra Clean */}
            <div className="relative w-full max-w-[300px] h-full max-h-[640px] aspect-[9/16] rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 bg-black">
                <VideoPost
                    id={post.id}
                    publicId={post.cloudinaryPublicId}
                    videoUrl={post.videoUrl}
                    status={post.status || 'ready'}
                    isLocked={post.visibility === 'locked'}
                    price={post.price || 0}
                    caption={post.caption}
                    blurEnabled={post.blurEnabled}
                />

                {/* Mute Toggle - Clean Circle */}
                <button
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                    className="absolute top-6 right-6 z-[60] w-9 h-9 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-white/80 transition-all active:scale-95"
                >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* 2. Side Engagement Panel - Vibrant Tango Pink Palette */}
                <div className="absolute right-4 bottom-20 z-50 flex flex-col items-center gap-6">
                    {/* Creator Avatar - Simplified Flat */}
                    <div className="relative mb-2">
                        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-[#111]">
                            <img
                                src={creator?.photoURL || `https://ui-avatars.com/api/?name=${creator?.displayName || post.creatorId}&background=random`}
                                className="w-full h-full object-cover"
                                alt="avatar"
                            />
                        </div>
                        <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FF2D55] text-white rounded-full flex items-center justify-center border border-black transition-transform hover:scale-110">
                            <UserPlus className="w-2.5 h-2.5" />
                        </button>
                    </div>

                    {[
                        { icon: Heart, val: post.engagement?.likes || 0, active: liked, onClick: () => setLiked(!liked) },
                        { icon: MessageSquare, val: post.engagement?.comments || 0 },
                        { icon: Gem, val: 'Tip', special: true },
                        { icon: Share2, val: 'Share' }
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.onClick}
                            className="flex flex-col items-center gap-1.5 group"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${btn.active
                                ? 'bg-[#FF2D55] border-[#FF2D55] text-white scale-110 shadow-[0_0_20px_rgba(255,45,85,0.3)]'
                                : 'bg-[#111] border-white/10 text-white/40 group-hover:text-white group-hover:border-[#FF2D55]/50'
                                }`}>
                                <btn.icon className={`w-4 h-4 ${btn.active ? 'fill-current' : ''}`} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${btn.active ? 'text-[#FF2D55]' : 'text-white/20 group-hover:text-white/60'}`}>
                                {btn.val}
                            </span>
                        </button>
                    ))}
                </div>

                {/* 3. Bottom Metadata - Clean White Typography */}
                <div className="absolute left-6 bottom-8 right-16 z-50 pointer-events-none">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xs tracking-tight">
                                {creator?.displayName || `user_${post.creatorId.slice(0, 4)}`}
                            </span>
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-white/40 text-[10px] font-medium">Follow</span>
                        </div>

                        {post.caption && (
                            <p className="text-white/70 text-[11px] font-medium leading-relaxed line-clamp-2 max-w-[90%]">
                                {post.caption}
                            </p>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 border border-white/5 rounded-full">Explore</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
