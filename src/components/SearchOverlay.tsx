"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    ArrowRight,
    User,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from "firebase/firestore";
import { COLLECTIONS, User as UserType } from "@/lib/firebase/collections";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        } else {
            setSearchTerm("");
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Handle searching
    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim() || searchTerm.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    orderBy("username"),
                    startAt(searchTerm.toLowerCase()),
                    endAt(searchTerm.toLowerCase() + "\uf8ff"),
                    limit(5)
                );

                const querySnapshot = await getDocs(q);
                const users: UserType[] = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data() as UserType);
                });
                setResults(users);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSelectUser = (username: string) => {
        router.push(`/@${username}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative w-full max-w-lg px-4"
                    >
                        <div className="bg-[#121212] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
                            {/* Compact Search Bar */}
                            <div className="relative flex items-center px-4 py-3">
                                <Search className="w-4 h-4 text-white/20 ml-2" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by username..."
                                    className="w-full bg-transparent border-none py-2 px-3 text-[15px] text-white placeholder:text-white/20 transition-all outline-none"
                                />
                                <div className="flex items-center gap-2">
                                    {isLoading && <Loader2 className="w-4 h-4 text-white/20 animate-spin" />}
                                    <span className="text-[10px] text-white/10 font-bold px-1.5 py-0.5 border border-white/10 rounded">ESC</span>
                                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                        <X className="w-4 h-4 text-white/20" />
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                                {results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((user) => (
                                            <button
                                                key={user.uid}
                                                onClick={() => handleSelectUser(user.username || "")}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-all group"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=ff4081&color=fff`}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    {user.verified && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#121212]" />
                                                    )}
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="text-[13px] font-medium text-white/90 group-hover:text-white leading-tight">
                                                        {user.displayName || user.username}
                                                    </p>
                                                    <p className="text-[11px] text-white/30">@{user.username}</p>
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : searchTerm.length >= 2 && !isLoading ? (
                                    <div className="px-4 py-8 text-center text-[13px] text-white/20 italic">
                                        No users found for "@{searchTerm}"
                                    </div>
                                ) : !isLoading && (
                                    <div className="px-4 py-8 text-center text-[12px] text-white/20">
                                        Start typing to search for creators...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
