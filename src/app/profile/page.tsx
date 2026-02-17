"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Share2,
    Pencil,
    Plus,
    Video,
    Gem,
    Star,
    PlaySquare,
    Gift,
    Image as ImageIcon,
    Layout,
    Columns,
    X,
    ChevronDown,
    CheckCircle,
    ChevronRight,
    Upload
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { VideoPost } from "@/components/VideoPost";
import { useCreatorPosts } from "@/lib/hooks/usePosts";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab ] = useState("all");
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [displayName, setDisplayName] = useState(user?.displayName || "Funny Badger");
    const [username, setUsername] = useState("ishimweyvesian");
    const [bio, setBio] = useState("Digital artist & Designer.");
    const [tempPhotoURL, setTempPhotoURL] = useState<string | null>(null);

    // 🚀 High-Performance Fetching with TanStack Query
    const { data: posts = [], isLoading: postsLoading } = useCreatorPosts(user?.uid);

    const tabs = [
        { id: "all", label: "All", icon: Columns },
        { id: "fans", label: "For Fans", icon: Star },
        { id: "moments", label: "Moments", icon: PlaySquare },
        { id: "cards", label: "Tango Cards", icon: Layout },
        { id: "collections", label: "Collections", icon: Gift },
    ];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTempPhotoURL(url);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#ff3b5c]">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-24 px-6">

                {/* --- Profile Header (STAY SHARP) --- */}
                <div className="flex items-start gap-8 mb-12">
                    <div className="relative">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/[0.03] border border-white/10">
                            <img
                                src={user?.photoURL || "https://ui-avatars.com/api/?name=Funny+Badger&background=333&color=fff"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 w-9 h-9 bg-black border border-white/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 pt-2">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <h1 className="text-[20px] font-semibold leading-tight mb-0.5">{user?.displayName || "Funny Badger"}</h1>
                                <p className="text-white/40 text-[13px]">Rwanda, 19 y.o.</p>
                            </div>
                            <div className="flex items-center gap-5 pt-1">
                                <Share2 className="w-[20px] h-[20px] text-white/40 cursor-pointer hover:text-white transition-colors" />
                                <Pencil 
                                    className="w-[20px] h-[20px] text-white/40 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => setIsEditCardOpen(true)} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-10 mt-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">7</span>
                                <div className="flex items-center gap-1.5 text-white/30">
                                    <Gem className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">Earned</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">2</span>
                                <span className="text-[11px] text-white/30">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-semibold">9</span>
                                <span className="text-[11px] text-white/30">Following</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/create')}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#ff3b5c] to-[#f127a3] rounded-full font-bold text-[12px] transition-transform active:scale-95"
                            >
                                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                                Create Post
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded-full font-bold text-[12px] hover:bg-white/5 transition-colors">
                                <Video className="w-4 h-4" />
                                Start stream
                            </button>
                            <div className="relative w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                                <Gem className="w-[18px] h-[18px] text-white/40" />
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff3b5c] border-2 border-black rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Interactive Tabs (Instagram/Threads Style) --- */}
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Tabs.List className="flex items-center justify-between border-b border-white/5 px-2 mb-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <Tabs.Trigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={`relative flex flex-col items-center gap-2 px-6 py-4 transition-all outline-none ${
                                        isActive ? "text-white" : "text-white/30 hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                                    <span className="text-[11px] font-medium">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                        />
                                    )}
                                </Tabs.Trigger>
                            );
                        })}
                    </Tabs.List>

                    <Tabs.Content value={activeTab} className="outline-none">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <VideoPost
                                            id={post.id}
                                            publicId={post.cloudinaryPublicId}
                                            videoUrl={post.videoUrl}
                                            status={post.status || 'ready'}
                                            isLocked={post.visibility === 'locked'}
                                            price={post.price || 0}
                                            caption={post.caption}
                                            blurEnabled={post.blurEnabled}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {!postsLoading && posts.length === 0 && (
                                <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
                                    <ImageIcon className="w-16 h-16 mb-4" strokeWidth={1} />
                                    <p className="text-[13px] font-medium tracking-wide">No Posts</p>
                                </div>
                            )}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </main>

            {/* --- FLOATING INSTAGRAM STYLE EDIT PROFILE --- */}
            <Dialog.Root open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
                <Dialog.Portal>
                    <Dialog.Content 
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed top-24 right-6 w-[380px] h-[660px] bg-black border border-white/10 rounded-[2rem] shadow-[0_32px_128px_rgba(0,0,0,1)] z-[101] outline-none overflow-hidden flex flex-col focus:ring-0"
                        >
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />

                            {/* Header */}
                            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-black">
                                <button onClick={() => setIsEditCardOpen(false)} className="text-[14px] font-medium text-white/40 hover:text-white transition-colors">Cancel</button>
                                <Dialog.Title className="text-[15px] font-bold">Edit profile</Dialog.Title>
                                <button 
                                    onClick={() => setIsEditCardOpen(false)}
                                    className="text-[14px] font-bold text-[#FF3B5C]"
                                >
                                    Done
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
                                
                                {/* Profile Image Trigger */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]">
                                            <img src={tempPhotoURL || user?.photoURL || "https://ui-avatars.com/api/?name=User&background=333&color=fff"} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <button 
                                        className="text-[13px] font-bold text-[#0095F6] hover:opacity-80"
                                        onClick={triggerFileInput}
                                    >
                                        Change profile photo
                                    </button>
                                </div>

                                {/* Form Rows (Threads Style) */}
                                <div className="space-y-8">
                                    <div className="space-y-1.5">
                                        <Label.Root className="text-[13px] font-medium text-white/30">Name</Label.Root>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label.Root className="text-[13px] font-medium text-white/30">Username</Label.Root>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <Label.Root className="text-[13px] font-medium text-white/30">Bio</Label.Root>
                                            <span className="text-[10px] font-medium text-white/20 tracking-widest">{bio.length}/200</span>
                                        </div>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={2}
                                            maxLength={200}
                                            className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Meta Center Style Account Info */}
                                <div className="pt-2 space-y-6">
                                    <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Account info</h3>
                                    
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">Email</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-medium text-white/60">{user?.email || "bright@gmail.com"}</span>
                                                    <CheckCircle className="w-3.5 h-3.5 text-[#FF3B5C]" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                                        </div>

                                        <div className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">Phone</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-medium text-white/60">+250 788 000 000</span>
                                                    <CheckCircle className="w-3.5 h-3.5 text-[#FF3B5C]" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-[13px] font-medium text-white/30">Joined</span>
                                            <span className="text-[13px] font-bold text-white/60">February 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* HIGH-FIDELITY GRADIENT BUTTON (EXACT MATCH TO SCREENSHOT) */}
                            <div className="p-7 bg-black border-t border-white/5">
                                <button className="w-full h-12 bg-gradient-to-r from-[#ff3b5c] via-[#f127a3] to-[#f127a3] text-white rounded-full font-bold text-[15px] shadow-[0_8px_32px_rgba(255,59,92,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center tracking-tight">
                                    Save changes
                                </button>
                            </div>
                        </motion.div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
}
