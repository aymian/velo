"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Hash, MapPin, Globe, Lock, Users, Gem } from "lucide-react";
import { useCreateStore, useAuthStore } from "@/lib/store";
import { searchUsers } from "@/lib/firebase/helpers";
import { Navbar } from "@/components/Navbar";
import { MentionTextarea } from "@/components/MentionTextarea";



export default function CreatePostPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { caption, videoPreview, videoFile, setVideoFile, setCaption } = useCreateStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [postType, setPostType] = useState<"free" | "fans" | "premium">("free");

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/")) return;
        useCreateStore.getState().setVideoFile(file, URL.createObjectURL(file));
    };

    const fetchUsers = async (query: string) => {
        if (!query) return [];
        const users = await searchUsers(query);
        return users.map((u: any) => ({
            id: u.uid,
            display: u.username || u.displayName || "unknown",
        }));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleNext = () => {
        if (!caption && !videoPreview) return;
        const params = new URLSearchParams();
        if (videoPreview) params.set("source", videoPreview);
        if (caption) params.set("caption", caption);
        router.push(`/post-editor?${params.toString()}`);
    };

    const displayName = user?.displayName || user?.username || "creator";
    const avatar = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1e1e1e&color=666&size=80`;
    const usernamePrefix = user?.username || user?.email?.split("@")?.[0] || "you";

    const postTypes = [
        { id: "free", label: "Free", icon: Globe },
        { id: "fans", label: "Fans only", icon: Users },
        { id: "premium", label: "Premium", icon: Gem },
    ] as const;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <Navbar />

            {/* Studio header */}
            <div className="border-b border-white/[0.06] bg-[#0d0d0d] sticky top-16 z-10">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-white/40 hover:text-white/70 transition-colors"
                    >
                        Cancel
                    </button>
                    <span className="text-sm font-semibold text-white">New post</span>
                    <button
                        onClick={handleNext}
                        disabled={!caption && !videoPreview}
                        className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${caption || videoPreview
                            ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white hover:opacity-90 active:scale-95"
                            : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-10 pt-20">
                {/* Emotional headline */}
                <div className="mb-10">
                    <h1 className="text-[22px] font-semibold text-white">Create something worth following.</h1>
                    <p className="text-sm text-white/30 mt-1">Tips and subscriptions can be enabled after publishing.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── LEFT: Creation tools (60%) ── */}
                    <div className="flex-1 space-y-6">

                        {/* Creator identity */}
                        <div className="flex items-center gap-3">
                            <img src={avatar} alt={displayName} className="w-9 h-9 rounded-full object-cover bg-[#1e1e1e]" />
                            <div>
                                <p className="text-[13px] font-semibold text-white leading-none">{displayName}</p>
                                <p className="text-[11px] text-white/30 mt-0.5">@{usernamePrefix}</p>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="space-y-2">
                            <MentionTextarea
                                value={caption ?? ""}
                                onChange={(val) => setCaption(val)}
                                placeholder="Write a caption…"
                                fetchUsers={fetchUsers}
                                minHeight={120}
                            />
                            <div className="flex items-center gap-4 px-1">
                                <button className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors">
                                    <Hash className="w-3.5 h-3.5" /> Hashtag
                                </button>
                                <button className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors">
                                    <MapPin className="w-3.5 h-3.5" /> Location
                                </button>
                                <span className="ml-auto text-[11px] text-white/20 tabular-nums">{(caption ?? "").length}/2200</span>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                            <p className="text-[11px] text-white/30 uppercase tracking-widest px-1">Visibility</p>
                            <div className="flex gap-2">
                                {postTypes.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setPostType(id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] transition-all ${postType === id
                                            ? "border-white/20 bg-white/[0.07] text-white"
                                            : "border-white/[0.06] bg-transparent text-white/35 hover:text-white/60"
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile upload zone */}
                        <div className="lg:hidden">
                            <UploadZone
                                videoPreview={videoPreview}
                                videoFile={videoFile}
                                isDragging={isDragging}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                onClear={() => setVideoFile(null, null)}
                            />
                        </div>

                        {/* Monetization hint */}
                        <div className="p-4 rounded-xl border border-white/[0.06] bg-[#151515]">
                            <div className="flex items-start gap-3">
                                <Gem className="w-4 h-4 text-white/25 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[13px] text-white/60 font-medium">Earn from your content</p>
                                    <p className="text-[12px] text-white/30 mt-0.5 leading-relaxed">
                                        Set a price or enable tips after publishing. Creators keep 80% of all earnings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Continue CTA */}
                        <button
                            onClick={handleNext}
                            disabled={!caption && !videoPreview}
                            className={`w-full py-3 rounded-xl text-[15px] font-semibold transition-all ${caption || videoPreview
                                ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white hover:opacity-90 active:scale-[0.99]"
                                : "bg-white/[0.05] text-white/20 cursor-not-allowed"
                                }`}
                        >
                            Continue to settings
                        </button>
                    </div>

                    {/* ── RIGHT: Live preview (40%) ── */}
                    <div className="hidden lg:block w-[300px] shrink-0">
                        <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 px-1">Preview</p>
                        <UploadZone
                            videoPreview={videoPreview}
                            videoFile={videoFile}
                            isDragging={isDragging}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            onClear={() => setVideoFile(null, null)}
                            caption={caption || undefined}
                            displayName={displayName}
                        />
                        <p className="text-[11px] text-white/20 text-center mt-3">9:16 · Up to 60s · HD recommended</p>
                    </div>
                </div>
            </main>

            <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*,audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
        </div>
    );
}

interface UploadZoneProps {
    videoPreview: string | null;
    videoFile: File | null;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
    onClear: () => void;
    caption?: string;
    displayName?: string;
}

function UploadZone({ videoPreview, videoFile, isDragging, onDragOver, onDragLeave, onDrop, onClick, onClear, caption, displayName }: UploadZoneProps) {
    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={!videoPreview ? onClick : undefined}
            className={`relative aspect-[9/16] rounded-2xl overflow-hidden border transition-all ${videoPreview
                ? "border-white/[0.08] cursor-default"
                : isDragging
                    ? "border-white/30 bg-white/[0.04] cursor-pointer"
                    : "border-dashed border-white/[0.12] bg-[#151515] hover:border-white/25 hover:bg-white/[0.03] cursor-pointer"
                }`}
        >
            {videoPreview ? (
                <>
                    {videoFile?.type.startsWith("image/") ? (
                        <img src={videoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : videoFile?.type.startsWith("audio/") ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.03] gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center">
                                <span className="text-2xl">🎵</span>
                            </div>
                            <p className="text-[13px] text-white/60 font-medium">{videoFile.name}</p>
                            <audio src={videoPreview} controls className="w-[80%] h-8 opacity-50 hover:opacity-100 transition-opacity" />
                        </div>
                    ) : (
                        <video src={videoPreview} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    )}
                    {/* Scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    {/* Meta overlay */}
                    {(displayName || caption) && (
                        <div className="absolute bottom-5 left-4 right-10 space-y-1 pointer-events-none">
                            {displayName && <p className="text-[12px] font-semibold text-white">{displayName}</p>}
                            {caption && <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">{caption}</p>}
                        </div>
                    )}
                    {/* Clear */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white/25" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[13px] text-white/40">Drop your video here</p>
                        <p className="text-[11px] text-white/20">or click to browse</p>
                    </div>
                </div>
            )}
        </div>
    );
}
