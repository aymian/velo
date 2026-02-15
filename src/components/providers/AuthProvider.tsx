"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // 🚀 Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, sync with store
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
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
