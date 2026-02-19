"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { COLLECTIONS, User } from "@/lib/firebase/collections";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function ChatModal({ onClose, isOpen }: ChatModalProps) {
    const router = useRouter();
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const q = query(collection(db, COLLECTIONS.USERS), limit(20));
                const snapshot = await getDocs(q);
                const fetched: User[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data() as User;
                    if (data.uid !== currentUser.uid) {
                        fetched.push(data);
                    }
                });
                setUsers(fetched);
            } catch (e) {
                console.error("Error loading chat users", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    const filteredUsers = users.filter((u) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
            u.displayName?.toLowerCase().includes(term) ||
            u.username?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term)
        );
    });

    const handleOpenChat = (uid: string) => {
        router.push(`/chat?uid=${uid}`);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Content asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 w-full max-w-sm md:w-[380px] h-[70vh] md:h-[620px] bg-[#050505] border border-white/5 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-[100] outline-none"
                    >
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

                        <div className="flex-1 flex flex-col pt-4">
                            <div className="px-4 mb-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={2} />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-[#111] border-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-white/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="px-4 flex gap-2 mb-4">
                                <button className="px-5 py-1.5 bg-white text-black text-[13px] font-bold rounded-lg transition-all">
                                    All
                                </button>
                                <button className="px-5 py-1.5 bg-transparent text-white/30 text-[13px] font-bold rounded-lg border border-white/5 hover:bg-white/5 transition-all">
                                    Requests
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                                {isLoading ? (
                                    <div className="h-full flex items-center justify-center text-white/40 text-sm">
                                        Loading chats...
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center pb-10 text-center text-white/50">
                                        <div className="relative mb-6">
                                            <Mail className="w-20 h-20 text-white stroke-[0.8px] opacity-80" />
                                            <div className="absolute inset-0 blur-3xl bg-white/5 rounded-full" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">No chats yet</h3>
                                        <p className="text-[13px] text-white/40">
                                            Follow people or search by name to start a conversation.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredUsers.map((user) => {
                                            const displayName = user.displayName || user.username || "User";
                                            const handle = user.username || user.email?.split("@")[0] || "user";
                                            const avatar =
                                                user.photoURL ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    displayName
                                                )}&background=333&color=fff`;

                                            return (
                                                <button
                                                    key={user.uid}
                                                    onClick={() => handleOpenChat(user.uid)}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#111] border border-white/5 hover:bg-[#18181b] transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9 border border-white/10">
                                                            <AvatarImage src={avatar} />
                                                            <AvatarFallback className="bg-[#27272A] text-white text-xs">
                                                                {displayName.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-semibold text-white leading-tight">
                                                                {displayName}
                                                            </span>
                                                            <span className="text-[11px] text-white/40">@{handle}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-white/30 uppercase tracking-[0.18em]">
                                                        Chat
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-1 w-10 bg-white/10 mx-auto mb-4 rounded-full" />
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
