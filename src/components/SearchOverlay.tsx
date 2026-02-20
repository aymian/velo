"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Search,
    X,
    ArrowUpRight,
    Play,
    Hash,
    User,
    TrendingUp,
    Clock,
    Flame
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import * as Tooltip from "@radix-ui/react-tooltip";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store";
import { VerifiedBadge } from "./ui/VerifiedBadge";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTED_HASHTAGS = [
    { tag: "#Exclusive", desc: "Premium creator content" },
    { tag: "#AfterDark", desc: "Late night vibes" },
    { tag: "#Manuscript", desc: "Original stories" },
    { tag: "#POV", desc: "Point of view clips" },
    { tag: "#Viral", desc: "Trending now" },
    { tag: "#LiveMoments", desc: "Stream highlights" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ creators: any[]; posts: any[] }>({ creators: [], posts: [] });
    const [topCreators, setTopCreators] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { recentSearches, addSearch, removeSearch, clearRecent } = useSearchStore();

    useEffect(() => {
        if (!isOpen || topCreators.length > 0) return;
        const fetchTop = async () => {
            try {
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    orderBy("followers", "desc"),
                    limit(5)
                );
                const snap = await getDocs(q);
                setTopCreators(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch {
                // silently fail 
            }
        };
        fetchTop();
    }, [isOpen, topCreators.length]);

    useEffect(() => {
        if (!isOpen) {
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
        const debounce = setTimeout(performSearch, 200);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectCreator = useCallback((username: string) => {
        addSearch(`@${username}`);
        router.push(`/@${username}`);
        onClose();
    }, [router, onClose, addSearch]);

    const handleSelectPost = useCallback((id: string, caption?: string) => {
        if (caption) addSearch(caption.slice(0, 30));
        router.push(`/for-you?v=${id}`);
        onClose();
    }, [router, onClose, addSearch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        } else if (e.key === "Enter" && searchTerm.trim()) {
            addSearch(searchTerm.trim());
        }
    }, [onClose, searchTerm, addSearch]);

    const totalResults = results.creators.length + results.posts.length;
    const hasResults = totalResults > 0;

    return (
        <Tooltip.Provider delayDuration={300}>
            <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:fade-out" />
                    <Dialog.Content
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                            setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        onKeyDown={handleKeyDown}
                        className="fixed top-[8vh] left-1/2 -translate-x-1/2 z-[101] w-[95vw] max-w-[580px] outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200"
                    >
                        <Dialog.Title className="sr-only">Search Velo</Dialog.Title>
                        <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-[0_40px_120px_rgba(255,59,92,0.08),0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="relative flex items-center gap-3 px-5 py-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff3b5c]/10 to-[#a855f7]/10 border border-[#ff3b5c]/10 shrink-0">
                                    <Search className="w-[18px] h-[18px] text-[#ff3b5c]" strokeWidth={2} />
                                </div>
                                <input
                                    ref={inputRef}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search creators, posts, tags..."
                                    className="flex-1 h-10 bg-transparent text-[17px] text-white placeholder:text-white/20 font-medium tracking-tight outline-none caret-[#ff3b5c]"
                                />
                                <div className="flex items-center gap-2 shrink-0">
                                    {isLoading && (
                                        <div className="w-5 h-5 border-2 border-[#ff3b5c]/20 border-t-[#ff3b5c] rounded-full animate-spin" />
                                    )}
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5 text-white/40" />
                                        </button>
                                    )}
                                    <Dialog.Close asChild>
                                        <button className="px-3 py-1.5 text-[12px] font-bold text-white/30 hover:text-white/60 transition-colors tracking-wide">
                                            ESC
                                        </button>
                                    </Dialog.Close>
                                </div>
                            </div>

                            <Separator.Root className="h-px bg-gradient-to-r from-transparent via-[#ff3b5c]/15 to-transparent" />

                            <ScrollArea.Root className="max-h-[62vh]">
                                <ScrollArea.Viewport className="w-full max-h-[62vh] overflow-y-auto">
                                    <div className="p-3">
                                        {!searchTerm && (
                                            <>
                                                {recentSearches.length > 0 && (
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3 text-white/15" />
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">Recent</span>
                                                            </div>
                                                            <button
                                                                onClick={clearRecent}
                                                                className="text-[10px] font-bold text-[#ff3b5c]/50 hover:text-[#ff3b5c] transition-colors uppercase tracking-wider"
                                                            >
                                                                Clear
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                                                            {recentSearches.slice(0, 5).map((term) => (
                                                                <button
                                                                    key={term}
                                                                    onClick={() => setSearchTerm(term)}
                                                                    className="group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-white/[0.03] border border-white/[0.04] rounded-full hover:bg-[#ff3b5c]/10 hover:border-[#ff3b5c]/20 transition-all text-[11px] text-white/30 hover:text-white/70"
                                                                >
                                                                    <span>{term}</span>
                                                                    <span
                                                                        onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                                                                        className="p-0.5 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X className="w-2.5 h-2.5" />
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <Separator.Root className="h-px bg-white/[0.03] mx-3 my-2" />
                                                    </div>
                                                )}

                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 px-3 py-2">
                                                        <Flame className="w-3 h-3 text-[#ff3b5c]/40" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">Trending Tags</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 px-3 pb-3">
                                                        {SUGGESTED_HASHTAGS.map(({ tag, desc }) => (
                                                            <Tooltip.Root key={tag}>
                                                                <Tooltip.Trigger asChild>
                                                                    <button
                                                                        onClick={() => setSearchTerm(tag.replace('#', ''))}
                                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-[#ff3b5c]/[0.06] to-[#a855f7]/[0.04] border border-[#ff3b5c]/[0.08] rounded-2xl hover:from-[#ff3b5c]/15 hover:to-[#a855f7]/10 hover:border-[#ff3b5c]/20 transition-all text-[12px] font-semibold text-white/40 hover:text-white/80 group"
                                                                    >
                                                                        <Hash className="w-3 h-3 text-[#ff3b5c]/40 group-hover:text-[#ff3b5c]" />
                                                                        {tag}
                                                                    </button>
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content
                                                                    side="bottom"
                                                                    sideOffset={6}
                                                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-[11px] text-white/60 font-medium shadow-xl"
                                                                >
                                                                    {desc}
                                                                </Tooltip.Content>
                                                            </Tooltip.Root>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator.Root className="h-px bg-white/[0.03] mx-3 mb-3" />

                                                <div>
                                                    <div className="flex items-center gap-2 px-3 py-2">
                                                        <TrendingUp className="w-3 h-3 text-[#a855f7]/40" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">Top Creators</span>
                                                    </div>
                                                    <div className="space-y-0.5 px-1">
                                                        {topCreators.length === 0 && (
                                                            <>
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="flex items-center gap-3.5 px-3 py-2.5">
                                                                        <div className="w-9 h-9 rounded-full bg-white/[0.03] animate-pulse shrink-0" />
                                                                        <div className="flex-1 space-y-1.5">
                                                                            <div className="h-2.5 w-24 bg-white/[0.03] rounded-full animate-pulse" />
                                                                            <div className="h-2 w-16 bg-white/[0.02] rounded-full animate-pulse" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                        {topCreators.map((u) => (
                                                            <div
                                                                key={u.id}
                                                                onClick={() => handleSelectCreator(u.username)}
                                                                className="flex items-center gap-3.5 px-3 py-2.5 hover:bg-gradient-to-r hover:from-[#ff3b5c]/[0.04] hover:to-transparent rounded-2xl transition-all cursor-pointer group"
                                                            >
                                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff3b5c]/20 to-[#a855f7]/20 border border-[#ff3b5c]/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                                    {u.photoURL
                                                                        ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                                                                        : <User className="w-4 h-4 text-[#ff3b5c]/50" />
                                                                    }
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[13px] font-semibold text-white/50 group-hover:text-white transition-colors truncate">
                                                                            {u.username ? `@${u.username}` : u.displayName || "Creator"}
                                                                        </span>
                                                                        <VerifiedBadge
                                                                            showOnCondition={!!(u.verified || (u.followers && u.followers >= 1))}
                                                                            size={12}
                                                                        />
                                                                    </div>
                                                                    <span className="text-[10px] font-medium text-[#a855f7]/40">
                                                                        {u.followers != null
                                                                            ? `${u.followers >= 1000 ? `${(u.followers / 1000).toFixed(1)}K` : u.followers} followers`
                                                                            : "Creator"}
                                                                    </span>
                                                                </div>
                                                                <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-[#ff3b5c]/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {searchTerm && (
                                            <>
                                                {results.creators.length > 0 && (
                                                    <div className="mb-2">
                                                        <div className="flex items-center gap-2 px-3 py-2">
                                                            <User className="w-3 h-3 text-[#ff3b5c]/30" />
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">Creators</span>
                                                            <span className="text-[9px] font-bold text-[#ff3b5c]/30 bg-[#ff3b5c]/[0.06] px-1.5 py-0.5 rounded-full">{results.creators.length}</span>
                                                        </div>
                                                        <div className="space-y-0.5 px-1">
                                                            {results.creators.map((u) => (
                                                                <div
                                                                    key={u.id}
                                                                    onClick={() => handleSelectCreator(u.username)}
                                                                    className="flex items-center gap-3.5 px-3 py-2.5 hover:bg-gradient-to-r hover:from-[#ff3b5c]/[0.05] hover:to-transparent rounded-2xl transition-all cursor-pointer group"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff3b5c]/15 to-[#a855f7]/15 border border-[#ff3b5c]/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                                        {u.photoURL ? (
                                                                            <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <User className="w-4 h-4 text-[#ff3b5c]/40" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[13px] font-semibold text-white/80 truncate group-hover:text-white transition-colors">@{u.username}</span>
                                                                            <VerifiedBadge
                                                                                showOnCondition={!!(u.verified || (u.followers && u.followers >= 1))}
                                                                                size={14}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] font-medium text-white/15">View profile</span>
                                                                    </div>
                                                                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-[#ff3b5c]/60 transition-all" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {results.creators.length > 0 && results.posts.length > 0 && (
                                                    <Separator.Root className="h-px bg-white/[0.03] mx-3 my-2" />
                                                )}

                                                {results.posts.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 px-3 py-2">
                                                            <Play className="w-3 h-3 text-[#a855f7]/30" />
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">Posts</span>
                                                            <span className="text-[9px] font-bold text-[#a855f7]/30 bg-[#a855f7]/[0.06] px-1.5 py-0.5 rounded-full">{results.posts.length}</span>
                                                        </div>
                                                        <div className="space-y-0.5 px-1">
                                                            {results.posts.map((p: any) => (
                                                                <div
                                                                    key={p.id}
                                                                    onClick={() => handleSelectPost(p.id, p.caption)}
                                                                    className="flex items-center gap-3.5 px-3 py-2.5 hover:bg-gradient-to-r hover:from-[#a855f7]/[0.04] hover:to-transparent rounded-2xl transition-all cursor-pointer group"
                                                                >
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7]/15 to-[#ff3b5c]/10 border border-[#a855f7]/10 flex items-center justify-center shrink-0">
                                                                        <Play className="w-4 h-4 text-[#a855f7]/50 fill-[#a855f7]/20" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[13px] font-medium text-white/60 group-hover:text-white truncate transition-colors">
                                                                            {p.caption || "Untitled post"}
                                                                        </p>
                                                                        <span className="text-[10px] font-medium text-white/15">#{p.id.slice(0, 6)}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {!isLoading && !hasResults && (
                                                    <div className="py-16 flex flex-col items-center justify-center text-center">
                                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff3b5c]/10 to-[#a855f7]/10 border border-white/[0.04] flex items-center justify-center mb-4">
                                                            <Search className="w-6 h-6 text-white/10" />
                                                        </div>
                                                        <p className="text-[13px] font-semibold text-white/20 mb-1">No results for "{searchTerm}"</p>
                                                        <p className="text-[11px] text-white/10">Try a different keyword or hashtag</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                    orientation="vertical"
                                    className="flex w-1.5 touch-none select-none p-0.5 transition-colors"
                                >
                                    <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[#ff3b5c]/15 hover:bg-[#ff3b5c]/25 transition-colors" />
                                </ScrollArea.Scrollbar>
                            </ScrollArea.Root>

                            <Separator.Root className="h-px bg-white/[0.03]" />
                            <div className="flex items-center justify-between px-5 py-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-white/15 font-medium">
                                        <kbd className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-[9px] font-bold mr-1">↵</kbd>
                                        Search
                                    </span>
                                    <span className="text-[10px] text-white/15 font-medium">
                                        <kbd className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-[9px] font-bold mr-1">ESC</kbd>
                                        Close
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b5c] to-[#a855f7] uppercase tracking-[0.15em]">Velo Search</span>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </Tooltip.Provider>
    );
}