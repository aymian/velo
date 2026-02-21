"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronLeft,
    Loader2,
    Settings,
    Eye,
    Globe,
    Lock,
    Users,
    ChevronRight,
    Play,
    Image as ImageIcon,
    Smile,
    AlignLeft,
    MapPin,
    MoreHorizontal,
    Layers,
    StickyNote,
    Plus,
    Settings2,
    ChevronDown,
    Crop,
    RotateCw,
    RefreshCw,
    Droplets,
    ShieldAlert,
    Hash,
    AtSign,
    Link as LinkIcon,
    DollarSign,
    Lock as LockIcon,
    Clock,
    EyeOff,
    MessageCircle,
    Download,
    Share2,
    Zap,
    BarChart3,
    ArrowUpRight,
    Calendar,
    Pin,
    Bell,
    CheckCircle2,
    Gem
} from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { useCreateStore, useAuthStore, useNotificationStore } from "@/lib/store";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { Navbar } from "@/components/Navbar";
import { useQueryClient } from "@tanstack/react-query";
import { MentionTextarea } from "@/components/MentionTextarea";
import { searchUsers } from "@/lib/firebase/helpers";
import dayjs from "dayjs";



// --- Components ---

const SectionHeader = ({ title, icon: Icon }: any) => (
    <div className="flex items-center gap-2.5 mb-5">
        <Icon className="w-4 h-4 text-white/30" />
        <h3 className="text-[14px] font-semibold text-white/80">{title}</h3>
    </div>
);

const ControlRow = ({ label, icon: Icon, children }: any) => (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
        <div className="flex items-center gap-2.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-white/25" />}
            <p className="text-[13px] text-white/60">{label}</p>
        </div>
        <div>{children}</div>
    </div>
);

const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`w-9 h-5 rounded-full transition-colors relative ${active ? "bg-white/80" : "bg-white/10"}`}>
        <div className={`absolute top-[3px] w-3.5 h-3.5 rounded-full bg-[#0d0d0d] transition-all ${active ? "left-[18px]" : "left-[3px]"}`} />
    </button>
);

function PostEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();

    // Read from store
    const {
        videoFile,
        videoPreview,
        caption,
        isUploading,
        uploadProgress,
        setCaption,
        setVideoFile,
        reset
    } = useCreateStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Locally override from URL if present
    const [localSource, setLocalSource] = useState(videoPreview);
    const [localCaption, setLocalCaption] = useState(caption);

    useEffect(() => {
        const sourceParam = searchParams.get('source');
        const captionParam = searchParams.get('caption');
        if (sourceParam) setLocalSource(sourceParam);
        if (captionParam) {
            setLocalCaption(captionParam);
            setCaption(captionParam);
        }
    }, [searchParams]);

    const handleReplace = (file: File) => {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/")) return;
        const preview = URL.createObjectURL(file);
        setVideoFile(file, preview);
        setLocalSource(preview);
    };

    // --- State ---
    const [postType, setPostType] = useState('free'); // free, premium, followers, private
    const [price, setPrice] = useState('10');
    const [visibility, setVisibility] = useState('public');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [publishedData, setPublishedData] = useState<any>(null);

    // Privacy Toggles
    const [allowComments, setAllowComments] = useState(true);
    const [allowDownloads, setAllowDownloads] = useState(false);
    const [allowShares, setAllowShares] = useState(true);
    const [is18Plus, setIs18Plus] = useState(false);
    const [isSensitive, setIsSensitive] = useState(false);
    const [shouldBlurPreview, setShouldBlurPreview] = useState(false);
    const [addWatermark, setAddWatermark] = useState(true);

    // Engagement Toggles
    const [isPinned, setIsPinned] = useState(false);
    const [notifyFollowers, setNotifyFollowers] = useState(true);
    const [boostPost, setBoostPost] = useState(false);

    const [tags, setTags] = useState("");
    const [location, setLocation] = useState("");
    const [externalLink, setExternalLink] = useState("");

    const fetchUsers = async (query: string) => {
        if (!query) return [];
        const users = await searchUsers(query);
        return users.map((u: any) => ({
            id: u.uid,
            display: u.username || u.displayName || "unknown",
        }));
    };

    const handlePublish = async () => {
        if (!localCaption || isUploading || !user) return;
        const setUploading = useCreateStore.getState().setUploading;
        const setUploadProgress = useCreateStore.getState().setUploadProgress;

        setUploading(true);
        setUploadProgress(0);
        setShowSuccessOverlay(true);
        try {
            let cloudinaryData: any = {};

            if (videoFile) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                if (!cloudName) throw new Error("Cloudinary not configured");

                const formData = new FormData();
                formData.append('file', videoFile);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

                const resourceType = videoFile.type.startsWith('image/') ? 'image' : 'video';

                const axios = (await import('axios')).default;
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                    formData,
                    {
                        onUploadProgress: (p: any) => setUploadProgress(Math.round((p.loaded * 100) / p.total))
                    }
                );

                if (response.data) {
                    cloudinaryData.cloudinaryPublicId = response.data.public_id;
                    cloudinaryData.resourceType = resourceType;
                    cloudinaryData.status = 'ready';
                    if (resourceType === 'image') {
                        cloudinaryData.imageUrl = response.data.secure_url;
                        cloudinaryData.postType = 'image';
                    } else {
                        cloudinaryData.videoUrl = response.data.secure_url;
                        cloudinaryData.postType = 'video';
                    }
                }
            }

            const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), {
                creatorId: user.uid,
                caption: localCaption,
                visibility,
                postType,
                price: postType === 'premium' ? Number(price) : 0,
                createdAt: serverTimestamp(),
                engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
                ...cloudinaryData
            });

            queryClient.setQueryData(["posts", user.uid], (old: any[] = []) => [
                { id: docRef.id, creatorId: user.uid, caption: localCaption, visibility, createdAt: new Date(), ...cloudinaryData, engagement: { likes: 0, comments: 0, shares: 0, views: 0 } },
                ...old
            ]);

            setPublishedData({
                id: docRef.id,
                caption: localCaption,
                preview: localSource,
                resourceType: cloudinaryData.resourceType || 'text'
            });

            // Keep overlay open to show "Successfully Shared"
            setUploading(false);
        } catch (e: any) {
            console.error(e);
            addNotification({ type: "error", message: e.message || "Failed to publish" });
            setUploading(false);
        }
    };

    if (!localCaption && !videoFile && !searchParams.get('source')) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <p className="text-sm text-white/30">Nothing to edit yet.</p>
                    <button onClick={() => router.push('/create')} className="px-6 py-2.5 bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 hover:text-white rounded-xl transition-colors">
                        Start creating
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col pt-20 font-sans">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 pb-40">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- MEDIA PREVIEW (LEFT) --- */}
                    <div className="w-full lg:w-[360px] shrink-0 space-y-4">
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                                <span className="text-[12px] text-white/40">Preview</span>
                                <div className="flex gap-1">
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white/70"><Crop className="w-3.5 h-3.5" /></button>
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white/70"><RotateCw className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            <div className="relative aspect-[9/16] bg-black flex items-center justify-center group overflow-hidden">
                                {localSource ? (
                                    <>
                                        {videoFile?.type.startsWith('image/') ? (
                                            <img src={localSource} className={`w-full h-full object-cover transition-all duration-500 ${shouldBlurPreview ? "blur-2xl opacity-50" : "opacity-90"}`} alt="Preview" />
                                        ) : videoFile?.type.startsWith('audio/') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.03] gap-4">
                                                <div className="w-20 h-20 rounded-full bg-white/[0.05] flex items-center justify-center">
                                                    <span className="text-4xl">🎵</span>
                                                </div>
                                                <p className="text-[14px] text-white/60 font-medium px-6 text-center">{videoFile.name}</p>
                                                <audio src={localSource} controls className="w-[80%] h-10 opacity-50 hover:opacity-100 transition-opacity" />
                                            </div>
                                        ) : (
                                            <video src={localSource} className={`w-full h-full object-cover transition-all duration-500 ${shouldBlurPreview ? "blur-2xl opacity-50" : "opacity-90"}`} autoPlay loop muted playsInline />
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-white/10">
                                        <Play className="w-12 h-12" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No Media Attached</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/20"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Replace
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*,image/*,audio/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleReplace(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div className="px-4 py-3 space-y-1">
                                <ControlRow label="Blur preview" icon={Droplets}>
                                    <Toggle active={shouldBlurPreview} onClick={() => setShouldBlurPreview(!shouldBlurPreview)} />
                                </ControlRow>
                                <ControlRow label="Add watermark" icon={ImageIcon}>
                                    <Toggle active={addWatermark} onClick={() => setAddWatermark(!addWatermark)} />
                                </ControlRow>
                            </div>
                        </div>

                        {/* Forecast */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5">
                            <SectionHeader title="Estimated reach" icon={BarChart3} />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-[#0d0d0d] rounded-xl border border-white/[0.05]">
                                    <p className="text-[11px] text-white/30 mb-1">Est. reach</p>
                                    <p className="text-[15px] font-semibold text-white">120–350</p>
                                </div>
                                <div className="p-4 bg-[#0d0d0d] rounded-xl border border-white/[0.05]">
                                    <p className="text-[11px] text-white/30 mb-1">Engagement</p>
                                    <p className="text-[15px] font-semibold text-white">Medium</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- EDITOR PANEL (RIGHT) --- */}
                    <div className="flex-1 space-y-8">

                        {/* Caption Hub */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
                            <SectionHeader title="Caption" icon={AlignLeft} />

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-white/30">Caption</span>
                                        <span className="text-[11px] text-white/20 tabular-nums">{localCaption?.length || 0}/2200</span>
                                    </div>
                                    <div className="relative group/mention">
                                        <MentionTextarea
                                            value={localCaption ?? ""}
                                            onChange={(val) => setLocalCaption(val)}
                                            placeholder="Write a caption…"
                                            fetchUsers={fetchUsers}
                                            minHeight={120}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 px-1">
                                        <button className="text-[12px] text-white/30 hover:text-white/60 flex items-center gap-1.5 transition-colors">
                                            <Hash className="w-3.5 h-3.5" /> Hashtag
                                        </button>
                                        <button className="text-[12px] text-white/30 hover:text-white/60 flex items-center gap-1.5 transition-colors">
                                            <AtSign className="w-3.5 h-3.5" /> Mention
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-[11px] text-white/30 px-1">Tags</span>
                                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma separated…" className="w-full h-11 bg-[#0d0d0d] border border-white/[0.07] rounded-xl px-4 text-[14px] outline-none focus:border-white/15 transition-colors placeholder:text-white/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[11px] text-white/30 px-1">Location</span>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add location…" className="w-full h-11 bg-[#0d0d0d] border border-white/[0.07] rounded-xl pl-10 pr-4 text-[14px] outline-none focus:border-white/15 transition-colors placeholder:text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monetization */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
                            <SectionHeader title="Monetization" icon={DollarSign} />
                            <div className="flex flex-wrap gap-2 mb-5">
                                {[
                                    { id: 'free', label: 'Free', icon: Globe },
                                    { id: 'premium', label: 'Premium', icon: Gem },
                                    { id: 'followers', label: 'Fans only', icon: Users },
                                    { id: 'private', label: 'Private', icon: LockIcon }
                                ].map((type) => (
                                    <button key={type.id} onClick={() => setPostType(type.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] transition-all ${postType === type.id ? "border-white/20 bg-white/[0.07] text-white" : "border-white/[0.06] text-white/35 hover:text-white/60"}`}>
                                        <type.icon className="w-3.5 h-3.5" />{type.label}
                                    </button>
                                ))}
                            </div>

                            {postType === 'premium' && (
                                <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                        <div className="flex-1 space-y-2">
                                            <span className="text-[11px] text-white/30 px-1">Unlock price (coins)</span>
                                            <div className="relative">
                                                <Gem className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="5" className="w-full h-11 bg-[#0d0d0d] border border-white/[0.07] rounded-xl pl-10 pr-4 text-[15px] outline-none focus:border-white/15 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                            <p className="text-[11px] text-white/30">You earn</p>
                                            <p className="text-[15px] font-semibold text-white mt-0.5">{(Number(price) * 0.8).toFixed(1)} coins <span className="text-white/30 text-[12px] font-normal">(80%)</span></p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Privacy */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <button onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <ShieldAlert className="w-4 h-4 text-white/30" />
                                    <span className="text-[14px] font-semibold text-white/80">Privacy &amp; settings</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/25 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isAdvancedOpen && (
                                <div className="px-6 pb-5 space-y-0 border-t border-white/[0.05]">
                                    <ControlRow label="Allow comments" icon={MessageCircle}>
                                        <Toggle active={allowComments} onClick={() => setAllowComments(!allowComments)} />
                                    </ControlRow>
                                    <ControlRow label="Allow downloads" icon={Download}>
                                        <Toggle active={allowDownloads} onClick={() => setAllowDownloads(!allowDownloads)} />
                                    </ControlRow>
                                    <ControlRow label="Allow shares" icon={Share2}>
                                        <Toggle active={allowShares} onClick={() => setAllowShares(!allowShares)} />
                                    </ControlRow>
                                    <ControlRow label="Age restricted (18+)" icon={ShieldAlert}>
                                        <Toggle active={is18Plus} onClick={() => setIs18Plus(!is18Plus)} />
                                    </ControlRow>
                                    <ControlRow label="Sensitive content" icon={ShieldAlert}>
                                        <Toggle active={isSensitive} onClick={() => setIsSensitive(!isSensitive)} />
                                    </ControlRow>
                                    <div className="pt-4 mt-2 border-t border-white/[0.05] space-y-2">
                                        <span className="text-[11px] text-white/30">Schedule</span>
                                        <div className="flex gap-3">
                                            <button className="flex-1 h-10 bg-[#0d0d0d] border border-white/[0.07] rounded-xl flex items-center justify-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors">
                                                <Calendar className="w-3.5 h-3.5" />{dayjs().format('MMM DD, YYYY')}
                                            </button>
                                            <button className="flex-1 h-10 bg-[#0d0d0d] border border-white/[0.07] rounded-xl flex items-center justify-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors">
                                                <Clock className="w-3.5 h-3.5" />{dayjs().format('HH:mm')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Distribution */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
                            <SectionHeader title="Distribution" icon={Zap} />
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { state: boostPost, set: setBoostPost, icon: Zap, label: "Boost" },
                                    { state: isPinned, set: setIsPinned, icon: Pin, label: "Pin" },
                                    { state: notifyFollowers, set: setNotifyFollowers, icon: Bell, label: "Notify fans" },
                                ].map(({ state, set, icon: Icon, label }) => (
                                    <button key={label} onClick={() => set(!state)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] transition-all ${state ? "border-white/20 bg-white/[0.07] text-white" : "border-white/[0.06] text-white/35 hover:text-white/60"}`}>
                                        <Icon className="w-3.5 h-3.5" />{label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 border-t border-white/[0.06] bg-[#0d0d0d] z-[100] px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                            Discard
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-white/[0.07] text-sm text-white/40 hover:text-white/60 transition-colors">
                            Save draft
                        </button>
                    </div>
                    <button
                        onClick={handlePublish}
                        disabled={!localCaption || isUploading}
                        className={`px-8 py-2.5 rounded-xl text-[15px] font-semibold transition-all flex items-center gap-2 ${localCaption && !isUploading
                            ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white hover:opacity-90 active:scale-[0.98]"
                            : "bg-white/[0.05] text-white/20 cursor-not-allowed"
                            }`}
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isUploading ? `Uploading ${uploadProgress}%` : "Publish"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showSuccessOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] shadow-[0_0_100px_rgba(255,45,85,0.1)] flex flex-col items-center"
                        >
                            {!publishedData ? (
                                <>
                                    {/* Progress State */}
                                    <div className="relative w-24 h-24 mb-8">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="48"
                                                cy="48"
                                                r="44"
                                                stroke="currentColor"
                                                strokeWidth="3.5"
                                                fill="transparent"
                                                className="text-white/5"
                                            />
                                            <motion.circle
                                                cx="48"
                                                cy="48"
                                                r="44"
                                                stroke="url(#gradient)"
                                                strokeWidth="3.5"
                                                strokeDasharray="276.46"
                                                animate={{ strokeDashoffset: 276.46 - (276.46 * uploadProgress) / 100 }}
                                                fill="transparent"
                                                strokeLinecap="round"
                                                className="transition-all duration-300"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#FF2D55" />
                                                    <stop offset="100%" stopColor="#a855f7" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-xl font-black text-white">{uploadProgress}%</p>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-2">Publishing</h2>
                                    <p className="text-white/40 text-sm font-medium">Syncing with Transmission Hub...</p>
                                </>
                            ) : (
                                <>
                                    {/* Final Success State */}
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                        className="relative mb-8"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF2D55] to-[#a855f7] flex items-center justify-center">
                                            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                                        </div>
                                        {publishedData.preview && (
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="absolute -bottom-2 -right-4 w-16 h-16 rounded-2xl overflow-hidden border-4 border-[#111] shadow-2xl"
                                            >
                                                {publishedData.resourceType === 'video' ? (
                                                    <video src={publishedData.preview} className="w-full h-full object-cover" muted playsInline />
                                                ) : (
                                                    <img src={publishedData.preview} className="w-full h-full object-cover" alt="Preview" />
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <h2 className="text-2xl font-black text-white mb-2">Post Shared!</h2>
                                    <p className="text-white/40 text-sm font-medium text-center mb-8">
                                        Your post is now live on Velo.
                                    </p>

                                    <div className="flex flex-col gap-3 w-full">
                                        <button
                                            onClick={() => {
                                                reset();
                                                router.push('/profile');
                                            }}
                                            className="w-full py-4 bg-gradient-to-r from-[#FF2D55] to-[#a855f7] rounded-2xl text-white font-bold text-sm tracking-wide shadow-[0_8px_32px_rgba(255,45,85,0.3)] active:scale-95 transition-all"
                                        >
                                            VIEW POST
                                        </button>
                                        <button
                                            onClick={() => setShowSuccessOverlay(false)}
                                            className="w-full py-4 text-white/30 font-bold text-sm hover:text-white transition-colors"
                                        >
                                            DISMISS
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function PostEditorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
        }>
            <PostEditorContent />
        </Suspense>
    );
}
