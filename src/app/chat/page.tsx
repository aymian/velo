"use client";

import React from "react";
import {
    MoreHorizontal,
    Plus,
    Image as ImageIcon,
    Smile,
    Info,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChatPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#FF2D55]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <div className="pt-16 flex flex-col h-screen max-w-2xl mx-auto border-x border-white/10 w-full">

                    {/* Top Header - Clone of the screenshot */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-16 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png"
                                    alt="Netflix"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-lg">Netflix</span>
                                <CheckCircle2 className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55] stroke-black" />
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-all border border-white/10">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto px-4 pt-12 pb-24 custom-scrollbar">

                        {/* Middle Profile Hero */}
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="w-20 h-20 rounded-full bg-black border border-white/10 p-4 mb-4">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png"
                                    alt="Netflix"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex items-center gap-1 mb-0.5">
                                <span className="font-bold text-xl">Netflix</span>
                                <CheckCircle2 className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55] stroke-black" />
                            </div>
                            <span className="text-white/50 text-[15px] mb-1">@netflix</span>
                            <span className="text-white/50 text-[15px] mb-6">Joined October 2008</span>

                            <button className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-[15px]">
                                View Profile
                            </button>
                        </div>

                        <div className="flex justify-center mb-10">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Today</span>
                        </div>

                        {/* User Message - Pink/Purple Bubble */}
                        <div className="flex flex-col items-end gap-1 mb-8">
                            <div className="bg-gradient-to-r from-[#FF2D55] to-[#7c4dff] px-4 py-2.5 rounded-[1.5rem] rounded-tr-none max-w-[80%] flex items-center gap-3 shadow-[0_4px_15px_rgba(255,45,85,0.2)]">
                                <span className="text-[15px] font-medium">hi</span>
                                <div className="flex items-center gap-1 mt-1 opacity-60">
                                    <span className="text-[11px] font-medium">12:43 PM</span>
                                    <div className="w-3 h-3 rounded-full border border-white/40 border-t-transparent animate-spin" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[#F4212E] text-[13px] font-medium pr-1">
                                <span>Failed</span>
                                <AlertCircle className="w-3.5 h-3.5" />
                            </div>
                        </div>

                    </div>

                    {/* Bottom Input Area */}
                    <div className="px-3 py-3 border-t border-white/10 bg-black fixed bottom-0 w-full max-w-2xl">
                        <div className="flex items-center gap-1">
                            <div className="flex items-center">
                                <button className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all">
                                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                                <button className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all">
                                    <div className="w-5 h-5 border-[1.5px] border-current rounded flex items-center justify-center text-[10px] font-black">GIF</div>
                                </button>
                                <button className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all">
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Unencrypted message"
                                    className="w-full bg-[#202327] border-none rounded-3xl py-3 px-5 text-[15px] text-white placeholder:text-white/40 outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
