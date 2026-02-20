"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

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
                    {(displayName || username)[0]}
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                // Fetch users, excluding current user if logged in
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    limit(6)
                );

                const snap = await getDocs(q);
                let users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));

                // Filter out current user
                if (currentUser) {
                    users = users.filter(u => u.uid !== currentUser.uid);
                }

                setSuggestedUsers(users.slice(0, 5));
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [currentUser?.uid]);

    return (
        <div className="flex flex-col w-full max-w-[320px] py-4 pr-4 sticky top-20 self-start h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
            {/* Trending Header */}
            <div className="flex items-center justify-between pt-5 pb-3">
                <span className="text-[13px] font-bold text-white/80 flex items-center gap-1.5">
                    🔥 Trending Premium Creators
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
                    <p className="text-[12px] text-white/20 py-4">No creators found</p>
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
    );
}
