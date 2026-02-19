"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Lock, Play, Pause, Volume2, VolumeX, Maximize2, Settings2, Loader2, Check } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

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
}

const QUALITY_OPTIONS = [
    { label: 'Auto', value: 'q_auto' },
    { label: '1080p', value: 'q_auto:best' },
    { label: '720p', value: 'q_auto:good' },
    { label: '480p', value: 'q_auto:eco' },
    { label: '240p', value: '300' }, // Lower bitrate
    { label: '144p', value: '150' }, // Ultra low
];

export const VideoPost = memo(function VideoPost({
    id,
    publicId,
    videoUrl,
    status,
    isLocked,
    price,
    previewDuration = 5,
    blurEnabled,
    caption
}: VideoPostProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentQuality, setCurrentQuality] = useState('q_auto');
    const { currentVideoId, setCurrentVideo, muted, setMuted } = usePlayerStore();

    // 🚀 LAZY LOAD: Only load video when in viewport
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

    const isPlaying = currentVideoId === id;

    // 🚀 SYNC: Resume playback at same time after quality change
    useEffect(() => {
        if (videoRef.current && currentTime > 0) {
            videoRef.current.currentTime = currentTime;
            if (isPlaying) videoRef.current.play().catch(() => { });
        }
    }, [currentQuality]);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.muted = muted;
    }, [muted]);

    const handleTogglePlay = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (showSettings) {
            setShowSettings(false);
            return;
        }
        if (isPlaying) {
            setCurrentVideo(null);
        } else {
            setCurrentVideo(id);
        }
    }, [showSettings, isPlaying, id, setCurrentVideo]);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    const handleFullscreen = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        }
    }, []);

    const handleQualityChange = useCallback((quality: string) => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
        setCurrentQuality(quality);
        setShowSettings(false);
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Construct Cloudinary URL with dynamic quality bits
    // If it's a numeric value (150, 300), we use b_ (bitrate) instead of q_ (quality) for extreme low
    const qualityParam = isNaN(Number(currentQuality)) ? currentQuality : `b_v:${currentQuality}k`;

    const finalUrl = publicId
        ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${qualityParam},f_auto/${publicId}.mp4`
        : videoUrl;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleTogglePlay}
            >
                {/* 1. Blurred Background (CSS-only, no extra video decode) */}
                {isVisible && (
                    <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/[0.03] to-black/40" />
                )}

                {/* 2. Main Video (lazy loaded) */}
                <video
                    ref={videoRef}
                    key={finalUrl}
                    src={isVisible ? finalUrl : undefined}
                    preload={isVisible ? 'metadata' : 'none'}
                    poster={isVisible && publicId ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_400,q_auto,f_auto/${publicId}.jpg` : undefined}
                    className={`relative w-full h-full object-contain z-10 ${isLocked && blurEnabled ? 'blur-3xl scale-110 opacity-30' : ''
                        }`}
                    loop
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onWaiting={() => setIsBuffering(true)}
                    onPlaying={() => setIsBuffering(false)}
                />

                {/* 3. Buffering */}
                {isBuffering && isPlaying && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                        <div className="w-12 h-12 border-[3px] border-white/10 border-t-white rounded-full animate-spin shadow-2xl" />
                    </div>
                )}

                {!isLocked && (
                    <div className={`absolute inset-0 z-30 flex flex-col justify-end p-5 transition-opacity duration-300 ${isHovering || !isPlaying || showSettings ? 'opacity-100' : 'opacity-0'}`}>

                        {/* Settings Modal */}
                            {showSettings && (
                                <div
                                    className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="w-full max-w-[180px] bg-[#121212] rounded-[24px] border border-white/10 overflow-hidden shadow-3xl">
                                        <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Playback Quality</span>
                                        </div>
                                        <div className="py-2">
                                            {QUALITY_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleQualityChange(opt.value)}
                                                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors"
                                                >
                                                    <span className={`text-[12px] font-bold ${currentQuality === opt.value ? 'text-pink-500' : 'text-white/40'}`}>
                                                        {opt.label}
                                                    </span>
                                                    {currentQuality === opt.value && <Check className="w-3.5 h-3.5 text-pink-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        <div className="space-y-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 rounded-b-[32px]">

                            {/* 🚀 New Pink+Violet Timeline with Scrubbing Handle (Youtube Style) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1 mb-1">
                                    <span className="text-[10px] font-black text-white/60 font-mono tracking-tighter">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>
                                <div
                                    className="group/progress relative h-2.5 w-full bg-white/10 rounded-full cursor-pointer flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (videoRef.current) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const pos = (e.clientX - rect.left) / rect.width;
                                            videoRef.current.currentTime = pos * duration;
                                        }
                                    }}
                                >
                                    {/* Track */}
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-violet-600 to-white shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-100"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    {/* 🚀 SCRUBBING HANDLE (YouTube Circle) */}
                                    <div
                                        className="absolute w-4 h-4 bg-white rounded-full shadow-2xl border-2 border-pink-500 scale-0 group-hover/progress:scale-100 transition-transform cursor-grab active:cursor-grabbing z-20"
                                        style={{ left: `calc(${progress}% - 8px)` }}
                                    />
                                    {/* Invisible scrub active area */}
                                    <div className="absolute inset-y-[-10px] inset-x-0 z-10" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <button onClick={handleTogglePlay} className="text-white hover:scale-110 transition-transform">
                                        {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}>
                                        {muted ? <VolumeX className="w-5 h-5 text-white/40" /> : <Volume2 className="w-5 h-5 text-white" />}
                                    </button>
                                </div>

                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                                        className={`p-1.5 rounded-full transition-all ${showSettings ? 'bg-pink-500/20 text-pink-500' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <Settings2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={handleFullscreen} className="text-white/40 hover:text-white">
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {caption && (
                                <p className="text-[14px] font-bold text-white/90 tracking-tight line-clamp-2 px-1 leading-snug">
                                    {caption}
                                </p>
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
