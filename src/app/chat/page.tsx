"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    MoreHorizontal,
    Plus,
    Smile,
    CheckCircle2,
    ChevronLeft,
    Image as ImageIcon,
    FileText,
    CheckCheck,
    Send,
    Phone,
    Video,
    Lock
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AgoraCallModal } from "@/components/AgoraCallModal";
import { Navbar } from "@/components/Navbar";
import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { FeatureGate } from "@/components/ui/FeatureGate";
import { useMessageLimit } from "@/hooks/useMessageLimit";
import { db } from "@/lib/firebase/config";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { COLLECTIONS, User as UserType } from "@/lib/firebase/collections";
import { useAuthStore } from "@/lib/store";

interface ConversationDoc {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageAt?: any;
    lastSenderId?: string | null;
    typing?: Record<string, boolean>;
    lastSeenAt?: Record<string, any>;
}

interface ChatMessage {
    id: string;
    senderId: string;
    text?: string;
    type: "text" | "image" | "file";
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    createdAt?: any;
    isDeleted?: boolean;
    deletedAt?: any;
    editedAt?: any;
    replyToMessageId?: string;
    replyToText?: string | null;
    replyToType?: "text" | "image" | "file";
    replyToSenderId?: string;
}

function formatTime(value: any) {
    if (!value) return "";
    try {
        const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");

    const { user: currentUser } = useAuthStore();

    const [user, setUser] = useState<UserType | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [conversation, setConversation] = useState<ConversationDoc | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [openMenuMessageId, setOpenMenuMessageId] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [callMode, setCallMode] = useState<"video" | "audio" | null>(null);
    const { isOverLimit, checkAndIncrement } = useMessageLimit();

    useEffect(() => {
        const fetchUser = async () => {
            if (!uid) {
                setIsLoadingUser(false);
                return;
            }
            try {
                const refUser = doc(db, COLLECTIONS.USERS, uid);
                const snap = await getDoc(refUser);
                if (snap.exists()) {
                    setUser(snap.data() as UserType);
                }
            } catch (e) {
                console.error("Error loading chat user", e);
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUser();
    }, [uid]);

    useEffect(() => {
        if (!uid || !currentUser?.uid) return;

        const id = [currentUser.uid, uid].sort().join("_");
        setConversationId(id);

        const conversationRef = doc(db, "conversations", id);

        const ensureConversation = async () => {
            try {
                const snap = await getDoc(conversationRef);
                if (!snap.exists()) {
                    await setDoc(conversationRef, {
                        participants: [currentUser.uid, uid],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        lastMessage: "",
                        lastMessageAt: serverTimestamp(),
                        lastSenderId: null,
                        typing: {
                            [currentUser.uid]: false,
                            [uid]: false
                        },
                        lastSeenAt: {}
                    });
                }
            } catch (e) {
                console.error("Error ensuring conversation", e);
            }
        };

        ensureConversation();

        const unsubscribe = onSnapshot(conversationRef, (snap) => {
            if (snap.exists()) {
                setConversation({
                    id: snap.id,
                    ...(snap.data() as any)
                });
            }
        });

        return () => unsubscribe();
    }, [uid, currentUser?.uid]);

    useEffect(() => {
        if (!conversationId) return;

        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: ChatMessage[] = [];
            snapshot.forEach((docSnap) => {
                items.push({
                    id: docSnap.id,
                    ...(docSnap.data() as any)
                });
            });
            setMessages(items);
        });

        return () => unsubscribe();
    }, [conversationId]);

    useEffect(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    useEffect(() => {
        if (!conversationId || !currentUser?.uid) return;
        if (!messages.length) return;

        const conversationRef = doc(db, "conversations", conversationId);
        updateDoc(conversationRef, {
            [`lastSeenAt.${currentUser.uid}`]: serverTimestamp(),
            updatedAt: serverTimestamp()
        }).catch((e) => console.error("Error updating last seen", e));
    }, [messages.length, conversationId, currentUser?.uid]);

    const displayName = user?.displayName || user?.username || "User";
    const handle = user?.username || user?.email?.split("@")[0] || "user";
    const avatar =
        user?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=333&color=fff`;

    const showEmptyState =
        !uid || (!user && !isLoadingUser) || !currentUser?.uid;

    const otherTyping =
        !!conversation &&
        !!uid &&
        !!conversation.typing &&
        !!conversation.typing[uid];

    const lastOutgoingMessage = messages
        .filter((m) => m.senderId === currentUser?.uid)
        .slice(-1)[0];

    const lastSeenForOther =
        uid && conversation?.lastSeenAt ? conversation.lastSeenAt[uid] : null;

    const isLastMessageSeen =
        !!lastOutgoingMessage &&
        conversation?.lastSenderId === currentUser?.uid &&
        conversation?.lastMessageAt &&
        lastSeenForOther &&
        typeof lastSeenForOther.toMillis === "function" &&
        typeof conversation.lastMessageAt.toMillis === "function" &&
        lastSeenForOther.toMillis() >= conversation.lastMessageAt.toMillis();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (!conversationId || !currentUser?.uid) return;

        const conversationRef = doc(db, "conversations", conversationId);

        updateDoc(conversationRef, {
            [`typing.${currentUser.uid}`]: value.length > 0
        }).catch(() => { });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            updateDoc(conversationRef, {
                [`typing.${currentUser.uid}`]: false
            }).catch(() => { });
        }, 2000);
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (!conversationId || !currentUser?.uid) return;

        setIsSending(true);

        // Check daily limit
        const { allowed } = await checkAndIncrement();
        if (!allowed) {
            setIsSending(false);
            router.push("/premium?reason=limit");
            return;
        }

        try {
            const conversationRef = doc(db, "conversations", conversationId);

            if (editingMessageId) {
                const messageRef = doc(
                    db,
                    "conversations",
                    conversationId,
                    "messages",
                    editingMessageId
                );

                await updateDoc(messageRef, {
                    text: trimmed,
                    editedAt: serverTimestamp()
                });

                await updateDoc(conversationRef, {
                    lastMessage: trimmed,
                    lastMessageAt: serverTimestamp(),
                    lastSenderId: currentUser.uid,
                    updatedAt: serverTimestamp(),
                    [`typing.${currentUser.uid}`]: false
                });

                setEditingMessageId(null);
                setReplyTo(null);
                setInput("");
                return;
            }

            const messagesRef = collection(
                db,
                "conversations",
                conversationId,
                "messages"
            );

            await addDoc(messagesRef, {
                senderId: currentUser.uid,
                text: trimmed,
                type: "text",
                createdAt: serverTimestamp(),
                replyToMessageId: replyTo?.id ?? null,
                replyToText: replyTo?.text ?? null,
                replyToType: replyTo?.type ?? null,
                replyToSenderId: replyTo?.senderId ?? null
            });

            await updateDoc(conversationRef, {
                lastMessage: trimmed,
                lastMessageAt: serverTimestamp(),
                lastSenderId: currentUser.uid,
                updatedAt: serverTimestamp(),
                [`typing.${currentUser.uid}`]: false
            });

            setReplyTo(null);
            setInput("");
        } catch (e) {
            console.error("Error sending message", e);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAttachClick = () => {
        if (!conversationId || !currentUser?.uid) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (!conversationId || !currentUser?.uid) return;

        const file = files[0];
        setIsUploadingFile(true);

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) {
                throw new Error("Cloudinary not configured");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
            );

            const axios = (await import("axios")).default;

            const type: ChatMessage["type"] = file.type.startsWith("image/")
                ? "image"
                : "file";

            const resourceType = type === "image" ? "image" : "raw";

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                formData
            );

            const url: string | undefined = response.data?.secure_url;
            if (!url) {
                throw new Error("No secure_url returned from Cloudinary");
            }

            const messagesRef = collection(
                db,
                "conversations",
                conversationId,
                "messages"
            );

            const label =
                type === "image"
                    ? "Photo"
                    : file.name.length > 30
                        ? `${file.name.slice(0, 27)}...`
                        : file.name;

            await addDoc(messagesRef, {
                senderId: currentUser.uid,
                text: null,
                type,
                fileUrl: url,
                fileName: file.name,
                fileType: file.type,
                createdAt: serverTimestamp()
            });

            const conversationRef = doc(db, "conversations", conversationId);

            await updateDoc(conversationRef, {
                lastMessage: `[${label}]`,
                lastMessageAt: serverTimestamp(),
                lastSenderId: currentUser.uid,
                updatedAt: serverTimestamp()
            });
        } catch (e: any) {
            console.error(
                "Error uploading chat file to Cloudinary",
                e?.response?.data || e?.message || e
            );
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const callChannelName = conversationId ?? [currentUser?.uid, uid].filter(Boolean).sort().join("_");

    const handleEmojiSelect = (emoji: any) => {
        const value = emoji?.native || "";
        if (!value) return;
        setInput((prev) => `${prev}${value}`);
        setIsEmojiOpen(false);
    };

    const handleUnsend = async (message: ChatMessage) => {
        if (!conversationId || !currentUser?.uid) return;
        if (message.senderId !== currentUser.uid) return;

        try {
            const messageRef = doc(
                db,
                "conversations",
                conversationId,
                "messages",
                message.id
            );

            await updateDoc(messageRef, {
                text: "",
                fileUrl: null,
                fileName: null,
                fileType: null,
                isDeleted: true,
                deletedAt: serverTimestamp()
            });

            const conversationRef = doc(db, "conversations", conversationId);
            await updateDoc(conversationRef, {
                lastMessage: "Message unsent",
                lastMessageAt: serverTimestamp(),
                lastSenderId: currentUser.uid,
                updatedAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Error unsending message", e);
        }
    };

    if (!currentUser?.uid) {
        return (
            <main className="min-h-screen bg-black text-white selection:bg-[#FF2D55]">
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="pt-16 flex flex-col min-h-screen max-w-2xl mx-auto border-x border-white/10 w-full">
                        <div className="flex-1 flex items-center justify-center px-6">
                            <div className="text-center space-y-3">
                                <h1 className="text-xl font-bold">
                                    Sign in to start chatting
                                </h1>
                                <p className="text-sm text-white/40 max-w-xs mx-auto">
                                    You need an account to send messages, files, and images.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-[#FF2D55]">
            {callMode && currentUser?.uid && uid && (
                <AgoraCallModal
                    isOpen={!!callMode}
                    onClose={() => setCallMode(null)}
                    channelName={callChannelName}
                    mode={callMode}
                    peerName={displayName}
                    peerAvatar={user?.photoURL ?? undefined}
                    callerId={currentUser.uid}
                    peerId={uid}
                />
            )}

            <div className="flex flex-col min-h-screen">
                <Navbar />

                <div className="flex flex-1 pt-16">
                    <ConversationsSidebar />

                    <div className="relative flex flex-col flex-1 overflow-hidden border-x border-white/[0.06] max-w-2xl w-full mx-auto">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06] bg-[#0d0d0d] sticky top-0 z-20">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="relative">
                                    <img
                                        src={avatar}
                                        alt={displayName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-lg">
                                            {isLoadingUser ? "Loading..." : displayName}
                                        </span>
                                        <CheckCircle2 className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55] stroke-black" />
                                    </div>
                                    {otherTyping && (
                                        <span className="text-xs text-white/50 mt-0.5">
                                            Typing...
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FeatureGate feature="hdStreaming">
                                    <button
                                        onClick={() => setCallMode("audio")}
                                        disabled={!uid || showEmptyState}
                                        className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-[#ff3b5c]/10 hover:border-[#ff3b5c]/20 text-white/50 hover:text-[#ff3b5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Phone className="w-4.5 h-4.5" strokeWidth={1.8} />
                                    </button>
                                </FeatureGate>
                                <FeatureGate feature="hdStreaming">
                                    <button
                                        onClick={() => setCallMode("video")}
                                        disabled={!uid || showEmptyState}
                                        className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-[#a855f7]/10 hover:border-[#a855f7]/20 text-white/50 hover:text-[#a855f7] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Video className="w-4.5 h-4.5" strokeWidth={1.8} />
                                    </button>
                                </FeatureGate>
                                <button className="p-2 hover:bg-white/10 rounded-full transition-all border border-white/10">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 custom-scrollbar">
                            {showEmptyState ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-xl font-bold">
                                        Chat
                                    </div>
                                    <h2 className="text-xl font-bold">Select someone to chat with</h2>
                                    <p className="text-sm text-white/40 max-w-xs">
                                        Open the chat bubble and choose a user to start a conversation.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center text-center mb-10">
                                        <div className="w-20 h-20 rounded-full bg-black border border-white/10 p-1.5 mb-4">
                                            <img
                                                src={avatar}
                                                alt={displayName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <span className="font-bold text-xl">
                                                {displayName}
                                            </span>
                                            <CheckCircle2 className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55] stroke-black" />
                                        </div>
                                        <span className="text-white/50 text-[15px] mb-4">
                                            @{handle}
                                        </span>
                                        <button className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-[15px]">
                                            View Profile
                                        </button>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                            Today
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {messages.map((message) => {
                                            const isOwn =
                                                message.senderId === currentUser.uid;
                                            const isImage = message.type === "image";
                                            const isFile = message.type === "file";
                                            const isDeleted = !!message.isDeleted;
                                            const canEdit = message.type === "text" && !isDeleted && !!message.text;

                                            let touchStartX = 0;
                                            let touchStartY = 0;

                                            const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
                                                const touch = e.touches[0];
                                                touchStartX = touch.clientX;
                                                touchStartY = touch.clientY;
                                            };

                                            const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
                                                const touch = e.changedTouches[0];
                                                const deltaX = touch.clientX - touchStartX;
                                                const deltaY = Math.abs(touch.clientY - touchStartY);

                                                if (deltaX > 40 && deltaY < 30 && !isDeleted) {
                                                    setReplyTo(message);
                                                    setEditingMessageId(null);
                                                    setOpenMenuMessageId(null);
                                                }
                                            };

                                            return (
                                                <div
                                                    key={message.id}
                                                    onTouchStart={handleTouchStart}
                                                    onTouchEnd={handleTouchEnd}
                                                    className={`flex flex-col gap-1 ${isOwn
                                                        ? "items-end"
                                                        : "items-start"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 max-w-[85%]">
                                                        {!isOwn && (
                                                            <button
                                                                onClick={() => {
                                                                    if (!isDeleted) {
                                                                        setReplyTo(message);
                                                                        setEditingMessageId(null);
                                                                        setOpenMenuMessageId(null);
                                                                    }
                                                                }}
                                                                className="hidden sm:flex p-1 text-white/30 hover:text-white transition-colors"
                                                            >
                                                                <ChevronLeft className="w-4 h-4 rotate-180" />
                                                            </button>
                                                        )}
                                                        <div
                                                            className={`px-4 py-2.5 rounded-[1.5rem] max-w-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] ${isOwn
                                                                ? "bg-gradient-to-r from-[#FF2D55] to-[#7c4dff] rounded-tr-none"
                                                                : "bg-[#202327] rounded-tl-none"
                                                                }`}
                                                        >
                                                            {message.replyToMessageId && !isDeleted && (
                                                                <div className={`mb-2 rounded-xl px-3 py-1.5 text-[11px] ${isOwn ? "bg-white/10" : "bg-black/30"
                                                                    }`}>
                                                                    <span className="block text-white/60">
                                                                        Replying to {message.replyToSenderId === currentUser.uid ? "you" : "them"}
                                                                    </span>
                                                                    {message.replyToType === "text" && message.replyToText && (
                                                                        <span className="block text-white/80 text-[11px] max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                            {message.replyToText}
                                                                        </span>
                                                                    )}
                                                                    {message.replyToType === "image" && (
                                                                        <span className="block text-white/80">
                                                                            Photo
                                                                        </span>
                                                                    )}
                                                                    {message.replyToType === "file" && (
                                                                        <span className="block text-white/80">
                                                                            File
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {isDeleted ? (
                                                                <>
                                                                    <span className="text-[13px] text-white/60 italic">
                                                                        {isOwn ? "You unsent a message" : "This message was unsent"}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 mt-1 opacity-70 text-[11px]">
                                                                        <span>
                                                                            {formatTime(message.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {isImage && message.fileUrl && (
                                                                        <div className="overflow-hidden rounded-2xl border border-white/10">
                                                                            <img
                                                                                src={message.fileUrl}
                                                                                alt={
                                                                                    message.fileName ||
                                                                                    "Image"
                                                                                }
                                                                                className="max-h-64 w-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {isFile && message.fileUrl && (
                                                                        <a
                                                                            href={message.fileUrl}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="flex items-center gap-3 text-sm"
                                                                        >
                                                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/20">
                                                                                <FileText className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="font-semibold break-all">
                                                                                    {message.fileName}
                                                                                </span>
                                                                                <span className="text-xs opacity-60">
                                                                                    Tap to open file
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    )}

                                                                    {!isImage && !isFile && message.text && (
                                                                        <span className="text-[15px] font-medium">
                                                                            {message.text}
                                                                        </span>
                                                                    )}

                                                                    <div className="flex items-center gap-2 mt-1 opacity-70 text-[11px]">
                                                                        <span>
                                                                            {formatTime(message.createdAt)}
                                                                        </span>
                                                                        {message.editedAt && (
                                                                            <span className="text-white/80">
                                                                                Edited
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {isOwn && !isDeleted && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() =>
                                                                        setOpenMenuMessageId(
                                                                            openMenuMessageId === message.id ? null : message.id
                                                                        )
                                                                    }
                                                                    className="p-1 text-white/40 hover:text-white transition-colors"
                                                                >
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </button>
                                                                {openMenuMessageId === message.id && (
                                                                    <div className="absolute right-0 mt-1 w-32 rounded-xl bg-[#111] border border-white/10 shadow-xl overflow-hidden z-30">
                                                                        <button
                                                                            disabled={!canEdit}
                                                                            onClick={() => {
                                                                                if (!canEdit) return;
                                                                                setEditingMessageId(message.id);
                                                                                setInput(message.text || "");
                                                                                setReplyTo(null);
                                                                                setOpenMenuMessageId(null);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 text-[12px] ${canEdit
                                                                                ? "text-white hover:bg-white/5"
                                                                                : "text-white/30 cursor-not-allowed"
                                                                                }`}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleUnsend(message);
                                                                                setOpenMenuMessageId(null);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-[12px] text-[#ff8a9e] hover:bg-[#ff2d55]/10"
                                                                        >
                                                                            Unsend
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {isOwn &&
                                                        lastOutgoingMessage &&
                                                        message.id ===
                                                        lastOutgoingMessage.id &&
                                                        !isDeleted && (
                                                            <div className="flex items-center gap-1 text-[11px] pr-1">
                                                                {isLastMessageSeen ? (
                                                                    <>
                                                                        <CheckCheck className="w-3.5 h-3.5 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D55] to-[#7c4dff]" />
                                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF2D55] to-[#7c4dff]">
                                                                            Seen
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-white/40">
                                                                        Sent
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })}

                                        {otherTyping && (
                                            <div className="flex items-center gap-2 text-xs text-white/50">
                                                <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                                                <span>Typing...</span>
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>
                                </>
                            )}
                        </div>

                        {replyTo && (
                            <div className="px-3 pb-2 border-t border-white/[0.06] bg-[#0d0d0d] w-full">
                                <div className="flex items-start justify-between gap-2 rounded-2xl bg-white/[0.04] px-3 py-2">
                                    <div className="text-[11px]">
                                        <div className="text-[#FF2D55] font-semibold mb-0.5">
                                            Replying to{" "}
                                            {replyTo.senderId === currentUser.uid ? "yourself" : displayName}
                                        </div>
                                        <div className="text-white/70 text-[11px] max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {replyTo.type === "text" && replyTo.text}
                                            {replyTo.type === "image" && "Photo"}
                                            {replyTo.type === "file" && (replyTo.fileName || "File")}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setReplyTo(null)}
                                        className="text-white/40 hover:text-white text-xs px-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {isEmojiOpen && (
                            <div className="absolute bottom-[76px] right-3 z-30">
                                <Picker
                                    data={data}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="dark"
                                    previewPosition="none"
                                    navPosition="top"
                                />
                            </div>
                        )}

                        <div className="px-3 py-3 border-t border-white/[0.06] bg-[#0d0d0d] w-full">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    <FeatureGate feature="canSendFiles">
                                        <button
                                            onClick={handleAttachClick}
                                            className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all"
                                            disabled={isUploadingFile}
                                        >
                                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                                        </button>
                                    </FeatureGate>
                                    <button className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all">
                                        <div className="w-5 h-5 border-[1.5px] border-current rounded flex items-center justify-center text-[10px] font-black">
                                            GIF
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEmojiOpen((open) => !open)}
                                        className="p-2.5 text-[#FF2D55] hover:bg-[#FF2D55]/10 rounded-full transition-all"
                                    >
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Unencrypted message"
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSending || showEmptyState}
                                        className="w-full bg-[#202327] border-none rounded-3xl py-3 px-5 text-[15px] text-white placeholder:text-white/40 outline-none focus:ring-0 disabled:opacity-60"
                                    />
                                    {(isSending || isUploadingFile) && (
                                        <div className="absolute right-4 inset-y-0 flex items-center">
                                            <div className="w-3 h-3 rounded-full border border-white/40 border-t-transparent animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isSending || isUploadingFile || showEmptyState || !input.trim()}
                                    className="p-3 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#7c4dff] shadow-[0_10px_30px_rgba(0,0,0,0.6)] disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95"
                                >
                                    <Send className="w-5 h-5 -rotate-12" />
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
