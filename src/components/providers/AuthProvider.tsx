"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // 🚀 Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, sync with store
                // Also fetch full profile from Firestore
                const { getDocument } = await import("@/lib/firebase/helpers");
                const { COLLECTIONS } = await import("@/lib/firebase/collections");
                const profile = await getDocument<any>(COLLECTIONS.USERS, user.uid);

                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    username: profile?.username,
                    role: profile?.role || 'member',
                    plan: profile?.plan || 'free',
                    subscriptionStatus: profile?.subscriptionStatus || 'active',
                    verified: profile?.verified || false,
                });
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [setUser, setLoading]);

    return <>{children}</>;
}
