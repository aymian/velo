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
    List
} from "lucide-react";
import { useCreateStore, useAuthStore, useNotificationStore } from "@/lib/store";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { Navbar } from "@/components/Navbar";

import { useQueryClient } from "@tanstack/react-query";

export default function CreatePostPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();
    const {
        videoFile,
        videoPreview,
        caption,
        isUploading,
        uploadProgress,
        setVideoFile,
        setCaption,
        reset
    } = useCreateStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("video/")) {
            addNotification({ type: "error", message: "Videos only" });
            return;
        }
        setVideoFile(file, URL.createObjectURL(file));
    };

    const handlePublish = async () => {
        if (!caption || isUploading || !user) return;
        const setUploading = useCreateStore.getState().setUploading;
        const setUploadProgress = useCreateStore.getState().setUploadProgress;

        setUploading(true);
        try {
            let cloudinaryData: any = {};

            if (videoFile) {
                // 🚀 Cloudinary Upload
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

                if (!cloudName || cloudName === 'your_cloud_name_here') {
                    throw new Error("Cloudinary Cloud Name is not configured in .env");
                }

                const formData = new FormData();
                formData.append('file', videoFile);
                formData.append('upload_preset', 'ml_default');

                const axios = (await import('axios')).default;
                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                        formData,
                        {
                            onUploadProgress: (p: any) => setUploadProgress(Math.round((p.loaded * 100) / p.total))
                        }
                    );

                    if (response.data) {
                        cloudinaryData.cloudinaryPublicId = response.data.public_id;
                        cloudinaryData.videoUrl = response.data.secure_url;
                        cloudinaryData.status = 'ready';
                    }
                } catch (uploadError: any) {
                    console.error("Cloudinary Detailed Error:", uploadError.response?.data);
                    throw new Error(uploadError.response?.data?.error?.message || "Cloudinary upload failed");
                }
            }

            const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), {
                creatorId: user.uid,
                caption,
                createdAt: serverTimestamp(),
                engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
                ...cloudinaryData
            });

            // 🚀 Optimistic Cache Update: Inject into feed instantly
            queryClient.setQueryData(["posts", user.uid], (old: any[] = []) => [
                { id: docRef.id, creatorId: user.uid, caption, createdAt: new Date(), ...cloudinaryData, engagement: { likes: 0, comments: 0, shares: 0, views: 0 } },
                ...old
            ]);

            addNotification({ type: "success", message: "Thread archived and posted" });
            reset();
            router.push('/profile');
        } catch (e: any) {
            console.error(e);
            addNotification({ type: "error", message: e.message || "Failed to post thread" });
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white/10 relative overflow-hidden">
            <Navbar />

            {/* 🎞️ Kinetic Background Video */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30 grayscale saturate-0"
                >
                    <source src="https://ext.same-assets.com/207502500/245264620.mp4" type="video/mp4" />
                </video>
                {/* Midnight Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <main className="relative z-20 flex items-center justify-center h-[calc(100vh-80px)] mt-16 px-4">

                <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
                    {/* --- COMPOSER MODAL (LEFT) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-xl bg-[#111] rounded-[32px] border border-white/10 shadow-3xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 h-14 flex items-center justify-between border-b border-white/5">
                            <X onClick={() => router.back()} className="w-5 h-5 cursor-pointer hover:opacity-70" />
                            <h2 className="text-sm font-bold">New thread</h2>
                            <div className="flex items-center gap-4">
                                <Copy className="w-5 h-5 opacity-40" />
                                <MoreHorizontal className="w-5 h-5 opacity-40" />
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-4">
                                {/* Avatar & Vertical Line */}
                                <div className="flex flex-col items-center">
                                    <img
                                        src={user?.photoURL || "https://ui-avatars.com/api/?name=U&background=333&color=fff"}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="w-[1px] flex-1 bg-white/10 my-2" />
                                    <div className="w-4 h-4 rounded-full bg-white/5" />
                                </div>

                                {/* Content Matrix */}
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold">{user?.displayName?.toLowerCase().replace(/\s/g, '') || "soul.of.ian"}</span>
                                        <ChevronRight className="w-3 h-3 text-white/20" />
                                        <span className="text-white/20 text-xs">Add a topic</span>
                                    </div>

                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="What's new?"
                                        className="w-full bg-transparent border-none p-0 text-[14px] outline-none placeholder:text-white/20 resize-none min-h-[40px] mb-4"
                                    />

                                    {/* Icon Bar */}
                                    <div className="flex items-center gap-5 pb-8">
                                        <ImageIcon onClick={() => fileInputRef.current?.click()} className="w-5 h-5 text-white/30 cursor-pointer hover:text-white" />
                                        <div className="text-[9px] font-black border border-white/20 rounded px-1 text-white/30">GIF</div>
                                        <Smile className="w-5 h-5 text-white/30" />
                                        <AlignLeft className="w-5 h-5 text-white/30 rotate-180" />
                                        <List className="w-5 h-5 text-white/30" />
                                        <MapPin className="w-5 h-5 text-white/30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 opacity-30 group cursor-pointer">
                                <Plus className="w-4 h-4 border border-white rounded-sm p-0.5" />
                                <span className="text-sm font-medium">Reply options</span>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={!caption || isUploading}
                                className={`px-6 py-1.5 rounded-xl font-bold text-sm ${caption && !isUploading ? "bg-white text-black" : "opacity-30 pointer-events-none"
                                    }`}
                            >
                                Post
                            </button>
                        </div>
                    </motion.div>

                    {/* --- LIVE PREVIEW (RIGHT - TIKTOK STYLE) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex flex-col items-center space-y-6"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Live Output Preview</span>

                        <div className="relative w-[280px] h-[520px] rounded-[48px] border-[6px] border-[#222] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex items-center justify-center group">
                            {videoPreview ? (
                                <>
                                    <video src={videoPreview} className="w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
                                    {/* Mock UI Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                                    <div className="absolute bottom-10 left-6 right-10 flex flex-col gap-2">
                                        <span className="text-[11px] font-black text-white leading-none">@{user?.displayName?.toLowerCase().replace(/\s/g, '') || 'v_creator'}</span>
                                        <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed">
                                            {caption || "Your manuscript narrative will appear here..."}
                                        </p>
                                    </div>
                                    <div className="absolute right-3 bottom-20 flex flex-col gap-5 items-center">
                                        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20" />
                                        <div className="w-7 h-7 rounded-full bg-white/10" />
                                        <div className="w-7 h-7 rounded-full bg-white/10" />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 space-y-4">
                                    <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <Play className="w-6 h-6 text-white/10" />
                                    </div>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-loose">
                                        Upload media to <br /> generate output
                                    </p>
                                </div>
                            )}

                            {/* X to remove media in preview mode too */}
                            {videoPreview && (
                                <X
                                    onClick={() => setVideoFile(null, null)}
                                    className="absolute top-6 right-6 w-6 h-6 p-1.5 cursor-pointer bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all text-white active:scale-90"
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Real-time Syncing</span>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Flat Loader */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{uploadProgress}% Posting...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} accept="video/*" className="hidden" />
        </div>
    );
}
