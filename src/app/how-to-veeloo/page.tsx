"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Play, Eye } from "lucide-react";
import { VIDEOS, TABS, type Tab } from "./data";

export default function HowToVeelooPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("Creator");
    const [watched, setWatched] = useState<Set<string>>(new Set());

    const videos = VIDEOS[activeTab];
    const totalWatched = watched.size;
    const totalVideos = Object.values(VIDEOS).flat().length;

    const handlePlay = (index: number) => {
        setWatched((prev) => new Set([...prev, `${activeTab}:${index}`]));
        const params = new URLSearchParams({ tab: activeTab, index: String(index) });
        router.push(`/how-to-veeloo/watch?${params.toString()}`);
    };

    const isWatched = (index: number) => watched.has(`${activeTab}:${index}`);

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white">
            <Navbar />

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
                            thumbnail={video.thumbnail}
                            watched={isWatched(i)}
                            onPlay={() => handlePlay(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function VideoCard({
    title,
    thumbnail,
    watched,
    onPlay,
}: {
    title: string;
    thumbnail: string;
    watched: boolean;
    onPlay: () => void;
}) {
    return (
        <button
            onClick={onPlay}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] w-full text-left focus:outline-none"
        >
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-[#1a1a1a] group-hover:bg-[#222] transition-colors" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {watched && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Eye className="w-3 h-3 text-white/70" />
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
                <p className="text-[14px] font-bold text-white leading-snug drop-shadow-lg flex-1">{title}</p>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
            </div>
        </button>
    );
}
