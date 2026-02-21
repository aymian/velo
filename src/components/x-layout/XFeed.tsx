"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, Post, User } from "@/lib/firebase/collections";
import { TweetCard } from "./TweetCard";
import { useEffect, useRef, useState } from "react";
import {
    Loader2,
    Sparkles,
    Image as ImageIcon,
    Film,
    BarChart3,
    Smile,
    Calendar,
    ArrowUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { useAuthStore } from "@/lib/store";

export function XFeed() {
    const { user } = useAuthStore();
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

    // UI Force Load State (as requested "like 10 seconds")
    const [forceLoading, setForceLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setForceLoading(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const fetchPosts = async ({ pageParam }: { pageParam: any }) => {
        // ... (rest of fetchPosts remains the same)
        try {
            let postsQuery = query(
                collection(db, COLLECTIONS.POSTS),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            if (pageParam) {
                postsQuery = query(
                    collection(db, COLLECTIONS.POSTS),
                    orderBy("createdAt", "desc"),
                    startAfter(pageParam),
                    limit(10)
                );
            }

            const snapshot = await getDocs(postsQuery);
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];

            const posts = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data() as Post;
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
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: ["x-posts-feed", activeTab],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage) => lastPage.lastVisible || undefined,
        initialPageParam: null,
    });

    // Real-time listener for new posts
    useEffect(() => {
        // Only listen on "foryou" tab which shows all posts
        if (activeTab !== "foryou") return;

        const q = query(
            collection(db, COLLECTIONS.POSTS),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) return;

            const latestPostId = snapshot.docs[0].id;
            // check if we have data loaded
            if (!data || !data.pages || data.pages.length === 0 || data.pages[0].posts.length === 0) return;

            const currentFirstPostId = data.pages[0].posts[0].id;

            // If the latest post in DB is different from our first post, refresh
            if (latestPostId !== currentFirstPostId) {
                refetch();
            }
        });

        return () => unsubscribe();
    }, [data, activeTab, refetch]);

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

    return (
        <div className="flex flex-col min-h-screen">
            {/* Posts List */}
            {status === "pending" || forceLoading ? (
                <FeedSkeleton />
            ) : (
                <div className="flex flex-col">
                    {data?.pages.map((page) =>
                        page.posts.map((post) => (
                            <TweetCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            )}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-20 flex items-center justify-center">
                {isFetchingNextPage && <div className="p-4 w-full"><FeedSkeleton /></div>}
            </div>

        </div>
    );
}
