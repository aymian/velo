"use client";

import React, { useState } from "react";
import { Navigation } from "lucide-react";
import { ChatModal } from "./ChatModal";
import { useAuthStore } from "@/lib/store";

export function FloatingActions() {
    const { isAuthenticated } = useAuthStore();
    const [isChatOpen, setIsChatOpen] = useState(false);

    if (!isAuthenticated) return null;

    return (
        <>
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 z-[60] w-12 h-12 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl flex items-center justify-center hover:bg-[#222] active:scale-95 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            >
                <Navigation className="w-5 h-5 text-white fill-white" strokeWidth={0} />
            </button>

            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
