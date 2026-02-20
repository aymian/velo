"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Play, Eye, X } from "lucide-react";

// ─── Video Data ───
// Replace the `url` field with your custom video URLs

const VIDEOS: Record<string, { title: string; thumbnail: string; url: string; watched?: boolean }[]> = {
    Creator: [
        { title: "Getting Started", thumbnail: "", url: "https://res.cloudinary.com/dwm2smxdk/video/upload/v1771587168/threadsdownloader.com_81ed84_oumthv.mp4" },
        { title: "Posting Content", thumbnail: "", url: "" },
        { title: "The Perfect Streaming Spot", thumbnail: "", url: "" },
        { title: "Lighting & Camera", thumbnail: "", url: "" },
        { title: "Going Live", thumbnail: "", url: "" },
        { title: "Engaging Your Audience", thumbnail: "", url: "" },
        { title: "Growing Your Following", thumbnail: "", url: "" },
        { title: "Creator Monetization", thumbnail: "", url: "" },
    ],
    Supporter: [
        { title: "How to Support Creators", thumbnail: "", url: "" },
        { title: "Sending Gifts", thumbnail: "", url: "" },
        { title: "Joining Live Streams", thumbnail: "", url: "" },
        { title: "Subscriptions Explained", thumbnail: "", url: "" },
        { title: "Finding Your Favorites", thumbnail: "", url: "" },
    ],
    Agency: [
        { title: "What is an Agency?", thumbnail: "", url: "" },
        { title: "Managing Creators", thumbnail: "", url: "" },
        { title: "Agency Dashboard", thumbnail: "", url: "" },
        { title: "Payouts & Revenue", thumbnail: "", url: "" },
    ],
    Reseller: [
        { title: "Reseller Program Overview", thumbnail: "", url: "" },
        { title: "Selling Coins", thumbnail: "", url: "" },
        { title: "Reseller Commissions", thumbnail: "", url: "" },
    ],
};

const TABS = ["Creator", "Supporter", "Agency", "Reseller"] as const;
type Tab = typeof TABS[number];

// Gradient overlays per card index for visual variety
const GRADIENTS = [
    "from-purple-600/80 via-pink-500/60 to-transparent",
    "from-pink-600/80 via-fuchsia-500/60 to-transparent",
    "from-indigo-600/80 via-purple-500/60 to-transparent",
    "from-blue-600/80 via-indigo-500/60 to-transparent",
    "from-violet-600/80 via-pink-500/60 to-transparent",
    "from-rose-600/80 via-pink-500/60 to-transparent",
    "from-fuchsia-600/80 via-purple-500/60 to-transparent",
    "from-sky-600/80 via-blue-500/60 to-transparent",
];

const BG_COLORS = [
    "bg-gradient-to-br from-purple-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-pink-900 via-fuchsia-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-indigo-900 via-purple-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-blue-900 via-indigo-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-violet-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-rose-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-fuchsia-900 via-purple-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-sky-900 via-blue-900 to-[#1a1a2e]",
];

export default function HowToVeelooPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Creator");
    const [watched, setWatched] = useState<Set<string>>(new Set());
    const [playing, setPlaying] = useState<{ title: string; url: string } | null>(null);

    const videos = VIDEOS[activeTab];
    const totalWatched = watched.size;
    const totalVideos = Object.values(VIDEOS).flat().length;

    const handlePlay = (video: { title: string; url: string }) => {
        if (!video.url) return;
        setPlaying(video);
        setWatched((prev) => new Set([...prev, `${activeTab}:${video.title}`]));
    };

    const isWatched = (title: string) => watched.has(`${activeTab}:${title}`);

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white">
            <Navbar />

            {/* Video Player Modal */}
            {playing && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setPlaying(null)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPlaying(null)}
                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {playing.url ? (
                            <video
                                src={playing.url}
                                controls
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                                <p className="text-white/40 text-sm">No video URL set for "{playing.title}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                        How to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D55] to-[#a855f7]">
                            Veeloo
                        </span>
                    </h1>
                </div>

                {/* Controls Row */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <p className="text-[17px] font-bold text-white">Video Guides</p>
                        <p className="text-[13px] text-white/40 mt-0.5">{totalWatched}/{totalVideos} viewed</p>
                    </div>

                    {/* Tab Pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${
                                    activeTab === tab
                                        ? "bg-white text-black"
                                        : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Label */}
                <h2 className="text-[20px] font-bold text-white mb-5">{activeTab}</h2>

                {/* Video Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video, i) => (
                        <VideoCard
                            key={video.title}
                            title={video.title}
                            url={video.url}
                            thumbnail={video.thumbnail}
                            gradient={GRADIENTS[i % GRADIENTS.length]}
                            bgColor={BG_COLORS[i % BG_COLORS.length]}
                            watched={isWatched(video.title)}
                            onPlay={() => handlePlay(video)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function VideoCard({
    title,
    url,
    thumbnail,
    gradient,
    bgColor,
    watched,
    onPlay,
}: {
    title: string;
    url: string;
    thumbnail: string;
    gradient: string;
    bgColor: string;
    watched: boolean;
    onPlay: () => void;
}) {
    return (
        <button
            onClick={onPlay}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] w-full text-left focus:outline-none"
        >
            {/* Background */}
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className={`absolute inset-0 ${bgColor} transition-transform duration-500 group-hover:scale-105`} />
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Watched badge */}
            {watched && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Eye className="w-3 h-3 text-white/70" />
                </div>
            )}

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
                <p className="text-[14px] font-bold text-white leading-snug drop-shadow-lg flex-1">{title}</p>

                {/* Play button */}
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
            </div>
        </button>
    );
}
