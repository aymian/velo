"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const checkAuth = () => {
            try {
                // Try to get session from cookie
                const cookies = document.cookie.split(';');
                const sessionCookie = cookies.find(c => c.trim().startsWith('velo-session='));

                if (sessionCookie) {
                    const sessionValue = decodeURIComponent(sessionCookie.split('=')[1]);

                    // Simple check if it's the demo token or actual JSON
                    if (sessionValue === 'demo-google-session-token') {
                        setUser({
                            uid: 'demo-user',
                            email: 'demo@example.com',
                            displayName: 'Demo User',
                            photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=ff4081&color=fff',
                        });
                    } else {
                        try {
                            const session = JSON.parse(sessionValue);
                            setUser({
                                uid: session.user.id,
                                email: session.user.email,
                                displayName: session.user.name,
                                photoURL: session.user.picture,
                            });
                        } catch (e) {
                            console.error("Failed to parse session cookie", e);
                            setUser(null);
                        }
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Listen for cookie changes or storage events if needed
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [setUser, setLoading]);

    return <>{children}</>;
}
