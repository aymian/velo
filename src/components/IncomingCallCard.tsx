"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/lib/store";

interface IncomingCall {
    callId: string;
    callType: "video" | "audio";
    callerName: string;
    callerAvatar?: string;
    callerId: string;
    conversationId: string;
}

interface IncomingCallCardProps {
    onAccept: (call: IncomingCall) => void;
}

export function IncomingCallCard({ onAccept }: IncomingCallCardProps) {
    const { user } = useAuthStore();
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [pulse, setPulse] = useState(true);

    // Listen for incoming call signals in Firestore
    useEffect(() => {
        if (!user?.uid) return;

        const signalRef = doc(db, "callSignals", user.uid);
        const unsubscribe = onSnapshot(signalRef, (snap) => {
            if (!snap.exists()) return;
            const data = snap.data();

            // Only show if status is "ringing" and it's not from us
            if (data?.status === "ringing" && data?.callerId !== user.uid) {
                setIncomingCall({
                    callId: data.callId,
                    callType: data.callType || "audio",
                    callerName: data.callerName || "Someone",
                    callerAvatar: data.callerAvatar,
                    callerId: data.callerId,
                    conversationId: data.conversationId,
                });
            } else {
                setIncomingCall(null);
            }
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Pulse animation
    useEffect(() => {
        const t = setInterval(() => setPulse(p => !p), 1200);
        return () => clearInterval(t);
    }, []);

    const handleAccept = async () => {
        if (!incomingCall || !user?.uid) return;
        try {
            await updateDoc(doc(db, "callSignals", user.uid), {
                status: "accepted",
                answeredAt: serverTimestamp(),
            });
        } catch { }
        onAccept(incomingCall);
        setIncomingCall(null);
    };

    const handleDecline = async () => {
        if (!incomingCall || !user?.uid) return;
        try {
            await updateDoc(doc(db, "callSignals", user.uid), {
                status: "declined",
                declinedAt: serverTimestamp(),
            });
        } catch { }
        setIncomingCall(null);
    };

    return (
        <AnimatePresence>
            {incomingCall && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Card */}
                    <div className="fixed inset-0 z-[301] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 20 }}
                            transition={{ type: "spring", stiffness: 320, damping: 26 }}
                            className="w-full max-w-[340px] bg-[#111] border border-white/[0.06] rounded-[2.5rem] p-8 flex flex-col items-center gap-8 shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                        >
                            {/* Call type badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] rounded-full border border-white/[0.06]">
                                {incomingCall.callType === "video"
                                    ? <Video className="w-3.5 h-3.5 text-[#a855f7]" />
                                    : <Phone className="w-3.5 h-3.5 text-[#ff3b5c]" />
                                }
                                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                                    Incoming {incomingCall.callType} call
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                                {/* Ripple rings */}
                                <div className="absolute inset-[-16px] rounded-full border border-white/[0.05] animate-ping" style={{ animationDuration: "2s" }} />
                                <div className="absolute inset-[-8px] rounded-full border border-white/[0.08] animate-ping" style={{ animationDuration: "2s", animationDelay: "0.4s" }} />

                                <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white/10 bg-[#1a1a1a] shadow-2xl relative z-10">
                                    {incomingCall.callerAvatar
                                        ? <img src={incomingCall.callerAvatar} alt={incomingCall.callerName} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30">
                                            {incomingCall.callerName[0]?.toUpperCase()}
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* Name */}
                            <div className="text-center -mt-2">
                                <p className="text-white font-bold text-2xl tracking-tight">{incomingCall.callerName}</p>
                                <motion.p
                                    animate={{ opacity: pulse ? 1 : 0.3 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="text-white/40 text-[13px] font-medium mt-1.5"
                                >
                                    {incomingCall.callType === "video" ? "Wants to video call" : "Calling you…"}
                                </motion.p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-center gap-10 w-full">
                                {/* Decline */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleDecline}
                                        className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/[0.07] flex items-center justify-center hover:bg-[#ff3b5c]/10 hover:border-[#ff3b5c]/20 transition-all active:scale-95"
                                    >
                                        <PhoneOff className="w-6 h-6 text-[#ff3b5c]" />
                                    </button>
                                    <span className="text-[11px] text-white/30 font-medium">Decline</span>
                                </div>

                                {/* Accept */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleAccept}
                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#30d158] to-[#34c759] flex items-center justify-center shadow-[0_8px_30px_rgba(48,209,88,0.35)] hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        {incomingCall.callType === "video"
                                            ? <Video className="w-6 h-6 text-white" />
                                            : <Phone className="w-6 h-6 text-white" />
                                        }
                                    </button>
                                    <span className="text-[11px] text-white/30 font-medium">Accept</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
