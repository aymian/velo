"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Upload, Hash, MapPin, Globe, Lock, Users, Gem, Plus, Loader2, Smile,
    Type, Paintbrush, Download, Infinity, Grid2X2, Camera, Zap, RefreshCcw,
    Heart, Send, Sparkles, MoreVertical, Settings, Volume2, VolumeX,
    Layout as LayoutIcon, Disc, Scissors, Image as ImageIcon, Info,
    Timer, Search, Layers, Palette, Wand2, Monitor, UserPlus, MessageCircle,
    Eye, EyeOff, Share2, Save, History, Music, Mic, MousePointer2, BarChart3, ChevronDown,
    Minus
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { StorySticker } from "@/lib/firebase/collections";
import { Navbar } from "@/components/Navbar";
import { MentionTextarea } from "@/components/MentionTextarea";
import { FeatureGate } from "@/components/ui/FeatureGate";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { searchUsers, createStory } from "@/lib/firebase/helpers";
import { useAuthStore, useCreateStore } from "@/lib/store";




export default function CreatePostPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
        }>
            <CreateContent />
        </Suspense>
    );
}

const POST_TYPES = [
    { id: "free", label: "Free", icon: Globe },
    { id: "fans", label: "Fans only", icon: Users },
    { id: "premium", label: "Premium", icon: Gem },
] as const;

function CreateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const { user } = useAuthStore();
    const { caption, videoPreview, videoFile, setVideoFile, setCaption } = useCreateStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [postType, setPostType] = useState<"free" | "fans" | "premium">("free");
    const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
    const [activeMode, setActiveMode] = useState('normal');
    const [showStickers, setShowStickers] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [showTimer, setShowTimer] = useState(false);

    // Story-specific states moved to top level
    const [isPublishing, setIsPublishing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    // Artboard / Editing State
    const [storyText, setStoryText] = useState("");
    const [textColor, setTextColor] = useState("#ffffff");
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('font-sans');
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
    const [hasTextBg, setHasTextBg] = useState(false);
    const [textPos, setTextPos] = useState({ x: 0, y: 0 });
    const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
    const [isCaptureMode, setIsCaptureMode] = useState(true); // true = camera/upload, false = editing
    const [recordingProgress, setRecordingProgress] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('none');

    // Artboard Stickers
    const [stickers, setStickers] = useState<StorySticker[]>([]);
    const [isDraggingText, setIsDraggingText] = useState(false);

    // Sync isCaptureMode with media presence
    useEffect(() => {
        if (videoPreview && type === 'story') {
            setIsCaptureMode(false);
        }
    }, [videoPreview, type]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/")) return;
        useCreateStore.getState().setVideoFile(file, URL.createObjectURL(file));
        if (type === 'story') {
            setIsCaptureMode(false);
        }
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
        if (type) params.set("type", type);
        router.push(`/post-editor?${params.toString()}`);
    };

    if (!type) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-black mb-3">What are we sharing?</h1>
                        <p className="text-white/40 font-medium">Choose your transmission format to get started.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                        {[
                            {
                                id: 'post',
                                title: 'Direct Post',
                                desc: 'Perfect for high-quality videos, photos, and long-form content.',
                                icon: Globe,
                                gradient: 'from-[#FF2D55] to-[#FF4D6D]',
                                shadow: 'shadow-[0_0_50px_rgba(255,45,85,0.15)]'
                            },
                            {
                                id: 'story',
                                title: 'Transmission Story',
                                desc: 'Share raw moments that disappear in 24 hours. Keep it real.',
                                icon: Plus,
                                gradient: 'from-[#a855f7] to-[#8b5cf6]',
                                shadow: 'shadow-[0_0_50px_rgba(168,85,247,0.15)]'
                            }
                        ].map((item, idx) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(`/create?type=${item.id}`)}
                                className={`group relative bg-[#111] border border-white/5 p-8 rounded-[2.5rem] text-left overflow-hidden ${item.shadow} transition-all duration-300 hover:border-white/10`}
                            >
                                <div className={`absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl`} />

                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>

                                <h2 className="text-2xl font-black mb-2 group-hover:text-white transition-colors">{item.title}</h2>
                                <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>

                                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-all">
                                    Create Now
                                    <X className="w-3 h-3 rotate-45 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    const displayName = user?.displayName || user?.username || "creator";
    const avatar = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1e1e1e&color=666&size=80`;

    if (type === 'story') {
        const handlePublishStory = async () => {
            if (!videoFile || !user) return;
            setIsPublishing(true);
            setUploadProgress(0);

            try {
                // Upload to Cloudinary instead of Firebase Storage
                const isPremium = user.plan && user.plan !== 'free';
                const mediaUrl = await uploadToCloudinary(videoFile, (progress) => {
                    setUploadProgress(progress);
                }, isPremium); // Use signed for premium

                const storyId = `story_${Date.now()}_${user.uid}`;
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);

                const storyData = {
                    id: storyId,
                    userId: user.uid,
                    mediaUrl,
                    mediaType: videoFile.type.startsWith('video') ? 'video' : 'image',
                    caption: caption || "",
                    textOverlay: storyText ? {
                        text: storyText,
                        color: textColor,
                        fontSize,
                        fontFamily,
                        textAlign,
                        hasBg: hasTextBg,
                        x: textPos.x,
                        y: textPos.y
                    } : null,
                    stickers: stickers,
                    timer: selectedTimer,
                    visibility: 'public',
                    createdAt: new Date(),
                    expiresAt: expiresAt
                };

                await createStory(storyId, storyData);
                router.push('/');
            } catch (error) {
                console.error("Story publish failed:", error);
                alert("Failed to share story. Please try again.");
            } finally {
                setIsPublishing(false);
            }
        };

        const addSticker = (type: string, content: string) => {
            const newSticker: StorySticker = {
                id: `sticker_${Date.now()}`,
                type,
                content,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
            };
            setStickers(prev => [...prev, newSticker]);
        };

        const removeSticker = (id: string) => {
            setStickers(prev => prev.filter(s => s.id !== id));
        };

        const updateStickerPos = (id: string, x: number, y: number) => {
            setStickers(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
        };

        const STORY_MODES = [
            { id: 'normal', label: 'Normal', icon: Camera },
            { id: 'boomerang', label: 'Boomerang', icon: Infinity },
            { id: 'layout', label: 'Layout', icon: Grid2X2 },
            { id: 'handsfree', label: 'Handsfree', icon: MousePointer2 },
        ];

        const STORY_TOOLS = [
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'draw', icon: Paintbrush, label: 'Draw' },
            { id: 'stickers', icon: Smile, label: 'Stickers' },
            { id: 'music', icon: Music, label: 'Music' },
            { id: 'effects', icon: Sparkles, label: 'Effects' },
            { id: 'timer', icon: Timer, label: 'Timer' },
            { id: 'layers', icon: Layers, label: 'Layers' },
        ];

        const FONTS = [
            { id: 'font-sans', label: 'Classic' },
            { id: 'font-serif', label: 'Modern' },
            { id: 'font-mono', label: 'Typewriter' },
            { id: 'font-black', label: 'Strong' },
        ];

        return (
            <div className="min-h-screen bg-[#0f0f12] text-white flex flex-col font-sans selection:bg-[#ff2d55] selection:text-white overflow-hidden">
                <Navbar />

                <main className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.150 }}
                        className="w-full max-w-[1000px] h-[550px] bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
                    >
                        {/* Top Bar */}
                        <div className="h-14 px-6 border-b border-neutral-800 flex items-center justify-between z-20 bg-[#171717]/80 backdrop-blur-md">
                            <div className="flex items-center gap-6">
                                {isCaptureMode ? (
                                    STORY_MODES.map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setActiveMode(mode.id)}
                                            className={cn(
                                                "relative h-14 px-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-[0.98]",
                                                activeMode === mode.id ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                                            )}
                                        >
                                            <mode.icon className={cn("w-3.5 h-3.5", activeMode === mode.id && "text-[#ff2d55]")} />
                                            <span className="text-[10px] font-semibold uppercase tracking-wider">{mode.label}</span>
                                            {activeMode === mode.id && (
                                                <motion.div
                                                    layoutId="activeModeUnderline"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2d55]"
                                                    transition={{ duration: 0.15 }}
                                                />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setIsCaptureMode(true)} className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">
                                            <X className="w-4 h-4" /> Discard
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {!isCaptureMode && (
                                    <>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"><Music className="w-4 h-4" /></button>
                                    </>
                                )}
                                <button
                                    onClick={() => setFlashMode(prev => prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off')}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-800 transition-all duration-150",
                                        flashMode !== 'off' ? "bg-[#ff2d55]/10 text-[#ff2d55] border-[#ff2d55]/20" : "text-neutral-500"
                                    )}
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => router.push('/create')}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-800 text-neutral-500 hover:bg-neutral-800 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Center Preview Canvas */}
                            <div className="flex-1 flex items-center justify-center p-6 bg-neutral-950/20 relative">
                                <div className="relative h-full aspect-[9/16] bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl overflow-hidden group">
                                    <UploadZone
                                        videoPreview={videoPreview}
                                        videoFile={videoFile}
                                        isDragging={isDragging}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        onClear={() => { setVideoFile(null, null); setIsCaptureMode(true); }}
                                        isStoryMode={true}
                                    />

                                    {/* Live Artboard Overlays */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                                        {storyText && (
                                            <motion.div
                                                drag
                                                onDragEnd={(e, info) => setTextPos({ x: info.point.x, y: info.point.y })}
                                                dragMomentum={false}
                                                onDragStart={() => setIsDraggingText(true)}
                                                className="pointer-events-auto cursor-move select-none"
                                            >
                                                <div
                                                    style={{
                                                        color: textColor,
                                                        fontSize: `${fontSize}px`,
                                                        textAlign: textAlign,
                                                        backgroundColor: hasTextBg ? textColor === '#ffffff' ? '#000000' : '#ffffff' : 'transparent',
                                                        padding: hasTextBg ? '4px 12px' : '0',
                                                        borderRadius: '8px'
                                                    }}
                                                    className={cn("font-bold drop-shadow-md break-words max-w-full", fontFamily)}
                                                >
                                                    {storyText}
                                                </div>
                                            </motion.div>
                                        )}

                                        {stickers.map((sticker) => (
                                            <motion.div
                                                key={sticker.id}
                                                drag
                                                onDragEnd={(e, info) => updateStickerPos(sticker.id, info.point.x, info.point.y)}
                                                dragMomentum={false}
                                                className="absolute pointer-events-auto cursor-move select-none group/sticker"
                                            >
                                                <div className="relative">
                                                    <span className="text-4xl filter drop-shadow-lg">{sticker.content}</span>
                                                    <button
                                                        onClick={() => removeSticker(sticker.id)}
                                                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/sticker:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-2 h-2" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {selectedTimer && (
                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                                            <Timer className="w-3 h-3 text-[#ff2d55]" />
                                            <span className="text-[10px] font-bold">{selectedTimer}s</span>
                                        </div>
                                    )}

                                    {/* Camera UI Controls (Overlay) */}
                                    {isCaptureMode && !videoPreview && (
                                        <>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8">
                                                <button className="w-10 h-10 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                                                    <ImageIcon className="w-5 h-5" />
                                                </button>

                                                <div className="relative">
                                                    <svg className="absolute -inset-2 w-[72px] h-[72px] -rotate-90 pointer-events-none">
                                                        <circle
                                                            cx="36"
                                                            cy="36"
                                                            r="32"
                                                            fill="none"
                                                            stroke={isRecording ? "#ff2d55" : "rgba(255,255,255,0.2)"}
                                                            strokeWidth="4"
                                                            strokeDasharray={2 * Math.PI * 32}
                                                            strokeDashoffset={2 * Math.PI * 32 * (1 - recordingProgress / 100)}
                                                            className="transition-all duration-100"
                                                        />
                                                    </svg>
                                                    <button
                                                        onMouseDown={() => { setIsRecording(true); if (activeMode === 'normal') { /* start record */ } }}
                                                        onMouseUp={() => { setIsRecording(false); setIsCaptureMode(false); }}
                                                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-4 border-transparent hover:border-[#ff2d55] transition-all duration-150 active:scale-90 relative z-10"
                                                    >
                                                        <div className={cn(
                                                            "transition-all duration-200",
                                                            isRecording ? "w-6 h-6 bg-[#ff2d55] rounded-sm" : "w-11 h-11 rounded-full border-2 border-neutral-900"
                                                        )} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => {/* switch camera */ }}
                                                    className="w-10 h-10 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                                >
                                                    <RefreshCcw className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-4">
                                                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                <div className="w-1 h-20 bg-white/10 rounded-full relative overflow-hidden">
                                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                                                    <Minus className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Tool Dock */}
                            <div className="w-16 border-l border-neutral-800 flex flex-col items-center py-4 gap-3 bg-[#171717]">
                                {STORY_TOOLS.map((tool) => (
                                    <Popover.Root key={tool.id} onOpenChange={(open) => open ? setActiveTool(tool.id) : setActiveTool(null)}>
                                        <Popover.Trigger asChild>
                                            <button
                                                className={cn(
                                                    "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.98] group relative",
                                                    activeTool === tool.id ? "bg-[#ff2d55] text-white" : "text-neutral-500 hover:text-neutral-300 hover:bg-[#a855f7]/10"
                                                )}
                                            >
                                                <tool.icon className="w-4 h-4" />
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content
                                                className="w-56 bg-[#171717] border border-neutral-800 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 z-[100] outline-none"
                                                side="left"
                                                align="center"
                                                sideOffset={12}
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#ff2d55]">{tool.label}</h3>
                                                        <Popover.Close className="text-neutral-500 hover:text-white transition-colors">
                                                            <X className="w-3 h-3" />
                                                        </Popover.Close>
                                                    </div>

                                                    {tool.id === 'text' ? (
                                                        <div className="space-y-4">
                                                            <textarea
                                                                className="w-full h-20 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs focus:outline-none focus:border-[#ff2d55]/50 transition-all resize-none"
                                                                placeholder="Type story text..."
                                                                value={storyText}
                                                                onChange={(e) => setStoryText(e.target.value)}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                            />

                                                            <div className="space-y-2">
                                                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">Fonts</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {FONTS.map(f => (
                                                                        <button
                                                                            key={f.id}
                                                                            onClick={() => setFontFamily(f.id)}
                                                                            className={cn(
                                                                                "px-2 py-1 rounded border text-[9px] transition-all",
                                                                                fontFamily === f.id ? "bg-white text-black border-white" : "bg-neutral-900 border-neutral-800 text-neutral-400"
                                                                            )}
                                                                        >
                                                                            {f.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex gap-2">
                                                                    {['#ffffff', '#ff2d55', '#a855f7', '#000000'].map(color => (
                                                                        <button
                                                                            key={color}
                                                                            onClick={() => setTextColor(color)}
                                                                            className={cn(
                                                                                "w-5 h-5 rounded-full border transition-all",
                                                                                textColor === color ? "border-white scale-110" : "border-white/10 hover:scale-105"
                                                                            )}
                                                                            style={{ background: color }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <button onClick={() => setHasTextBg(!hasTextBg)} className={cn("px-2 py-1 rounded text-[9px] font-bold border", hasTextBg ? "bg-white text-black border-white" : "border-neutral-800 text-neutral-500")}>
                                                                    BG
                                                                </button>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between text-[9px] text-neutral-500 uppercase">
                                                                    <span>Size</span>
                                                                    <span className="text-white">{fontSize}px</span>
                                                                </div>
                                                                <input
                                                                    type="range" min="12" max="100" value={fontSize}
                                                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                                    className="w-full accent-[#ff2d55]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : tool.id === 'timer' ? (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[3, 10, 15].map((sec) => (
                                                                <button
                                                                    key={sec}
                                                                    onClick={() => setSelectedTimer(prev => prev === sec ? null : sec)}
                                                                    className={cn(
                                                                        "py-2 rounded-lg border text-[10px] font-semibold transition-all duration-150",
                                                                        selectedTimer === sec
                                                                            ? "bg-[#ff2d55]/10 border-[#ff2d55] text-[#ff2d55]"
                                                                            : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300"
                                                                    )}
                                                                >
                                                                    {sec}s
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : tool.id === 'stickers' ? (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[
                                                                { t: 'emoji', c: '🔥' }, { t: 'emoji', c: '❤️' }, { t: 'emoji', c: '😍' },
                                                                { t: 'emoji', c: '😂' }, { t: 'emoji', c: '🙌' }, { t: 'emoji', c: '✨' },
                                                                { t: 'emoji', c: '💯' }, { t: 'emoji', c: '📍' }, { t: 'emoji', c: '🕒' }
                                                            ].map(s => (
                                                                <button
                                                                    key={s.c}
                                                                    onClick={() => addSticker(s.t, s.c)}
                                                                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#a855f7]/50 transition-all active:scale-95"
                                                                >
                                                                    <span className="text-xl">{s.c}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-24 rounded-lg bg-neutral-900/50 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-neutral-600">
                                                            <Wand2 className="w-4 h-4 opacity-20" />
                                                            <span className="text-[9px] font-medium uppercase tracking-tighter">Adjust {tool.label}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Popover.Arrow className="fill-[#171717]" />
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Share Bar */}
                        <div className="h-16 px-6 border-t border-neutral-800 flex items-center justify-between bg-[#171717]/80 backdrop-blur-md">
                            <div className="flex-1 max-w-sm mr-8 relative">
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder="Add a transmission caption..."
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#a855f7]/50 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                {isCaptureMode ? (
                                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white transition-all text-xs font-semibold">
                                        <Lock className="w-3 h-3" /> Privacy
                                    </button>
                                ) : (
                                    <>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider">
                                            Close Friends
                                        </button>
                                        <button
                                            onClick={handlePublishStory}
                                            disabled={!videoPreview || isPublishing}
                                            className={cn(
                                                "px-6 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-lg",
                                                (!videoPreview || isPublishing)
                                                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                                                    : "bg-[#ff2d55] text-white hover:bg-[#ff2d55]/90 shadow-[#ff2d55]/20"
                                            )}
                                        >
                                            {isPublishing ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>{uploadProgress}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Share Story</span>
                                                    <Send className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Finishing Touches and Overlays */}
                        <AnimatePresence>
                            {isPublishing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <div className="w-full max-w-xs space-y-4">
                                        <div className="relative w-16 h-16 mx-auto">
                                            <div className="absolute inset-0 rounded-full border-2 border-neutral-800" />
                                            <svg className="w-16 h-16 -rotate-90">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="30"
                                                    fill="none"
                                                    stroke="#ff2d55"
                                                    strokeWidth="3"
                                                    strokeDasharray={2 * Math.PI * 30}
                                                    strokeDashoffset={2 * Math.PI * 30 * (1 - uploadProgress / 100)}
                                                    className="transition-all duration-300 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs font-black">{uploadProgress}%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold">Broadcasting</h3>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Secure Transmission in progress</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
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


    // --- Post Mode (Step 1) ---
    if (type === 'post') {
        const usernamePrefix = user?.username || user?.email?.split("@")?.[0] || "you";

        const postTypes = [
            { id: "free", label: "Free", icon: Globe, feature: null },
            { id: "fans", label: "Fans only", icon: Users, feature: "canUnlockExclusive" },
            { id: "premium", label: "Premium", icon: Gem, feature: "canMonetize" },
        ] as const;

        return (
            <div className="min-h-screen bg-[#070708] text-white flex flex-col font-sans">
                <Navbar />

                {/* Studio header */}
                <div className="border-b border-white/[0.06] bg-[#070708] sticky top-[64px] z-10">
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
                            className={cn(
                                "px-5 py-1.5 rounded-lg text-sm font-semibold transition-all",
                                caption || videoPreview
                                    ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white hover:opacity-90 active:scale-95"
                                    : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                            )}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <main className="max-w-6xl mx-auto px-6 py-10">
                    {/* Emotional headline */}
                    <div className="mb-10">
                        <h1 className="text-[22px] font-semibold text-white">Create something worth following.</h1>
                        <p className="text-sm text-white/30 mt-1">Tips and subscriptions can be enabled after publishing.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* ── LEFT: Creation tools (60%) ── */}
                        <div className="flex-1 space-y-6 w-full">

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
                                    {postTypes.map(({ id, label, icon: Icon, feature }) => {
                                        const Button = (
                                            <button
                                                onClick={() => setPostType(id as any)}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] transition-all whitespace-nowrap",
                                                    postType === id
                                                        ? "border-white/20 bg-white/[0.07] text-white"
                                                        : "border-white/[0.06] bg-transparent text-white/35 hover:text-white/60"
                                                )}
                                            >
                                                <Icon className="w-3.5 h-3.5" />
                                                {label}
                                            </button>
                                        );

                                        if (feature) {
                                            return (
                                                <FeatureGate key={id} feature={feature as any}>
                                                    {Button}
                                                </FeatureGate>
                                            );
                                        }

                                        return <React.Fragment key={id}>{Button}</React.Fragment>;
                                    })}
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
                                className={cn(
                                    "w-full py-3 rounded-xl text-[15px] font-semibold transition-all",
                                    caption || videoPreview
                                        ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white hover:opacity-90 active:scale-0.99"
                                        : "bg-white/[0.05] text-white/20 cursor-not-allowed"
                                )}
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
                            <p className="text-[11px] text-white/20 text-center mt-3 lowercase font-bold tracking-widest">9:16 · Up to 60s · HD recommended</p>
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

    // Default view (Selection screen)
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
                <div className="w-full max-w-4xl bg-[#111] border border-white/5 rounded-[2.5rem] p-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-8 h-8 text-white/20" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Transmission Post</h1>
                    <p className="text-white/40 mb-8 max-w-md mx-auto">Upload media and add context to create a permanent post on your profile.</p>

                    <div className="flex justify-center mb-8">
                        <div className="w-64">
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
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!videoPreview}
                        className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        CONTINUE TO EDITOR
                    </button>
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
    isStoryMode?: boolean;
}

function UploadZone({ videoPreview, videoFile, isDragging, onDragOver, onDragLeave, onDrop, onClick, onClear, caption, displayName, isStoryMode }: UploadZoneProps) {
    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={!videoPreview ? onClick : undefined}
            className={cn(
                "relative aspect-[9/16] rounded-2xl overflow-hidden border transition-all",
                videoPreview
                    ? "border-white/[0.08] cursor-default"
                    : isDragging
                        ? "border-white/30 bg-white/[0.04] cursor-pointer"
                        : "border-dashed border-white/[0.12] bg-[#151515] hover:border-white/25 hover:bg-white/[0.03] cursor-pointer"
            )}
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
