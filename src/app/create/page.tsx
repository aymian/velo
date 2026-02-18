"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Image as ImageIcon,
    Smile,
    AlignLeft,
    MapPin,
    MoreHorizontal,
    Copy,
    Plus,
    Gem,
    Loader2,
    Play,
    ChevronRight,
    List,
    Settings2,
    Layers,
    StickyNote
} from "lucide-react";
import { useCreateStore, useAuthStore, useNotificationStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";

import { useQueryClient } from "@tanstack/react-query";

export default function CreatePostPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { caption, videoPreview, videoFile, setVideoFile } = useCreateStore();
    const setCaption = useCreateStore((state) => state.setCaption);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        useCreateStore.getState().setVideoFile(file, previewUrl);
    };

    const handleNext = () => {
        if (!caption) return;

        // Use URL parameter for the post editor as requested
        const params = new URLSearchParams();
        if (videoPreview) params.set('source', videoPreview);
        if (caption) params.set('caption', caption);

        router.push(`/post-editor?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff3b5c]/30 relative overflow-hidden font-sans">
            <Navbar />

            {/* Kinetic Background Video */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-10 grayscale"
                >
                    <source src="https://ext.same-assets.com/207502500/245264620.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            </div>

            <main className="relative z-20 flex items-center justify-center h-[calc(100vh-80px)] mt-16 px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">

                    {/* --- COMPOSER MODAL (THREADS/SURGICAL STYLE) --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-[620px] bg-[#121212] border border-white/10 rounded-[24px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#121212]">
                            <button
                                onClick={() => router.back()}
                                className="text-[17px] font-normal text-white hover:opacity-70 transition-opacity"
                            >
                                Cancel
                            </button>
                            <h2 className="text-[17px] font-bold tracking-tight">New post</h2>
                            <div className="flex items-center gap-5">
                                <Layers className="w-[20px] h-[20px] text-white/40 cursor-not-allowed" strokeWidth={2} />
                                <MoreHorizontal className="w-[22px] h-[22px] text-white/40 cursor-not-allowed" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 flex gap-4">
                            {/* Left Line & Avatar Rail */}
                            <div className="flex flex-col items-center">
                                <div className="w-[42px] h-[42px] rounded-full overflow-hidden border border-white/10 bg-white/[0.03]">
                                    <img
                                        src={user?.photoURL || "https://ui-avatars.com/api/?name=U&background=333&color=fff"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-[2px] flex-1 bg-white/10 my-1 rounded-full" />
                                <div className="w-5 h-5 rounded-full overflow-hidden opacity-20 bg-white/10 border border-white/10 flex items-center justify-center">
                                    <img
                                        src={user?.photoURL || "https://ui-avatars.com/api/?name=U&background=333&color=fff"}
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                            </div>

                            {/* Center Content */}
                            <div className="flex-1 space-y-2 mt-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-bold text-white leading-none">
                                        {user?.displayName?.toLowerCase().replace(/\s/g, '.') || "soul.of.ian"}
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                                    <span className="text-[15px] font-medium text-[#4D96FF]/60 hover:text-[#4D96FF] cursor-pointer transition-colors leading-none">
                                        Add a topic
                                    </span>
                                </div>

                                <textarea
                                    value={caption || ""}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="What's new?"
                                    className="w-full bg-transparent border-none p-0 text-[16px] text-white/90 outline-none placeholder:text-white/20 resize-none min-h-[44px] leading-relaxed"
                                />

                                {/* Preview Thumbnail (if media exists) */}
                                {videoPreview && (
                                    <div className="relative mt-2 rounded-xl border border-white/10 overflow-hidden max-w-[320px] group">
                                        {videoFile?.type.startsWith('video/') ? (
                                            <video src={videoPreview} className="w-full h-auto" muted loop autoPlay playsInline />
                                        ) : (
                                            <img src={videoPreview} alt="Preview" className="w-full h-auto" />
                                        )}
                                        <button
                                            onClick={() => setVideoFile(null, null)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white/60 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Icon Bar (Exact from reference) */}
                                <div className="flex items-center gap-5 pt-2 pb-6">
                                    <button onClick={() => fileInputRef.current?.click()} className="group">
                                        <ImageIcon className="w-[22px] h-[22px] text-white/30 group-hover:text-white transition-colors" strokeWidth={1.5} />
                                    </button>
                                    <div className="text-[10px] font-black border border-white/20 rounded px-1.5 py-0.5 text-white/30 hover:text-white hover:border-white transition-all cursor-pointer">GIF</div>
                                    <Smile className="w-[22px] h-[22px] text-white/30 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                                    <AlignLeft className="w-[22px] h-[22px] text-white/30 rotate-180 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                                    <div className="relative">
                                        <StickyNote className="w-[22px] h-[22px] text-white/30 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white border border-[#121212] rounded-full" />
                                    </div>
                                    <MapPin className="w-[22px] h-[22px] text-white/30 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                                </div>

                                <p className="text-[15px] font-medium text-white/20">Add to post</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="w-6 h-6 border border-white/30 rounded flex items-center justify-center group-hover:border-white transition-colors">
                                    <Settings2 className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                                </div>
                                <span className="text-[15px] font-medium text-white/40 group-hover:text-white transition-colors">Reply options</span>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!caption}
                                className={`px-8 h-10 rounded-xl font-bold text-[15px] transition-all ${caption
                                    ? "bg-[#202020] text-white hover:bg-[#282828] active:scale-95"
                                    : "bg-[#181818] text-white/20 cursor-not-allowed"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>

                    {/* --- VIDEO PREVIEW (STAYS SHARP) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex flex-col items-center gap-6"
                    >
                        <div className="relative w-[300px] h-[540px] rounded-[48px] border-[10px] border-[#181818] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden bg-black flex items-center justify-center group">
                            {videoPreview ? (
                                <>
                                    {videoFile?.type.startsWith('image/') ? (
                                        <img src={videoPreview} className="w-full h-full object-cover opacity-80" alt="Preview" />
                                    ) : (
                                        <video src={videoPreview} className="w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                                    <div className="absolute bottom-10 left-6 right-10 flex flex-col gap-2">
                                        <span className="text-[12px] font-bold text-white uppercase tracking-tight">@{user?.displayName?.toLowerCase().replace(/\s/g, '') || 'v_creator'}</span>
                                        <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                                            {caption || "Visual manifest narrative..."}
                                        </p>
                                    </div>
                                    <X
                                        onClick={() => setVideoFile(null, null)}
                                        className="absolute top-6 right-6 w-8 h-8 p-2 cursor-pointer bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all text-white active:scale-90"
                                    />
                                </>
                            ) : (
                                <div className="text-center p-8 space-y-5">
                                    <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <Play className="w-6 h-6 text-white/10" />
                                    </div>
                                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] leading-loose">
                                        Source media <br /> required
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-[#4D96FF] rounded-full animate-pulse shadow-[0_0_8px_rgba(77,150,255,0.5)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Live Sync Engaged</span>
                        </div>
                    </motion.div>
                </div>
            </main>

            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept="video/*,image/*"
                className="hidden"
            />
        </div>
    );
}
