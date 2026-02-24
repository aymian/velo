import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
    getCountFromServer
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, User, Post } from './collections';

// 👥 Admin User Management Hooks
export function useAdminUsers(filter: string = 'all') {
    return useQuery({
        queryKey: ['admin', 'users', filter],
        queryFn: async () => {
            const usersRef = collection(db, COLLECTIONS.USERS);
            let q = query(usersRef, orderBy('createdAt', 'desc'), limit(100));

            if (filter === 'verified') {
                q = query(usersRef, where('verified', '==', true), limit(100));
            } else if (filter === 'creators') {
                q = query(usersRef, where('role', '==', 'creator'), limit(100));
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[];
        }
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            await updateDoc(userRef, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });
}

// 📦 Admin Content Management Hooks
export function useAdminPosts(filter: string = 'all') {
    return useQuery({
        queryKey: ['admin', 'posts', filter],
        queryFn: async () => {
            const postsRef = collection(db, COLLECTIONS.POSTS);
            let q = query(postsRef, orderBy('createdAt', 'desc'), limit(100));

            if (filter === 'flagged') {
                q = query(postsRef, where('status', '==', 'error'), limit(100));
            }

            const snapshot = await getDocs(q);
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];

            // Fetch creators for each post
            const postsWithCreators = await Promise.all(posts.map(async (post) => {
                const userSnap = await getDocs(query(collection(db, COLLECTIONS.USERS), where('uid', '==', post.creatorId)));
                const userData = userSnap.docs[0]?.data();
                return { ...post, creator: userData };
            }));

            return postsWithCreators;
        }
    });
}

// 🚩 Admin Reports Management Hooks
export function useAdminReports() {
    return useQuery({
        queryKey: ['admin', 'reports'],
        queryFn: async () => {
            const reportsRef = collection(db, COLLECTIONS.REPORTS);
            const q = query(reportsRef, orderBy('createdAt', 'desc'), limit(100));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    });
}

// 📊 Admin Dashboard Analytics Hooks
export function useAdminStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const usersCount = await getCountFromServer(collection(db, COLLECTIONS.USERS));
            const postsCount = await getCountFromServer(collection(db, COLLECTIONS.POSTS));
            const reportsCount = await getCountFromServer(collection(db, COLLECTIONS.REPORTS));

            // For revenue, we could sum up an 'earned' field in users or transactions
            const usersSnapshot = await getDocs(query(collection(db, COLLECTIONS.USERS), where('earned', '>', 0)));
            const totalRevenue = usersSnapshot.docs.reduce((acc, doc) => acc + (doc.data().earned || 0), 0);

            return {
                totalUsers: usersCount.data().count,
                totalPosts: postsCount.data().count,
                pendingReports: reportsCount.data().count,
                totalRevenue: totalRevenue,
                activeToday: Math.floor(usersCount.data().count * 0.15) // Proxy for active users
            };
        }
    });
}
