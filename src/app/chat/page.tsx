"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import {
    Search,
    MoreHorizontal,
    MoreVertical,
    Plus,
    Send,
    Image as ImageIcon,
    Mic,
    Video,
    Heart,
    Lock,
    DollarSign,
    Check,
    CheckCheck,
    Crown,
    Star,
    Sparkles,
    Flame,
    X,
    Filter,
    Shield,
    Info,
    ArrowUpRight,
    Camera,
    Smile,
    Paperclip,
    Phone,
    UserPlus,
    Circle,
    User,
    Users,
    Gift,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Aperture
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

// --- TYPES ---

interface Message {
    id: string;
    senderId: string;
    text?: string;
    image?: string;
    time: string;
    type: "text" | "locked" | "image" | "video";
    status?: "sent" | "delivered" | "read";
    price?: number;
    unlockText?: string;
}

interface Conversation {
    id: string;
    name: string;
    username: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    isVip: boolean;
    typing?: boolean;
}

// --- MOCK DATA ---

const CONVERSATIONS: Conversation[] = [
    {
        id: "1",
        name: "Beatrice Esposito",
        username: "beatrice_e",
        avatar: "https://i.pravatar.cc/150?u=beatrice",
        lastMessage: "yes no prob",
        time: "Yesterday",
        unread: 0,
        online: true,
        isVip: false,
    },
    {
        id: "2",
        name: "Evelyn Brown",
        username: "evelyn_b",
        avatar: "https://i.pravatar.cc/150?u=evelyn",
        lastMessage: "yes",
        time: "Yesterday",
        unread: 0,
        online: false,
        isVip: false
    },
    {
        id: "3",
        name: "Tango",
        username: "tango_official",
        avatar: "https://i.pravatar.cc/150?u=tango",
        lastMessage: "We detected a login to your account...",
        time: "Yesterday",
        unread: 0,
        online: true,
        isVip: false
    },
    {
        id: "4",
        name: "CHOSEN PRINCES",
        username: "chosen_p",
        avatar: "https://i.pravatar.cc/150?u=chosen",
        lastMessage: "Okay",
        time: "July 9",
        unread: 0,
        online: false,
        isVip: true
    },
    {
        id: "5",
        name: "Tango Guardian",
        username: "tango_g",
        avatar: "https://i.pravatar.cc/150?u=guardian",
        lastMessage: "Hooray! You're no longer blocked f...",
        time: "July 9",
        unread: 0,
        online: true,
        isVip: false
    },
    {
        id: "6",
        name: "Crazy indu",
        username: "crazy_indu",
        avatar: "https://i.pravatar.cc/150?u=indu",
        lastMessage: "It will be better",
        time: "July 8",
        unread: 0,
        online: true,
        isVip: false
    }
];

const INITIAL_MESSAGES: Message[] = [
    {
        id: "m1",
        senderId: "other",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        time: "13:38",
        type: "image"
    },
    {
        id: "m2",
        senderId: "other",
        text: "Can we get to know each other? 😚 😋 Messages get answered ASAP.❤️",
        time: "13:38",
        type: "text"
    },
    {
        id: "m3",
        senderId: "me",
        text: "yes no prob",
        time: "22:22",
        type: "text",
        status: "read"
    }
];

const GIFTS = [
    { icon: "⭐", count: 3 },
    { icon: "💗", count: 8 },
    { icon: "🐱", count: 4 },
    { icon: "🍎", count: 5 },
    { icon: "🐯", count: 9 },
    { icon: "🎯", count: 11 },
    { icon: "☀️", count: 5 },
    { icon: "💜", count: 5 },
    { icon: "🌈", count: 5 },
    { icon: "🌻", count: 7 },
    { icon: "🎈", count: 12 },
    { icon: "🌹", count: 99 }
];

