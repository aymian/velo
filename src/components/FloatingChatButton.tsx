"use client";

import React, { useState } from "react";
import { MessageCircle, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatModal } from "./ChatModal";
import { useAuthStore } from "@/lib/store";

export function FloatingChatButton() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading || !isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5
                }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group p-4 bg-[#FF2D55] text-white rounded-full shadow-[0_10px_40px_rgba(255,45,85,0.3)] hover:shadow-[0_15px_50px_rgba(255,45,85,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10"
                >
                    {isOpen ? (
                        <CloseIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    ) : (
                        <MessageCircle
                            className="w-6 h-6 text-white"
                            strokeWidth={2.5}
                        />
                    )}

                    {/* Notification Badge - only show when closed */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-white items-center justify-center border-2 border-black">
                                <span className="text-[10px] text-black font-black italic">1</span>
                            </span>
                        </span>
                    )}

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black backdrop-blur-md text-white rounded-2xl font-bold text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl border border-white/10 uppercase tracking-[0.2em]">
                        {isOpen ? 'Close' : 'Messages'}
                    </div>
                </button>
            </motion.div>
        </div>
    );
}
