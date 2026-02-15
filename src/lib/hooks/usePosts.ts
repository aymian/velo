import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, Post } from "@/lib/firebase/collections";

// 🚀 Hook for fetching a creator's posts with high-performance caching
export function useCreatorPosts(creatorId: string | undefined) {
    return useQuery<Post[]>({
        queryKey: ["posts", creatorId],
        queryFn: async () => {
            if (!creatorId) return [];
            const q = query(
                collection(db, COLLECTIONS.POSTS),
                where("creatorId", "==", creatorId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        },
        enabled: !!creatorId,
        staleTime: 1000 * 60 * 5, // 5 minutes (User doesn't need to refetch often)
        gcTime: 1000 * 60 * 30, // 30 minutes (Keep in memory even if not used)
    });
}

// 🚀 Hook for a real-time stream that syncs with Query Cache
export function useRealtimeCreatorPosts(creatorId: string | undefined) {
    const queryClient = useQueryClient();

    return useQuery<Post[]>({
        queryKey: ["posts", creatorId, "realtime"],
        queryFn: () => {
            if (!creatorId) return [];
            const q = query(
                collection(db, COLLECTIONS.POSTS),
                where("creatorId", "==", creatorId),
                orderBy("createdAt", "desc")
            );

            // This setup allows us to keep the cache updated while having a real-time listener
            return new Promise<Post[]>((resolve) => {
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
                    // Update the primary query cache so other components benefit
                    queryClient.setQueryData(["posts", creatorId], posts);
                    resolve(posts);
                });
                // In a real app, you'd manage the unsubscribe life-cycle better
            });
        },
        enabled: !!creatorId,
    });
}
// 🚀 Hook for fetching the "For You" global feed
export function useForYouPosts() {
    return useQuery<Post[]>({
        queryKey: ["posts", "foryou"],
        queryFn: async () => {
            const q = query(
                collection(db, COLLECTIONS.POSTS),
                orderBy("createdAt", "desc"),
                // In a real app we'd add visibility checks here, but keep it simple for now
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        },
        staleTime: 1000 * 60, // 1 minute (Keep it fresh)
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
}
