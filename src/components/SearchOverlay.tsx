"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CheckCircle2,
    ArrowUpRight,
    Play,
    Loader2,
    Hash,
    User,
    Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTED_HASHTAGS = ["#Exclusive", "#AfterDark", "#Manuscript", "#POV", "#Viral"];
const TRENDING_CREATORS = [
    { username: "elena_v", verified: true },
    { username: "marcus_velo", verified: false },
    { username: "alpha_manuscript", verified: true }
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ creators: any[]; posts: any[] }>({ creators: [], posts: [] });
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => inputRef.current?.focus(), 150);
            return () => clearTimeout(t);
        } else {
            setSearchTerm("");
            setResults({ creators: [], posts: [] });
        }
    }, [isOpen]);

    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim()) {
                setResults({ creators: [], posts: [] });
                return;
            }
            setIsLoading(true);
            try {
                const term = searchTerm.toLowerCase();

                const qCreators = query(
                    collection(db, COLLECTIONS.USERS),
                    orderBy("username"),
                    startAt(term),
                    endAt(term + "\uf8ff"),
                    limit(5)
                );

                const qPosts = query(
                    collection(db, COLLECTIONS.POSTS),
                    where("status", "==", "ready"),
                    limit(10)
                );

                const [uSnap, pSnap] = await Promise.all([getDocs(qCreators), getDocs(qPosts)]);

                const creators = uSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                const posts = pSnap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter((p: any) => p.caption?.toLowerCase().includes(term))
                    .slice(0, 4);

                setResults({ creators, posts });
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(performSearch, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectCreator = (username: string) => {
        router.push(`/@${username}`);
        onClose();
    };

    const handleSelectPost = (id: string) => {
        router.push(`/for-you?v=${id}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                    {/* Minimal Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* MINIMAL MODAL - ROUNDED EDGES */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* INPUT AREA */}
                        <div className="relative flex items-center px-6 py-4 border-b border-white/5">
                            <Input
                                ref={inputRef}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search velocity..."
                                className="!h-10 !text-xl !border-none !bg-transparent !px-0 placeholder:text-zinc-700 font-light tracking-tight"
                            />
                            <div className="flex items-center gap-4">
                                {isLoading && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                            <div className="p-2">

                                {/* SUGGESTIONS (Show when no search term) */}
                                {!searchTerm && (
                                    <div className="py-2">
                                        <div className="px-4 py-3 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-zinc-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Discover</span>
                                        </div>

                                        {/* Hashtags */}
                                        <div className="flex flex-wrap gap-2 px-4 pb-4">
                                            {SUGGESTED_HASHTAGS.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setSearchTerm(tag.replace('#', ''))}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-xs text-zinc-400 hover:text-white group"
                                                >
                                                    <Hash className="w-3 h-3 text-zinc-600 group-hover:text-blue-500" />
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Suggested Creators */}
                                        <div className="px-2">
                                            {TRENDING_CREATORS.map(u => (
                                                <div
                                                    key={u.username}
                                                    onClick={() => handleSelectCreator(u.username)}
                                                    className="flex items-center gap-4 p-3 hover:bg-white/[0.03] rounded-2xl transition-all cursor-pointer group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-zinc-700" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">@{u.username}</span>
                                                            {u.verified && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                                                        </div>
                                                    </div>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-800 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ACTIVE SEARCH RESULTS */}
                                {searchTerm && (
                                    <>
                                        {/* CREATORS */}
                                        {results.creators.length > 0 && (
                                            <div className="mb-2">
                                                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Creators</div>
                                                {results.creators.map(u => (
                                                    <div
                                                        key={u.id}
                                                        onClick={() => handleSelectCreator(u.username)}
                                                        className="flex items-center gap-4 p-3 hover:bg-white/[0.03] rounded-2xl transition-all cursor-pointer group"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                                                            {u.photoURL && <img src={u.photoURL} alt="" className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-sm font-medium text-white truncate">@{u.username}</span>
                                                                {u.verified && <CheckCircle2 className="w-3 h-3 text-blue-500 fill-black" />}
                                                            </div>
                                                            <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">View Registry</span>
                                                        </div>
                                                        <ArrowUpRight className="w-4 h-4 text-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* POSTS */}
                                        {results.posts.length > 0 && (
                                            <div>
                                                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Manuscripts</div>
                                                {results.posts.map(p => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => handleSelectPost(p.id)}
                                                        className="flex items-center gap-4 p-3 hover:bg-white/[0.03] rounded-2xl transition-all cursor-pointer group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                            <Play className="w-4 h-4 text-zinc-700" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-zinc-400 group-hover:text-white truncate transition-colors">
                                                                {p.caption}
                                                            </p>
                                                            <span className="text-[10px] text-zinc-700 uppercase tracking-widest">Post_{p.id.slice(0, 4)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* No results state */}
                                        {!isLoading && results.creators.length === 0 && results.posts.length === 0 && (
                                            <div className="p-12 text-center text-zinc-600">
                                                <span className="text-xs uppercase tracking-widest font-bold">No results found</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}