"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    Flame,
    Gem,
    Lock,
    Clock,
    User,
    Hash,
    Play,
    TrendingUp,
    ChevronRight,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from "firebase/firestore";
import { COLLECTIONS, User as UserType } from "@/lib/firebase/collections";
import { useSearchStore } from "@/lib/store";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

// 🗂️ Curated Mock Data for Autocomplete Nudging
const TRENDING_TAGS = ["#Tease", "#AfterDark", "#POV", "#Manuscript", "#POV", "#exclusive", "#luxlife"];
const MOOD_FILTERS = [
    { label: "Romantic", icon: "❤️" },
    { label: "Naughty", icon: "🔥" },
    { label: "Sensual", icon: "✨" },
    { label: "Confession", icon: "🤫" }
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<{
        creators: any[];
        videos: any[];
        tags: string[];
    }>({ creators: [], videos: [], tags: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { recentSearches, addSearch, removeSearch } = useSearchStore();

    // Flatten all items for keyboard navigation
    const flatItems = useMemo(() => {
        const items: any[] = [];

        // 1. Recent Searches (Only if term is empty)
        if (!searchTerm && recentSearches.length > 0) {
            recentSearches.forEach(q => items.push({ type: 'recent', value: q }));
        }

        // 2. Creators
        results.creators.forEach(c => items.push({ type: 'creator', value: c }));

        // 3. Videos
        results.videos.forEach(v => items.push({ type: 'video', value: v }));

        // 4. Tags
        results.tags.forEach(t => items.push({ type: 'tag', value: t }));

        // 5. Default Suggestions if empty
        if (!searchTerm && items.length === 0) {
            TRENDING_TAGS.forEach(t => items.push({ type: 'tag', value: t }));
            MOOD_FILTERS.forEach(m => items.push({ type: 'mood', value: m }));
        }

        return items;
    }, [searchTerm, results, recentSearches]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        } else {
            setSearchTerm("");
            setResults({ creators: [], videos: [], tags: [] });
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % Math.max(flatItems.length, 1));
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(flatItems.length, 1));
            }
            if (e.key === "Enter" && flatItems[selectedIndex]) {
                handleSelectItem(flatItems[selectedIndex]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, flatItems, selectedIndex]);

    // Perform Multimodal Search
    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim()) {
                setResults({ creators: [], videos: [], tags: [] });
                return;
            }

            setIsLoading(true);
            try {
                // Search Creators
                const qCreators = query(
                    collection(db, COLLECTIONS.USERS),
                    orderBy("username"),
                    startAt(searchTerm.toLowerCase()),
                    endAt(searchTerm.toLowerCase() + "\uf8ff"),
                    limit(4)
                );

                // Search Videos (Captions)
                const qVideos = query(
                    collection(db, COLLECTIONS.POSTS),
                    where("status", "==", "ready"),
                    limit(4)
                );

                const [snapCreators, snapVideos] = await Promise.all([
                    getDocs(qCreators),
                    getDocs(qVideos)
                ]);

                const creators = snapCreators.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Client-side fuzzy filter for videos (since Firestore doesn't support full-text easily)
                const videos = snapVideos.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((v: any) => v.caption?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, 3);

                // Filter Tags
                const tags = TRENDING_TAGS.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4);

                setResults({ creators, videos, tags });
                setSelectedIndex(0);
            } catch (error) {
                console.error("Multimodal search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSelectItem = (item: any) => {
        if (item.type === 'creator') {
            addSearch(item.value.username);
            router.push(`/@${item.value.username}`);
        } else if (item.type === 'tag') {
            addSearch(item.value);
            // Search by tag logic here
        } else if (item.type === 'video') {
            router.push(`/for-you?v=${item.value.id}`);
        } else if (item.type === 'recent') {
            setSearchTerm(item.value);
        } else if (item.type === 'mood') {
            setSearchTerm(item.value.label);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#000]/80 backdrop-blur-[20px]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -20 }}
                        className="relative w-full max-w-2xl px-6"
                    >
                        {/* Midnight Surgical Search Container */}
                        <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,1)] overflow-hidden">

                            {/* Pro Input Area */}
                            <div className="relative flex items-center p-6 bg-white/[0.02]">
                                <Search className="w-5 h-5 text-white/20 ml-2" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search creators, manuscripts, or moods..."
                                    className="w-full bg-transparent border-none py-2 px-4 text-lg font-medium text-white placeholder:text-white/10 outline-none"
                                />
                                <div className="flex items-center gap-4">
                                    {isLoading && <Loader2 className="w-4 h-4 text-white/20 animate-spin" />}
                                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border border-white/5 rounded-md">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Esc</span>
                                    </div>
                                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                        <X className="w-5 h-5 text-white/20 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/[0.04]" />

                            {/* Dynamic Autocomplete Content */}
                            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8 scrollbar-hide">

                                {/* 🕒 Recent Searches (Personalized) */}
                                {!searchTerm && recentSearches.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Recent Searches
                                        </label>
                                        <div className="space-y-1">
                                            {recentSearches.map((q, i) => (
                                                <div
                                                    key={q}
                                                    onClick={() => setSearchTerm(q)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${flatItems[i]?.value === q && selectedIndex === i ? 'bg-white/[0.05] translate-x-1' : 'hover:bg-white/[0.02]'}`}
                                                >
                                                    <span className="text-sm font-medium text-white/60">{q}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); removeSearch(q); }}>
                                                        <X className="w-3.5 h-3.5 text-white/10 hover:text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 🔥 Trending / Suggestions (Discovery Nudge) */}
                                {!searchTerm && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-4">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Flame className="w-3 h-3 text-white/20" /> Hot Today
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {TRENDING_TAGS.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setSearchTerm(tag.replace('#', ''))}
                                                        className="px-4 py-2 bg-white/[0.03] hover:bg-white/10 border border-white/5 rounded-full text-[11px] font-bold text-white/40 hover:text-white transition-all"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <TrendingUp className="w-3 h-3 text-white/20" /> Mood Filters
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {MOOD_FILTERS.map(mood => (
                                                    <button
                                                        key={mood.label}
                                                        onClick={() => setSearchTerm(mood.label)}
                                                        className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold text-white/40 transition-all text-left"
                                                    >
                                                        <span>{mood.icon}</span>
                                                        {mood.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 🔍 Results Categories */}
                                {searchTerm && (
                                    <div className="space-y-8 pb-6">
                                        {/* Creators Section */}
                                        {results.creators.length > 0 && (
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3">Top Creators</label>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {results.creators.map((c, i) => {
                                                        const isSelected = flatItems[selectedIndex]?.value?.id === c.id;
                                                        return (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => handleSelectItem({ type: 'creator', value: c })}
                                                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isSelected ? 'bg-white/[0.05] translate-x-1' : 'hover:bg-white/[0.02]'}`}
                                                            >
                                                                <div className="relative">
                                                                    <img src={c.photoURL || `https://ui-avatars.com/api/?name=${c.username}&background=222&color=fff`} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                                                    {c.verified && <CheckCircle2 className="absolute -bottom-1 -right-1 w-4 h-4 text-white fill-black" />}
                                                                </div>
                                                                <div className="flex-1 text-left">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-bold text-white">@{c.username}</span>
                                                                        <span className="px-1.5 py-0.5 bg-white/5 text-[8px] font-black uppercase text-white/30 rounded border border-white/10">Top 10%</span>
                                                                    </div>
                                                                    <span className="text-[11px] text-white/20">Platinum Creator</span>
                                                                </div>
                                                                <Gem className="w-4 h-4 text-white/10" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Manuscripts (Videos) Section */}
                                        {results.videos.length > 0 && (
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3">Matching Manuscripts</label>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {results.videos.map((v, i) => {
                                                        const isSelected = flatItems[selectedIndex]?.value?.id === v.id;
                                                        return (
                                                            <button
                                                                key={v.id}
                                                                onClick={() => handleSelectItem({ type: 'video', value: v })}
                                                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isSelected ? 'bg-white/[0.05] translate-x-1' : 'hover:bg-white/[0.02]'}`}
                                                            >
                                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                                                                    <Play className="w-4 h-4 text-white/40" />
                                                                    {v.visibility === 'locked' && <Lock className="absolute top-1 right-1 w-2.5 h-2.5 text-white/40" />}
                                                                </div>
                                                                <div className="flex-1 text-left">
                                                                    <p className="text-[13px] font-medium text-white/80 line-clamp-1">{v.caption}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[10px] font-bold text-white/20">4.1k views</span>
                                                                        {v.visibility === 'locked' && (
                                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-white/40">
                                                                                <Gem className="w-2.5 h-2.5" /> Locked
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-white/10" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Empty State for searching */}
                                {searchTerm && !isLoading && results.creators.length === 0 && results.videos.length === 0 && (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto border border-white/5">
                                            <Search className="w-6 h-6 text-white/10" />
                                        </div>
                                        <p className="text-sm font-medium text-white/20">No matching manuscripts or creators found for "{searchTerm}"</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
