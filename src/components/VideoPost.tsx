"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import CustomVideoPlayer from './video/CustomVideoPlayer';
import { cn } from '@/lib/utils';

interface VideoPostProps {
    id: string;
    publicId?: string;
    videoUrl?: string;
    status: 'processing' | 'ready' | 'error';
    isLocked?: boolean;
    price?: number;
    previewDuration?: number;
    blurEnabled?: boolean;
    caption?: string;
    tags?: string[];
}

export const VideoPost = memo(function VideoPost({
    id,
    publicId,
    videoUrl,
    status,
    isLocked,
    price,
    previewDuration = 5,
    blurEnabled,
    caption,
    tags
}: VideoPostProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { currentVideoId, setCurrentVideo } = usePlayerStore();

    // Lazy load: only load media area when near viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleTogglePlay = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentVideoId === id) {
            setCurrentVideo(null);
        } else {
            setCurrentVideo(id);
        }
    }, [currentVideoId, id, setCurrentVideo]);

    const finalUrl = publicId
        ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/${publicId}.mp4`
        : videoUrl;

    if (status === 'processing') {
        return (
            <div className="aspect-[9/16] bg-[#0a0a0a] rounded-[32px] flex flex-col items-center justify-center border border-white/5">
                <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
            </div>
        );
    }

    if (status === 'ready' && finalUrl) {
        return (
            <div
                ref={containerRef}
                className="relative aspect-[9/16] rounded-[32px] overflow-hidden bg-black group shadow-3xl border border-white/5 cursor-pointer select-none"
                onClick={handleTogglePlay}
            >
                {/* Subtle background gradient */}
                {isVisible && (
                    <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/[0.03] to-black/40" />
                )}

                {/* Video */}
                {isVisible && finalUrl && (
                    <CustomVideoPlayer
                        id={id}
                        url={finalUrl}
                        poster={publicId ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_400,q_auto,f_auto/${publicId}.jpg` : undefined}
                        className={cn(
                            "relative w-full h-full object-contain z-10",
                            isLocked && blurEnabled && "blur-3xl scale-110 opacity-30"
                        )}
                        autoPlay={true}
                    />
                )}

                {/* Caption + Tags overlay at bottom */}
                {!isLocked && (caption || (tags && tags.length > 0)) && (
                    <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
                        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pt-12 pb-6 space-y-2.5">
                            {caption && (
                                <p className="text-[13px] text-white/90 font-medium leading-relaxed line-clamp-3">
                                    {caption}
                                </p>
                            )}
                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-[11px] font-semibold text-[#a855f7]/90"
                                        >
                                            #{tag.replace(/^#/, '')}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isLocked && (
                    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center">
                        <Lock className="w-8 h-8 text-white mb-6 animate-pulse" />
                        <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Premium Manuscript</h3>
                        <p className="text-white/40 text-[10px] font-bold mb-10 tracking-[0.3em]">{price} Gems</p>
                        <button className="h-14 w-full max-w-[220px] bg-white text-black rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Unlock Now
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="aspect-[9/16] bg-[#0a0a0a] rounded-[32px] flex items-center justify-center border border-white/5 opacity-50 grayscale">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Post Unavailable</p>
        </div>
    );
});
