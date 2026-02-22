"use client";

import { useAuthStore } from "@/lib/store";
import { getPlanValue } from "@/lib/config/plans";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";

/**
 * Hook to manage and check daily message limits
 */
export function useMessageLimit() {
    const { user } = useAuthStore();
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const limit = getPlanValue(user, "maxMessagesPerDay") ?? 3;

    useEffect(() => {
        if (!user?.uid) return;

        async function fetchTodayCount() {
            const countRef = doc(db, "messageCounts", `${user?.uid}_${today}`);
            const snap = await getDoc(countRef);
            if (snap.exists()) {
                setCount(snap.data().count || 0);
            } else {
                setCount(0);
            }
            setIsLoading(false);
        }

        fetchTodayCount();
    }, [user?.uid, today]);

    const checkAndIncrement = async (): Promise<{ allowed: boolean; remaining: number }> => {
        if (!user?.uid) return { allowed: false, remaining: 0 };

        // Elite/Pro have Infinity
        if (limit === Infinity) return { allowed: true, remaining: Infinity };

        if (count >= limit) {
            return { allowed: false, remaining: 0 };
        }

        // Increment in Firestore
        const countRef = doc(db, "messageCounts", `${user.uid}_${today}`);
        await setDoc(countRef, {
            count: increment(1),
            userId: user.uid,
            date: today,
            updatedAt: serverTimestamp()
        }, { merge: true });

        setCount(prev => prev + 1);
        return { allowed: true, remaining: limit - (count + 1) };
    };

    return {
        count,
        limit,
        isOverLimit: limit !== Infinity && count >= limit,
        checkAndIncrement,
        isLoading
    };
}
