"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatModal } from "./ChatModal";

export function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1
                }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group p-4 bg-[#0F0F0F] text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5 hover:scale-110 active:scale-95 transition-all"
                >
                    <Send className="w-6 h-6 -rotate-[15deg] translate-x-0.5" strokeWidth={1.5} />

                    {/* Notification Badge */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-[#FF2D55] items-center justify-center border-2 border-[#0F0F0F]">
                                <span className="text-[10px] text-white font-black">1</span>
                            </span>
                        </span>
                    )}

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#1A1A1A] text-white rounded-xl font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest text-[10px]">
                        {isOpen ? 'Close' : 'Chats'}
                    </div>
                </button>
            </motion.div>
        </div>
    );
}
