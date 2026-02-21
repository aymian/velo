"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function KeyboardShortcuts({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if the user is typing in an input or textarea
            const target = e.target as HTMLElement;
            const isTyping =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isTyping) return;

            // Only trigger for authenticated users? 
            // The request didn't specify, but usually these shortcuts are for users.
            // I'll leave it open for now unless it makes sense to restrict.

            if (e.key.toLowerCase() === 'p') {
                router.push('/profile');
            } else if (e.key.toLowerCase() === 'c') {
                router.push('/create');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return <>{children}</>;
}
