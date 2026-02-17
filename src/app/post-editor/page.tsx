"use client";

import React, { useState, useEffect, useRef } from "react";
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
import dayjs from "dayjs";

// --- Components ---

const SectionHeader = ({ title, icon: Icon, description }: any) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
            <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
            <h3 className="text-[15px] font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{description}</p>}
        </div>
    </div>
);

const ControlRow = ({ label, icon: Icon, children, description }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 -mx-2 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4 text-white/30" />}
            <div>
                <p className="text-[14px] font-semibold text-white/80">{label}</p>
                {description && <p className="text-[11px] text-white/20">{description}</p>}
            </div>
        </div>
        <div>{children}</div>
    </div>
);

const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-10 h-5 rounded-full transition-all relative ${active ? "bg-[#FF2D55]" : "bg-[#27272A]"}`}
    >
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? "left-6" : "left-1"}`} />
    </button>
);

export default function PostEditorPage() {
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
        reset
    } = useCreateStore();

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

    // --- State ---
    const [postType, setPostType] = useState('free'); // free, premium, followers, private
    const [price, setPrice] = useState('10');
    const [visibility, setVisibility] = useState('public');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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

    const handlePublish = async () => {
        if (!localCaption || isUploading || !user) return;
        const setUploading = useCreateStore.getState().setUploading;
        const setUploadProgress = useCreateStore.getState().setUploadProgress;

        setUploading(true);
        try {
            let cloudinaryData: any = {};

            if (videoFile) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                if (!cloudName) throw new Error("Cloudinary not configured");

                const formData = new FormData();
                formData.append('file', videoFile);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

                const axios = (await import('axios')).default;
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

            addNotification({ type: "success", message: "Transmission Published" });
            reset();
            router.push('/profile');
        } catch (e: any) {
            console.error(e);
            addNotification({ type: "error", message: e.message || "Failed to publish" });
            setUploading(false);
        }
    };

    if (!localCaption && !videoFile && !searchParams.get('source')) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                        <EyeOff className="w-8 h-8 text-white/10" />
                    </div>
                    <div>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">No Content Data</p>
                        <h2 className="text-xl font-bold text-white mb-6">Start from the beginning.</h2>
                        <button onClick={() => router.push('/create')} className="px-8 py-3 bg-[#FF2D55] text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all">
                            Create Content
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FF2D55]/30 flex flex-col pt-20 font-sans">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 pb-40">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- 1️⃣ MEDIA PREVIEW SECTION (LEFT) --- */}
                    <div className="w-full lg:w-[420px] shrink-0 space-y-6">
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase text-white/30 tracking-widest">Visual Preview</span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><Crop className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><RotateCw className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="relative aspect-[9/16] bg-black flex items-center justify-center group overflow-hidden">
                                {localSource ? (
                                    <>
                                        {videoFile?.type.startsWith('image/') ? (
                                            <img src={localSource} className={`w-full h-full object-cover transition-all duration-500 ${shouldBlurPreview ? "blur-2xl opacity-50" : "opacity-90"}`} alt="Preview" />
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
                                    <button className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/20">
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Replace
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Droplets className="w-4 h-4 text-white/30" />
                                        <span className="text-[14px] font-semibold text-white/80">Blur Preview</span>
                                    </div>
                                    <Toggle active={shouldBlurPreview} onClick={() => setShouldBlurPreview(!shouldBlurPreview)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ImageIcon className="w-4 h-4 text-white/30" />
                                        <span className="text-[14px] font-semibold text-white/80">Add Watermark</span>
                                    </div>
                                    <Toggle active={addWatermark} onClick={() => setAddWatermark(!addWatermark)} />
                                </div>
                            </div>
                        </div>

                        {/* Forecast */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-xl">
                            <SectionHeader title="Transmission Forecast" icon={BarChart3} description="Simulated Engagement" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5">Est. Reach</p>
                                    <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                        120–350
                                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                                <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5">Eng. Score</p>
                                    <div className="text-xl font-bold text-white tracking-tight">Medium</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-2 pt-2">
                                <span className="text-[11px] font-black text-white/20 uppercase tracking-widest">Trending Probability</span>
                                <span className="text-[11px] font-black text-[#FF2D55] uppercase tracking-widest">High</span>
                            </div>
                        </div>
                    </div>

                    {/* --- EDITOR PANEL (RIGHT) --- */}
                    <div className="flex-1 space-y-8">

                        {/* Caption Hub */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 shadow-xl">
                            <SectionHeader title="Content & Context" icon={AlignLeft} description="Primary Narrative" />

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] px-1">Caption</Label.Root>
                                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{localCaption?.length || 0}/2200</span>
                                    </div>
                                    <textarea
                                        value={localCaption}
                                        onChange={(e) => setLocalCaption(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-3xl p-6 text-[16px] text-white/90 outline-none focus:border-white/20 transition-all resize-none min-h-[160px] leading-relaxed placeholder:text-white/10"
                                        placeholder="What's the narrative?"
                                    />
                                    <div className="flex items-center gap-6 px-3 pt-2 font-black">
                                        <button className="text-[11px] text-[#FF2D55] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            <Hash className="w-4 h-4" strokeWidth={3} /> Hashtag
                                        </button>
                                        <button className="text-[11px] text-[#FF2D55] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            <AtSign className="w-4 h-4" strokeWidth={3} /> Mention
                                        </button>
                                        <button className="text-[11px] text-white/20 uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity ml-auto">
                                            <Smile className="w-4 h-4" /> Emoji
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] px-1">Tags (Max 10)</Label.Root>
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="Split by commas..."
                                            className="w-full h-14 bg-black border border-white/10 rounded-2xl px-6 text-[15px] outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] px-1">Location</Label.Root>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Add location..."
                                                className="w-full h-14 bg-black border border-white/10 rounded-2xl pl-14 pr-6 text-[15px] outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] px-1">External Source Link</Label.Root>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            value={externalLink}
                                            onChange={(e) => setExternalLink(e.target.value)}
                                            placeholder="https://your-source.com"
                                            className="w-full h-14 bg-black border border-white/10 rounded-2xl pl-14 pr-6 text-[15px] outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monetization */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 shadow-xl">
                            <SectionHeader title="Monetization Engine" icon={DollarSign} description="Revenue Architecture" />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                                {[
                                    { id: 'free', label: 'Free', icon: Globe },
                                    { id: 'premium', label: 'Premium', icon: Gem },
                                    { id: 'followers', label: 'Fans', icon: Users },
                                    { id: 'private', label: 'Private', icon: LockIcon }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setPostType(type.id)}
                                        className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${postType === type.id
                                                ? "bg-white/5 border-white/20 text-white"
                                                : "bg-black border-white/5 text-white/20 hover:border-white/10"
                                            }`}
                                    >
                                        <type.icon className={`w-6 h-6 ${postType === type.id ? "text-white" : "opacity-30"}`} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">{type.label}</span>
                                    </button>
                                ))}
                            </div>

                            {postType === 'premium' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-8 pt-8 border-t border-white/5"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 md:items-end">
                                        <div className="flex-1 space-y-3">
                                            <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] px-1">Unlock Price (Coins)</Label.Root>
                                            <div className="relative">
                                                <Gem className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    min="5"
                                                    className="w-full h-16 bg-black border-2 border-white/10 rounded-3xl pl-16 pr-6 text-2xl font-black outline-none focus:border-white/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 flex-1 h-16 flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-white/80" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1.5">Earnings</p>
                                                <p className="text-[16px] font-black text-white leading-none">{(Number(price) * 0.8).toFixed(1)} Coins (80%)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <Clock className="w-5 h-5 text-white/40" />
                                        <p className="text-[12px] font-medium text-white/60">
                                            <span className="font-bold text-white uppercase tracking-widest text-[10px] mr-2">Timed Unlock:</span> This post will automatically become free after 24 hours.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Privacy & Visibility */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
                            <button
                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                className="w-full px-10 py-8 flex items-center justify-between hover:bg-white/[0.02] transition-all"
                            >
                                <SectionHeader title="Privacy & Advanced Broadcast" icon={ShieldAlert} description="Surgical Permissions" />
                                <ChevronDown className={`w-6 h-6 text-white/20 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isAdvancedOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-10 pb-10 space-y-4"
                                    >
                                        <ControlRow label="Allow Comments" icon={MessageCircle} description="Enable public dialogue">
                                            <Toggle active={allowComments} onClick={() => setAllowComments(!allowComments)} />
                                        </ControlRow>
                                        <ControlRow label="Allow Downloads" icon={Download} description="Save to local device">
                                            <Toggle active={allowDownloads} onClick={() => setAllowDownloads(!allowDownloads)} />
                                        </ControlRow>
                                        <ControlRow label="Allow Shares" icon={Share2} description="External cross-posting">
                                            <Toggle active={allowShares} onClick={() => setAllowShares(!allowShares)} />
                                        </ControlRow>

                                        <div className="pt-8 mt-6 border-t border-white/5">
                                            <Label.Root className="text-[11px] font-black uppercase text-white/20 tracking-[0.2em] pl-1 mb-6 block text-center">Schedule Transmission</Label.Root>
                                            <div className="flex items-center gap-4">
                                                <button className="flex-1 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-sm font-bold text-white/60 hover:text-white transition-all">
                                                    <Calendar className="w-5 h-5 opacity-40" />
                                                    {dayjs().format('MMM DD, YYYY')}
                                                </button>
                                                <button className="flex-1 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-sm font-bold text-white/60 hover:text-white transition-all">
                                                    <Clock className="w-5 h-5 opacity-40" />
                                                    {dayjs().format('HH:mm')}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Content Sensitivity */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 shadow-xl">
                            <SectionHeader title="Content Sensitivity" icon={ShieldAlert} description="Platform Compliance" />
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[11px] text-white/60">
                                            18+
                                        </div>
                                        <p className="text-[15px] font-bold text-white/80">Age Restricted</p>
                                    </div>
                                    <Toggle active={is18Plus} onClick={() => setIs18Plus(!is18Plus)} />
                                </div>
                                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <ShieldAlert className="w-6 h-6 text-white/30" />
                                        <p className="text-[15px] font-bold text-white/80">Sensitive Content Label</p>
                                    </div>
                                    <Toggle active={isSensitive} onClick={() => setIsSensitive(!isSensitive)} />
                                </div>
                            </div>
                        </div>

                        {/* Engagement Engine */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 shadow-xl">
                            <SectionHeader title="Engagement Engine" icon={Zap} description="Growth Optimization" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                <button
                                    onClick={() => setBoostPost(!boostPost)}
                                    className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all ${boostPost ? "bg-white/10 border-white/30" : "bg-black border-white/5 opacity-50"
                                        }`}
                                >
                                    <Zap className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Boost Post</span>
                                </button>
                                <button
                                    onClick={() => setIsPinned(!isPinned)}
                                    className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all ${isPinned ? "bg-white/10 border-white/30" : "bg-black border-white/5 opacity-50"
                                        }`}
                                >
                                    <Pin className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Pin Profile</span>
                                </button>
                                <button
                                    onClick={() => setNotifyFollowers(!notifyFollowers)}
                                    className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all ${notifyFollowers ? "bg-white/10 border-white/30" : "bg-black border-white/5 opacity-50"
                                        }`}
                                >
                                    <Bell className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Notify Fans</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 h-28 bg-black/95 backdrop-blur-2xl border-t border-white/10 z-[100] px-8">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button className="hidden md:flex items-center gap-3 text-white/30 hover:text-white transition-colors group">
                            <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-all-faster">
                                <X className="w-4 h-4" />
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Discard</span>
                        </button>
                        <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group px-8 py-4 bg-white/5 rounded-full hover:bg-white/10">
                            <Layers className="w-5 h-5 opacity-40" />
                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Save Draft</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end mr-6">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mb-1.5">Network Status</p>
                            <p className="text-[14px] font-black text-green-500 leading-none flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                READY TO BROADCAST
                            </p>
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={!localCaption || isUploading}
                            className={`px-14 h-16 rounded-full font-black text-[15px] uppercase tracking-[0.2em] transition-all shadow-[0_12px_60px_rgba(255,45,85,0.4)] flex items-center gap-4 ${localCaption && !isUploading
                                    ? "bg-[#FF2D55] text-white hover:scale-[1.05] active:scale-[0.95]"
                                    : "bg-white/5 text-white/20 cursor-not-allowed shadow-none"
                                }`}
                        >
                            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <Zap className="w-5 h-5 fill-white" />
                                    Publish Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isUploading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-12 text-center">
                        <div className="relative w-40 h-40 mb-16 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin" />
                            <div className="w-20 h-20 bg-white/20 rounded-full blur-[60px] animate-pulse opacity-50" />
                            <Zap className="w-12 h-12 text-white relative z-10" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Broadcasting Content</h2>
                        <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.5em]">{uploadProgress}% Synchronized</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
