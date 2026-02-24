"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    SpeakerLayout,
    StreamTheme,
    useCallStateHooks,
    CallingState,
    User,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STREAM_CONFIG } from "@/lib/stream/config";

interface StreamCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    callId: string;
    mode: "video" | "audio";
    peerName: string;
    peerAvatar?: string;
    currentUserId: string;
    currentUserName: string;
    currentUserAvatar?: string;
    /** Peer's UID — only required when isCallee is false (caller side) */
    peerId?: string;
    /** Set to true for the user who accepted an incoming call (skips getOrCreate) */
    isCallee?: boolean;
}

// ─── Inner UI (must live inside <StreamCall>) ─────────────────────────────────
function ActiveCallUI({
    mode,
    peerName,
    peerAvatar,
    onClose,
}: {
    mode: "video" | "audio";
    peerName: string;
    peerAvatar?: string;
    onClose: () => void;
}) {
    const { useCallCallingState, useMicrophoneState, useCameraState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const { isMute: isMicMuted, microphone } = useMicrophoneState();
    const { isMute: isCamOff, camera } = useCameraState();

    const [duration, setDuration] = useState(0);
    const isConnected = callingState === CallingState.JOINED;
    const isConnecting =
        callingState === CallingState.JOINING ||
        callingState === CallingState.RINGING;

    useEffect(() => {
        if (!isConnected) return;
        const t = setInterval(() => setDuration((d) => d + 1), 1000);
        return () => clearInterval(t);
    }, [isConnected]);

    // Auto-close if the call ends on Stream's side
    useEffect(() => {
        if (callingState === CallingState.LEFT || callingState === CallingState.IDLE) {
            onClose();
        }
    }, [callingState, onClose]);

    const fmt = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
            .toString()
            .padStart(2, "0")}`;

    const statusLabel = isConnected
        ? fmt(duration)
        : isConnecting
            ? "Connecting…"
            : "Calling…";

    // ─── Audio-only layout ────────────────────────────────────────────────────
    if (mode === "audio") {
        return (
            <div className="flex flex-col items-center justify-between h-full py-12 px-8">
                <div className="flex flex-col items-center gap-5 mt-6">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/[0.08] bg-[#1a1a1a] shadow-2xl">
                            {peerAvatar ? (
                                <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/30">
                                    {peerName[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        {isConnected && (
                            <>
                                <span className="absolute inset-0 rounded-full border-2 border-[#ff3b5c]/30 animate-ping" />
                                <span
                                    className="absolute inset-[-8px] rounded-full border border-[#ff3b5c]/15 animate-ping"
                                    style={{ animationDelay: "0.5s" }}
                                />
                            </>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-2xl tracking-tight">{peerName}</p>
                        <p className="text-white/40 text-sm mt-2 font-medium">{statusLabel}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={() => microphone.toggle()}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isMicMuted
                                ? "bg-white/10 border-white/10 text-white/50"
                                : "bg-white/[0.06] border-white/[0.06] text-white hover:bg-white/10"
                            }`}
                    >
                        {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#a855f7] flex items-center justify-center shadow-[0_8px_30px_rgba(255,59,92,0.4)] hover:scale-105 active:scale-95 transition-transform"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>

                    <button className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.06] text-white hover:bg-white/10 flex items-center justify-center transition-all">
                        <Volume2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // ─── Video layout ─────────────────────────────────────────────────────────
    return (
        <div className="relative w-full h-full">
            <StreamTheme>
                <SpeakerLayout participantsBarPosition="bottom" />
            </StreamTheme>

            {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]/95 z-10">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 bg-[#1a1a1a]">
                        {peerAvatar ? (
                            <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30">
                                {peerName[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <p className="text-white font-bold text-lg">{peerName}</p>
                    <p className="text-white/40 text-sm animate-pulse">{statusLabel}</p>
                </div>
            )}

            {isConnected && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 z-20">
                    <span className="text-white text-[13px] font-bold tabular-nums">{fmt(duration)}</span>
                </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-5">
                <button
                    onClick={() => microphone.toggle()}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${isMicMuted
                            ? "bg-white/20 border-white/20 text-white/60"
                            : "bg-black/60 border-white/10 text-white backdrop-blur-sm"
                        }`}
                >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                    onClick={onClose}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#a855f7] flex items-center justify-center shadow-[0_8px_30px_rgba(255,59,92,0.4)] hover:scale-105 active:scale-95 transition-transform"
                >
                    <PhoneOff className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={() => camera.toggle()}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${isCamOff
                            ? "bg-white/20 border-white/20 text-white/60"
                            : "bg-black/60 border-white/10 text-white backdrop-blur-sm"
                        }`}
                >
                    {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function StreamCallModal({
    isOpen,
    onClose,
    callId,
    mode,
    peerName,
    peerAvatar,
    currentUserId,
    currentUserName,
    currentUserAvatar,
    peerId,
    isCallee = false,
}: StreamCallModalProps) {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !currentUserId) return;

        let mounted = true;
        let streamClient: StreamVideoClient | null = null;

        const init = async () => {
            try {
                // 1. Get a short-lived token from our server
                const res = await fetch("/api/stream-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUserId }),
                });
                if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
                const { token } = await res.json();

                // 2. Create Stream client
                const user: User = {
                    id: currentUserId,
                    name: currentUserName,
                    image: currentUserAvatar || "",
                };
                streamClient = new StreamVideoClient({
                    apiKey: STREAM_CONFIG.apiKey,
                    user,
                    token,
                });

                if (!mounted) return;

                const streamCall = streamClient.call("default", callId);

                // Prepare members array - both sides should have both members
                const members: { user_id: string }[] = [{ user_id: currentUserId }];
                if (peerId && peerId.trim()) {
                    members.push({ user_id: peerId.trim() });
                } else if (!isCallee) {
                    // Caller side MUST have a peerId
                    throw new Error("peerId is required to start a call");
                }

                if (isCallee) {
                    // ─ Recipient: the call already exists ─────
                    // We call getOrCreate just to be safe and ensure members are synced
                    await streamCall.getOrCreate({
                        data: { members },
                    });

                    // Explicitly accept the ringing call
                    try {
                        await streamCall.accept();
                    } catch (acceptErr) {
                        console.warn("Accept failed, might already be accepted:", acceptErr);
                    }
                } else {
                    // ─ Caller: create the call, add both users as members, ring ─
                    await streamCall.getOrCreate({
                        ring: true,
                        data: { members },
                    });
                }

                // Both sides finally join
                await streamCall.join();

                if (!mounted) return;
                setClient(streamClient);
                setCall(streamCall);
                setIsReady(true);
            } catch (e: any) {
                console.error("Stream init error:", e);
                if (mounted) setError(e?.message ?? String(e));
            }
        };

        init();

        return () => {
            mounted = false;
            if (streamClient) streamClient.disconnectUser().catch(console.error);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, currentUserId, isCallee, callId]);

    const handleClose = useCallback(async () => {
        if (call) { try { await call.leave(); } catch { } }
        if (client) { try { await client.disconnectUser(); } catch { } }
        setClient(null);
        setCall(null);
        setIsReady(false);
        setError(null);
        onClose();
    }, [call, client, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`relative mx-4 rounded-[32px] overflow-hidden bg-[#0c0c0c] border border-white/[0.06] shadow-[0_40px_120px_rgba(255,45,85,0.12)] ${mode === "video"
                            ? "w-full max-w-md aspect-[9/16] max-h-[82vh]"
                            : "w-full max-w-sm"
                        }`}
                >
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 gap-4 px-8 text-center">
                            <p className="text-white/40 text-sm">Call error</p>
                            <p className="text-white/20 text-xs font-mono break-all">{error}</p>
                            <button
                                onClick={handleClose}
                                className="mt-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    ) : !isReady ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6 px-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/[0.08] bg-[#1a1a1a]">
                                    {peerAvatar ? (
                                        <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30">
                                            {peerName[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute inset-0 rounded-full border-2 border-[#ff3b5c]/30 animate-ping" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold text-xl">{peerName}</p>
                                <p className="text-white/40 text-sm mt-1.5 animate-pulse">
                                    {isCallee ? "Joining call…" : mode === "video" ? "Starting video call…" : "Calling…"}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#a855f7] flex items-center justify-center shadow-[0_8px_30px_rgba(255,59,92,0.3)] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <PhoneOff className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    ) : (
                        <StreamVideo client={client!}>
                            <StreamCall call={call!}>
                                <ActiveCallUI
                                    mode={mode}
                                    peerName={peerName}
                                    peerAvatar={peerAvatar}
                                    onClose={handleClose}
                                />
                            </StreamCall>
                        </StreamVideo>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
