"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase/config";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

function StoryCircle({ username, imageUrl, hasUnseen, onClick }: {
    username: string;
    imageUrl?: string;
    hasUnseen?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 w-full py-2 group"
        >
            <div className={cn(
                "w-[54px] h-[54px] rounded-full p-[2px] transition-transform active:scale-95",
                hasUnseen ? "bg-gradient-to-tr from-[#FF2D55] to-[#A855F7]" : "bg-neutral-800"
            )}>
                <div className="w-full h-full rounded-full p-[2px] bg-black">
                    <Avatar className="w-full h-full border-none">
                        <AvatarImage src={imageUrl} className="object-cover" />
                        <AvatarFallback className="bg-neutral-900 text-neutral-500 font-bold">
                            {username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="flex flex-col items-start truncate overflow-hidden">
                <span className="text-[13px] font-bold text-white group-hover:text-[#FF2D55] transition-colors truncate w-full text-left">
                    {username}
                </span>
                <span className="text-[11px] text-white/40 font-medium">Recently updated</span>
            </div>
        </button>
    );
}

const STAT_LABELS = [
    "+2.1k new subs",
    "8.4k likes today",
    "+1.3k new subs",
    "12k views today",
    "+900 new subs",
];

function TrendingCreator({ rank, username, displayName, imageUrl, stat, onClick }: {
    rank: number;
    username: string;
    displayName: string;
    imageUrl?: string;
    stat: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 py-2.5 hover:bg-white/[0.03] rounded-xl px-2 -mx-2 transition-colors group"
        >
            <span className="text-[12px] font-bold text-white/20 w-4 shrink-0 text-right">{rank}</span>
            <Avatar className="w-9 h-9 border border-white/[0.07] shrink-0">
                <AvatarImage src={imageUrl} />
                <AvatarFallback className="bg-white/10 text-white/50 text-xs">
                    {(displayName || username || "U")[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-[13px] font-semibold text-white leading-tight truncate max-w-full">
                    {displayName || username}
                </span>
                <span className="text-[12px] text-white/35 leading-tight">{stat}</span>
            </div>
            <span className="text-[11px] text-white/20 group-hover:text-white/50 transition-colors shrink-0">Follow</span>
        </button>
    );
}

export function RightSidebar() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch suggestions
                const suggestQuery = query(
                    collection(db, COLLECTIONS.USERS),
                    limit(6)
                );
                const suggestSnap = await getDocs(suggestQuery);
                let users = suggestSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
                if (currentUser) users = users.filter((u: any) => u.uid !== currentUser.uid);
                setSuggestedUsers(users.slice(0, 5));

                // Fetch recent stories
                const storiesCollection = collection(db, COLLECTIONS.STORIES);
                const storiesSnap = await getDocs(query(storiesCollection, limit(40)));
                const allStories = storiesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

                // Sort by createdAt desc
                allStories.sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
                });

                // Group by user
                const uniqueStoryUsers = Array.from(new Set(allStories.map((s: any) => s.userId))).slice(0, 10);
                const { getDoc, doc } = await import("firebase/firestore");

                const storiesWithUsers = await Promise.all(
                    uniqueStoryUsers.map(async (uid) => {
                        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid as string));
                        if (!userDoc.exists()) return null;
                        return {
                            userId: uid,
                            user: userDoc.data()
                        };
                    })
                );
                setStories(storiesWithUsers.filter(s => s !== null));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser?.uid]);

    return (
        <div className="flex flex-col w-full max-w-[320px] py-4 pr-4 sticky top-20 self-start h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide space-y-8">
            {/* Stories Section */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#FF2D55]">Stories</span>
                    <button className="text-[10px] font-bold text-white/30 hover:text-white transition-colors">Watch All</button>
                </div>

                <div className="flex flex-col gap-1">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                                <div className="w-[54px] h-[54px] rounded-full bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-20 bg-white/10 rounded" />
                                    <div className="h-2 w-16 bg-white/5 rounded" />
                                </div>
                            </div>
                        ))
                    ) : stories.length === 0 ? (
                        <p className="text-[11px] text-white/20 py-2 px-1">No active transmissions</p>
                    ) : (
                        stories.map((s: any) => (
                            <StoryCircle
                                key={s.userId}
                                username={s.user.username || s.user.displayName || "user"}
                                imageUrl={s.user.photoURL}
                                hasUnseen={true}
                                onClick={() => router.push(`/view-story?username=${s.user.username || s.userId}`)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Trending Header */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between pt-5 pb-3 px-1">
                    <span className="text-[12px] font-bold text-white/80 flex items-center gap-1.5 uppercase tracking-wider">
                        🔥 Trending Creators
                    </span>
                </div>

                {/* Leaderboard */}
                <div className="flex flex-col">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2.5 animate-pulse">
                                <div className="w-4 h-2.5 bg-white/5 rounded" />
                                <div className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="h-2.5 w-24 bg-white/10 rounded" />
                                    <div className="h-2 w-16 bg-white/5 rounded" />
                                </div>
                            </div>
                        ))
                    ) : suggestedUsers.length === 0 ? (
                        <p className="text-[12px] text-white/20 py-4 px-1">No creators found</p>
                    ) : (
                        suggestedUsers.map((u, i) => (
                            <TrendingCreator
                                key={u.uid}
                                rank={i + 1}
                                username={u.username || u.displayName || "user"}
                                displayName={u.displayName || u.username || "Creator"}
                                imageUrl={u.photoURL}
                                stat={STAT_LABELS[i % STAT_LABELS.length]}
                                onClick={() => router.push(`/@${u.username || u.uid}`)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
