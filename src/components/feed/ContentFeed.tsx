"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, Post, User } from "@/lib/firebase/collections";
import { FeedCard } from "./FeedCard";
import { FeedSkeleton } from "../FeedSkeleton";
import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ContentFeed() {
    const sentinelRef = useRef<HTMLDivElement>(null);

    // UI Force Load State (as requested "like 20 seconds")
    const [forceLoading, setForceLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setForceLoading(false), 20000);
        return () => clearTimeout(timer);
    }, []);

    const fetchPosts = async ({ pageParam }: { pageParam: any }) => {
        // ... rest of fetchPosts
        try {
            let postsQuery = query(
                collection(db, COLLECTIONS.POSTS),
                orderBy("createdAt", "desc"),
                limit(8)
            );

            if (pageParam) {
                postsQuery = query(
                    collection(db, COLLECTIONS.POSTS),
                    orderBy("createdAt", "desc"),
                    startAfter(pageParam),
                    limit(8)
                );
            }

            const snapshot = await getDocs(postsQuery);
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];

            const posts = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data() as Post;
                // Fetch creator info to get latest username/verified status
                const creatorDoc = await getDoc(doc(db, COLLECTIONS.USERS, data.creatorId));
                const creatorData = creatorDoc.exists() ? creatorDoc.data() as User : undefined;

                return {
                    ...data,
                    id: docSnapshot.id,
                    creator: creatorData
                };
            }));

            return { posts, lastVisible };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return { posts: [], lastVisible: null };
        }
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ["posts-feed"],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage) => lastPage.lastVisible || undefined,
        initialPageParam: null,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending" || forceLoading) {
        return <FeedSkeleton />;
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto">
            {/* Feed Header */}
            <div className="px-6 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Reels <span className="text-[#FF2D55]">•</span> Live
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Discover what's trending right now</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-20"
            >
                {data?.pages.map((page) =>
                    page.posts.map((post) => (
                        <FeedCard key={post.id} post={post} />
                    ))
                )}
            </motion.div>

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-40 flex flex-col items-center justify-center gap-2">
                {isFetchingNextPage ? (
                    <>
                        <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
                        <span className="text-white/20 text-xs uppercase tracking-widest font-bold">Fetching more</span>
                    </>
                ) : !hasNextPage && data?.pages[0].posts.length ? (
                    <div className="flex flex-col items-center gap-4 opacity-20">
                        <div className="h-[1px] w-20 bg-white" />
                        <span className="text-white text-xs uppercase tracking-[0.3em]">End of feed</span>
                        <div className="h-[1px] w-20 bg-white" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
