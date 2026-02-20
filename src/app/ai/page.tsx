"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { db } from "@/lib/firebase/config";
import {
    collection, addDoc, query, where, orderBy,
    onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, getDocs
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Send, Loader2, Sparkles, Plus, Trash2, MessageSquare, X, ChevronLeft
} from "lucide-react";

// ─── Gemini client ───
const genAI = new GoogleGenerativeAI("AIzaSyB0U3w6EuS-Te-GENa2Khr54xLSYgqRvJ8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ─── Types ───
interface Message {
    role: "user" | "model";
    text: string;
    createdAt?: any;
}

interface Conversation {
    id: string;
    title: string;
    uid: string;
    messages: Message[];
    createdAt?: any;
    updatedAt?: any;
}

// ─── Markdown-lite renderer ───
function renderText(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Inline code
        line = line.replace(/`([^`]+)`/g, "<code class=\"bg-white/10 px-1 rounded text-pink-300 text-[13px]\">$1</code>");
        // Bullet
        if (line.startsWith("- ") || line.startsWith("• ")) {
            return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: line.slice(2) }} />;
        }
        if (line.trim() === "") return <br key={i} />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />;
    });
}

export default function AIPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const activeConv = conversations.find((c) => c.id === activeId) ?? null;

    // ─── Load conversations ───
    useEffect(() => {
        if (!user?.uid) return;
        const q = query(
            collection(db, "ai_conversations"),
            where("uid", "==", user.uid),
            orderBy("updatedAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setConversations(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation)));
        });
        return unsub;
    }, [user?.uid]);

    // ─── Sync messages when active conv changes ───
    useEffect(() => {
        const conv = conversations.find((c) => c.id === activeId);
        setMessages(conv?.messages ?? []);
    }, [activeId, conversations]);

    // ─── Scroll to bottom ───
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // ─── New conversation ───
    const newConversation = useCallback(async () => {
        if (!user?.uid) return;
        const ref = await addDoc(collection(db, "ai_conversations"), {
            uid: user.uid,
            title: "New Chat",
            messages: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        setActiveId(ref.id);
        setMessages([]);
        inputRef.current?.focus();
    }, [user?.uid]);

    // ─── Delete conversation ───
    const deleteConversation = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteDoc(doc(db, "ai_conversations", id));
        if (activeId === id) {
            setActiveId(null);
            setMessages([]);
        }
    };

    // ─── Send message ───
    const send = async () => {
        const text = input.trim();
        if (!text || loading || !user?.uid) return;
        setInput("");

        let convId = activeId;

        // Create conversation if none active
        if (!convId) {
            const ref = await addDoc(collection(db, "ai_conversations"), {
                uid: user.uid,
                title: text.slice(0, 50),
                messages: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            convId = ref.id;
            setActiveId(convId);
        }

        const userMsg: Message = { role: "user", text };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setLoading(true);

        try {
            // Build Gemini chat history
            const history = messages.map((m) => ({
                role: m.role,
                parts: [{ text: m.text }],
            }));

            const chat = model.startChat({ history });
            const result = await chat.sendMessage(text);
            const responseText = result.response.text();

            const modelMsg: Message = { role: "model", text: responseText };
            const finalMessages = [...nextMessages, modelMsg];
            setMessages(finalMessages);

            // Auto-title from first message
            const isFirst = messages.length === 0;
            await updateDoc(doc(db, "ai_conversations", convId), {
                messages: finalMessages,
                updatedAt: serverTimestamp(),
                ...(isFirst ? { title: text.slice(0, 60) } : {}),
            });
        } catch (err: any) {
            console.error("Gemini error:", err?.message ?? err);
            const is429 = err?.message?.includes("429");
            const retryMatch = err?.message?.match(/(\d+\.?\d*)s/);
            const retrySec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
            const errText = is429
                ? `Rate limit reached.${retrySec ? ` Please wait ${retrySec} seconds and try again.` : " Please try again in a moment."}`
                : `Something went wrong. Please try again.`;
            const errMsg: Message = { role: "model", text: errText };
            setMessages([...nextMessages, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className="min-h-screen bg-[#111] text-white flex flex-col">
            <Navbar />

            <div className="flex flex-1 pt-16 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>

                {/* ── Sidebar ── */}
                <aside className={`${sidebarOpen ? "w-64" : "w-0"} flex-shrink-0 transition-all duration-200 overflow-hidden border-r border-white/[0.06] flex flex-col bg-[#111]`}>
                    <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-pink-400" />
                            <span className="text-[14px] font-semibold text-white">Velo AI</span>
                        </div>
                        <button
                            onClick={newConversation}
                            className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#FF2D55] to-[#a855f7] flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                        {conversations.length === 0 && (
                            <p className="text-[12px] text-white/25 text-center mt-8 px-4">No conversations yet</p>
                        )}
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveId(conv.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left group transition-colors ${
                                    activeId === conv.id
                                        ? "bg-gradient-to-r from-pink-500/15 to-purple-500/10 border-l-2 border-pink-500"
                                        : "hover:bg-white/[0.04] border-l-2 border-transparent"
                                }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                                <span className="text-[13px] text-white/70 flex-1 truncate">{conv.title}</span>
                                <button
                                    onClick={(e) => deleteConversation(conv.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Main chat area ── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Top bar */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
                        <button
                            onClick={() => setSidebarOpen((v) => !v)}
                            className="text-white/30 hover:text-white transition-colors"
                        >
                            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-white truncate">
                                {activeConv?.title ?? "New Chat"}
                            </span>
                        </div>
                        {activeConv && (
                            <button
                                onClick={() => { setActiveId(null); setMessages([]); }}
                                className="ml-auto text-white/25 hover:text-white/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-hide">
                        {messages.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF2D55] to-[#a855f7] flex items-center justify-center shadow-[0_0_40px_rgba(255,45,85,0.25)]">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-[22px] font-bold text-white">How can I help you?</p>
                                <p className="text-[14px] text-white/40">Ask me anything — I'm powered by Gemini.</p>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-w-md w-full">
                                    {[
                                        "Write a caption for my next post",
                                        "Give me content ideas for this week",
                                        "How do I grow my audience?",
                                        "Draft a message to my subscribers",
                                    ].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                            className="text-left px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-[13px] text-white/60 hover:border-pink-500/30 hover:text-white/80 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "model" && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF2D55] to-[#a855f7] flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed space-y-1 ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white rounded-br-sm"
                                        : "bg-white/[0.06] text-white/85 rounded-bl-sm"
                                }`}>
                                    {renderText(msg.text)}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF2D55] to-[#a855f7] flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="flex-shrink-0 px-4 pb-5 pt-2">
                        <div className="flex items-end gap-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-pink-500/40 transition-colors">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Message Velo AI…"
                                rows={1}
                                style={{ resize: "none", maxHeight: "160px", overflowY: "auto" }}
                                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/25 outline-none leading-relaxed scrollbar-hide"
                                onInput={(e) => {
                                    const t = e.currentTarget;
                                    t.style.height = "auto";
                                    t.style.height = `${t.scrollHeight}px`;
                                }}
                            />
                            <button
                                onClick={send}
                                disabled={!input.trim() || loading}
                                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#a855f7] flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    : <Send className="w-4 h-4 text-white" />
                                }
                            </button>
                        </div>
                        <p className="text-[11px] text-white/20 text-center mt-2">Powered by Gemini · Conversations saved to your account</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
