"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2, Heart, Captions, ChevronUp, ChevronDown, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VIDEOS, TABS, BG_COLORS, type Tab } from "../data";

function WatchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabParam = (searchParams.get("tab") ?? "Creator") as Tab;
    const indexParam = parseInt(searchParams.get("index") ?? "0", 10);

    const [tab, setTab] = useState<Tab>(TABS.includes(tabParam) ? tabParam : "Creator");
    const [index, setIndex] = useState(indexParam);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(5169);
    const [captionsOn, setCaptionsOn] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const videos = VIDEOS[tab] ?? [];
    const current = videos[index] ?? null;

    // Next video preview (next in same tab, or first of next tab)
    const nextVideo = (() => {
        if (index + 1 < videos.length) return { tab, video: videos[index + 1], index: index + 1 };
        const nextTabIdx = TABS.indexOf(tab) + 1;
        if (nextTabIdx < TABS.length) {
            const nextTab = TABS[nextTabIdx];
            return { tab: nextTab, video: VIDEOS[nextTab][0], index: 0 };
        }
        return null;
    })();

    const prevVideo = (() => {
        if (index - 1 >= 0) return { tab, video: videos[index - 1], index: index - 1 };
        const prevTabIdx = TABS.indexOf(tab) - 1;
        if (prevTabIdx >= 0) {
            const prevTab = TABS[prevTabIdx];
            const prevVideos = VIDEOS[prevTab];
            return { tab: prevTab, video: prevVideos[prevVideos.length - 1], index: prevVideos.length - 1 };
        }
        return null;
    })();

    // Sync URL when tab/index change
    useEffect(() => {
        const params = new URLSearchParams({ tab, index: String(index) });
        router.replace(`/how-to-veeloo/watch?${params.toString()}`, { scroll: false });
    }, [tab, index]);

    // Reset video on change
    useEffect(() => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [tab, index]);

    const navigate = (next: { tab: Tab; index: number } | null) => {
        if (!next) return;
        setTab(next.tab);
        setIndex(next.index);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleLike = () => {
        setLiked((v) => !v);
        setLikes((v) => liked ? v - 1 : v + 1);
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: current?.title, url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const bgColor = BG_COLORS[index % BG_COLORS.length];

    return (
        <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center relative">
            <Navbar />

            {/* Back button */}
            <button
                onClick={() => router.push("/how-to-veeloo")}
                className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h1 className="absolute top-5 left-1/2 -translate-x-1/2 text-[18px] font-bold text-white z-20 whitespace-nowrap">
                {tab}
            </h1>

            {/* Main layout: phone + side actions */}
            <div className="flex items-center gap-8 mt-2">

                {/* Phone frame */}
                <div className="relative w-[300px] h-[540px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] bg-black flex-shrink-0">

                    {/* Video / background */}
                    {current?.url ? (
                        <video
                            ref={videoRef}
                            src={current.url}
                            className="absolute inset-0 w-full h-full object-cover"
                            loop
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            track={captionsOn ? undefined : undefined}
                        />
                    ) : (
                        <div className={`absolute inset-0 ${bgColor}`} />
                    )}

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Play/pause overlay button */}
                    <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center z-10 group"
                    >
                        {!isPlaying && (
                            <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                        )}
                    </button>

                    {/* Bottom overlay: "Up next" preview */}
                    {nextVideo && (
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                            <p className="text-white text-[13px] font-semibold mb-2 drop-shadow">
                                Up next... {nextVideo.tab !== tab ? `${nextVideo.tab}!` : ""}
                            </p>
                            <button
                                onClick={() => navigate({ tab: nextVideo.tab, index: nextVideo.index })}
                                className="flex items-center gap-2 group"
                            >
                                <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${BG_COLORS[nextVideo.index % BG_COLORS.length]} flex items-center justify-center border border-white/10`}>
                                    {nextVideo.video.thumbnail ? (
                                        <img src={nextVideo.video.thumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Play className="w-4 h-4 text-white/60 fill-white/60" />
                                    )}
                                </div>
                                <p className="text-white text-[13px] font-bold leading-snug drop-shadow max-w-[140px]">
                                    {nextVideo.video.title}
                                </p>
                            </button>
                        </div>
                    )}
                </div>

                {/* Side actions */}
                <div className="flex flex-col items-center gap-6">
                    {/* Share */}
                    <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                        <div className="w-11 h-11 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center group-hover:bg-white/[0.12] transition-colors">
                            <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[11px] text-white/60 font-medium">Share</span>
                    </button>

                    {/* Like */}
                    <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
                        <div className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${liked ? "bg-pink-500/20 border-pink-500/40" : "bg-white/[0.07] border-white/10 group-hover:bg-white/[0.12]"}`}>
                            <Heart className={`w-5 h-5 transition-colors ${liked ? "text-pink-400 fill-pink-400" : "text-white"}`} />
                        </div>
                        <span className="text-[11px] text-white/60 font-medium">{likes.toLocaleString()}</span>
                    </button>

                    {/* Captions */}
                    <button onClick={() => setCaptionsOn((v) => !v)} className="flex flex-col items-center gap-1 group">
                        <div className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${captionsOn ? "bg-white/20 border-white/30" : "bg-white/[0.07] border-white/10 group-hover:bg-white/[0.12]"}`}>
                            <Captions className={`w-5 h-5 ${captionsOn ? "text-white" : "text-white"}`} />
                        </div>
                        <span className="text-[11px] text-white/60 font-medium">Captions</span>
                    </button>

                    {/* Up */}
                    <button
                        onClick={() => prevVideo && navigate({ tab: prevVideo.tab, index: prevVideo.index })}
                        disabled={!prevVideo}
                        className="w-11 h-11 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronUp className="w-5 h-5 text-white" />
                    </button>

                    {/* Down */}
                    <button
                        onClick={() => nextVideo && navigate({ tab: nextVideo.tab, index: nextVideo.index })}
                        disabled={!nextVideo}
                        className="w-11 h-11 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronDown className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Video title below phone */}
            <p className="mt-5 text-[15px] font-semibold text-white/80">{current?.title}</p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-3">
                {videos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`rounded-full transition-all ${i === index ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/25 hover:bg-white/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function WatchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        }>
            <WatchContent />
        </Suspense>
    );
}