// --- MAIN COMPONENT ---

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(CONVERSATIONS[0]);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            senderId: "me",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            type: "text",
            status: "sent"
        };

        setMessages([...messages, msg]);
        setNewMessage("");
    };

    return (
        <Tooltip.Provider>
            <div className="h-screen bg-[#111111] flex flex-col">
                <Navbar />
                <div className="flex flex-1 text-white overflow-hidden font-sans pt-20">

                    {/* 1. LEFT SIDEBAR - TANGO STYLE */}
                    <aside className="w-[300px] border-r border-white/5 bg-[#121212] flex flex-col">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-bold">Message Requests</span>
                            </div>
                            <button className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-white/20 transition-colors">
                                View
                            </button>
                        </div>

                        <ScrollArea.Root className="flex-1 overflow-hidden">
                            <ScrollArea.Viewport className="w-full h-full">
                                <div className="flex flex-col">
                                    {CONVERSATIONS.map(conv => {
                                        const isActive = selectedChat.id === conv.id;
                                        return (
                                            <div
                                                key={conv.id}
                                                onClick={() => setSelectedChat(conv)}
                                                className={`mx-2 my-1 p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all relative ${isActive ? "bg-[#FF2D55] text-white" : "hover:bg-white/5 text-zinc-400"
                                                    }`}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden flex bg-zinc-800">
                                                        <Avatar.Image
                                                            src={conv.avatar}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs">
                                                            {conv.name[0]}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>
                                                    {conv.online && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121212] rounded-full" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-zinc-200"}`}>
                                                            {conv.name}
                                                        </h4>
                                                        <span className={`text-[10px] ${isActive ? "text-white/70" : "text-zinc-500"}`}>
                                                            {conv.time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {conv.senderId === "me" && <Check className="w-3 h-3 text-zinc-500" />}
                                                        <p className={`text-xs truncate ${isActive ? "text-white/80" : "text-zinc-500"}`}>
                                                            {conv.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea.Viewport>
                            <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-black/10 transition-colors duration-150 ease-out hover:bg-black/20 data-[orientation=vertical]:w-2" orientation="vertical">
                                <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                            </ScrollArea.Scrollbar>
                        </ScrollArea.Root>

                        <div className="p-4 border-t border-white/5">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Suggested Creators</span>
                        </div>
                    </aside>

                    {/* 2. CENTER - CHAT WINDOW */}
                    <main className="flex-1 flex flex-col bg-[#1A1A1A] relative">

                        {/* Chat Header */}
                        <header className="h-16 px-6 flex items-center justify-between bg-[#1A1A1A] border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                                    <Avatar.Image src={selectedChat.avatar} className="w-full h-full object-cover" />
                                    <Avatar.Fallback>{selectedChat.name[0]}</Avatar.Fallback>
                                </Avatar.Root>
                                <h2 className="font-bold text-lg">{selectedChat.name}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-400">
                                <button className="hover:text-white transition-colors">
                                    <Aperture className="w-5 h-5" />
                                </button>
                                <button className="hover:text-white transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Message Stream */}
                        <ScrollArea.Root className="flex-1 overflow-hidden">
                            <ScrollArea.Viewport className="w-full h-full">
                                <div className="p-6 flex flex-col gap-6">
                                    {messages.map((msg, i) => {
                                        const isMe = msg.senderId === "me";
                                        return (
                                            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                {msg.image && (
                                                    <div className="relative mb-2 max-w-[400px] rounded-2xl overflow-hidden group border border-white/10">
                                                        <img src={msg.image} className="w-full h-auto object-cover" alt="" />
                                                        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold">13:38</div>
                                                    </div>
                                                )}

                                                {msg.text && (
                                                    <div className={`relative px-4 py-2.5 rounded-2xl text-[14px] max-w-[80%] leading-relaxed ${isMe ? "bg-[#4E67E8] text-white rounded-tr-sm" : "bg-[#252525] text-zinc-100 rounded-tl-sm"
                                                        }`}>
                                                        {msg.text}
                                                        <div className={`flex items-center gap-1.5 mt-1 ${isMe ? "justify-end" : "justify-start opacity-60"}`}>
                                                            <span className="text-[9px] font-medium">{msg.time}</span>
                                                            {isMe && (msg.status === "read" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea.Viewport>
                            <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out hover:bg-black/20 data-[orientation=vertical]:w-2" orientation="vertical">
                                <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-[10px] relative" />
                            </ScrollArea.Scrollbar>
                        </ScrollArea.Root>

                        {/* Gifts Section inside Body */}
                        <div className="px-6 py-4 border-t border-white/5 bg-[#1A1A1A]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 h-px bg-white/5" />
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Yesterday</span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            <div className="relative group flex items-center justify-center gap-4 overflow-x-auto scrollbar-hide py-2">
                                <button className="absolute left-0 z-10 p-1 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {GIFTS.map((gift, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
                                        <span className="text-2xl">{gift.icon}</span>
                                    </div>
                                ))}
                                <button className="absolute right-0 z-10 p-1 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Input Footer */}
                        <footer className="p-4 bg-[#1A1A1A]">
                            <div className="max-w-4xl mx-auto flex items-center gap-4 px-4 py-2 bg-[#252525] rounded-full border border-white/5">
                                <button className="p-2 hover:bg-white/5 rounded-full text-zinc-400 group">
                                    <Plus className="w-5 h-5 group-hover:text-white transition-colors" />
                                </button>

                                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Message..."
                                        className="flex-1 bg-transparent py-2 text-[14px] focus:outline-none placeholder:text-zinc-600"
                                    />
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <button type="button" className="p-2 hover:text-white transition-colors">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                        <button type="button" className="p-2 hover:text-white transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button type="button" className="p-2 hover:text-white transition-colors">
                                            <Gift className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </Tooltip.Provider>
    );
}
