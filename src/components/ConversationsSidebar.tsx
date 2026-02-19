"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, orderBy, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, User as UserType } from "@/lib/firebase/collections";
import { useAuthStore } from "@/lib/store";
import { CheckCheck, Check } from "lucide-react";

interface ConversationItem {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageAt?: any;
    lastSenderId?: string | null;
    lastSeenAt?: Record<string, any>;
}

interface ConversationRowProps {
    conv: ConversationItem;
    currentUid: string;
    isActive: boolean;
    onClick: () => void;
}

function formatRelativeTime(value: any): string {
    if (!value) return "";
    try {
        const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

function ConversationRow({ conv, currentUid, isActive, onClick }: ConversationRowProps) {
    const peerId = conv.participants.find((p) => p !== currentUid) ?? "";
    const [peer, setPeer] = useState<UserType | null>(null);

    useEffect(() => {
        if (!peerId) return;
        getDoc(doc(db, COLLECTIONS.USERS, peerId)).then((snap) => {
            if (snap.exists()) setPeer({ uid: snap.id, ...snap.data() } as UserType);
        });
    }, [peerId]);

    const displayName = peer?.displayName || peer?.username || `user_${peerId.slice(0, 6)}`;
    const avatar =
        peer?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1e1e1e&color=666&size=80`;

    const isOwn = conv.lastSenderId === currentUid;
    const lastSeenAt = conv.lastSeenAt?.[peerId];
    const isSeen =
        isOwn &&
        lastSeenAt &&
        conv.lastMessageAt &&
        typeof lastSeenAt.toMillis === "function" &&
        typeof conv.lastMessageAt.toMillis === "function" &&
        lastSeenAt.toMillis() >= conv.lastMessageAt.toMillis();

    const preview = conv.lastMessage
        ? conv.lastMessage.length > 36
            ? conv.lastMessage.slice(0, 36) + "…"
            : conv.lastMessage
        : "No messages yet";

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
            }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={avatar}
                    alt={displayName}
                    className="w-11 h-11 rounded-full object-cover bg-[#1e1e1e]"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-white truncate">{displayName}</span>
                    <span className="text-[11px] text-white/30 shrink-0">{formatRelativeTime(conv.lastMessageAt)}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    {isOwn && (
                        isSeen
                            ? <CheckCheck className="w-3 h-3 text-white/30 shrink-0" />
                            : <Check className="w-3 h-3 text-white/30 shrink-0" />
                    )}
                    <span className="text-[12px] text-white/40 truncate">{preview}</span>
                </div>
            </div>
        </button>
    );
}

export function ConversationsSidebar() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeUid = searchParams.get("uid");

    const [conversations, setConversations] = useState<ConversationItem[]>([]);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const q = query(collection(db, "conversations"), orderBy("lastMessageAt", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            const items: ConversationItem[] = [];
            snap.forEach((d) => {
                const data = d.data() as any;
                if (data.participants?.includes(currentUser.uid)) {
                    items.push({ id: d.id, ...data });
                }
            });
            setConversations(items);
        });

        return () => unsub();
    }, [currentUser?.uid]);

    const handleSelect = (conv: ConversationItem) => {
        const peerId = conv.participants.find((p) => p !== currentUser?.uid);
        if (peerId) router.push(`/chat?uid=${peerId}`);
    };

    return (
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0d0d0d] h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-5 pb-3 border-b border-white/[0.06]">
                <h2 className="text-[15px] font-semibold text-white">Messages</h2>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-[12px] text-white/25">No conversations yet</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <ConversationRow
                            key={conv.id}
                            conv={conv}
                            currentUid={currentUser?.uid ?? ""}
                            isActive={
                                !!activeUid &&
                                conv.participants.includes(activeUid) &&
                                conv.participants.includes(currentUser?.uid ?? "")
                            }
                            onClick={() => handleSelect(conv)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}
