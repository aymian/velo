"use client";

import React from "react";
import {
    Settings,
    MailPlus,
    SquareArrowOutUpRight,
    ChevronDown,
    Search,
    Mail
} from "lucide-react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

interface ChatModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function ChatModal({ onClose, isOpen }: ChatModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Content
                    asChild
                    onPointerDownOutside={(e) => {
                        // Check if click was on the trigger or related elements to avoid double toggle
                        // But usually closing on outside click is standard
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-20 right-6 w-[380px] h-[620px] bg-[#050505] border border-white/5 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-[100] outline-none"
                    >
                        {/* Header - EXACT CLONE */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
                            <Dialog.Title className="text-xl font-bold text-white tracking-tight">Chat</Dialog.Title>
                            <div className="flex items-center gap-5 text-white/50">
                                <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" strokeWidth={1.5} />
                                <MailPlus className="w-5 h-5 hover:text-white cursor-pointer transition-colors" strokeWidth={1.5} />
                                <Link href="/chat">
                                    <SquareArrowOutUpRight className="w-4.5 h-4.5 hover:text-white cursor-pointer transition-colors" strokeWidth={1.5} />
                                </Link>
                                <Dialog.Close asChild>
                                    <ChevronDown className="w-6 h-6 hover:text-white cursor-pointer transition-colors" strokeWidth={2} />
                                </Dialog.Close>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col pt-4">
                            {/* Search Bar */}
                            <div className="px-4 mb-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={2} />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-[#111] border-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-white/5 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="px-4 flex gap-2 mb-10">
                                <button className="px-5 py-1.5 bg-white text-black text-[13px] font-bold rounded-lg transition-all">
                                    All
                                </button>
                                <button className="px-5 py-1.5 bg-transparent text-white/30 text-[13px] font-bold rounded-lg border border-white/5 hover:bg-white/5 transition-all">
                                    Requests
                                </button>
                            </div>

                            {/* Empty State - EXACT CLONE */}
                            <div className="flex-1 flex flex-col items-center justify-center pb-20 px-10 text-center">
                                <div className="relative mb-8">
                                    <Mail className="w-24 h-24 text-white stroke-[0.8px] opacity-90" />
                                    {/* Subtle glow behind mail icon */}
                                    <div className="absolute inset-0 blur-3xl bg-white/5 rounded-full" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Empty inbox</h3>
                                <p className="text-white/40 text-[15px] font-medium">Message someone</p>
                            </div>
                        </div>

                        {/* Bottom Handle (Style detail) */}
                        <div className="h-1 w-10 bg-white/10 mx-auto mb-4 rounded-full" />
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
