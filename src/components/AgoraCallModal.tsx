"use client";

import React, { useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useWebRTCCall } from "@/lib/hooks/useWebRTCCall";
import { useCallStore } from "@/lib/store";

interface CallModalProps {
    isOpen: boolean;
    onClose: () => void;
    channelName: string;
    mode: "video" | "audio";
    peerName: string;
    peerAvatar?: string;
    callerId: string;
    peerId: string;
}

function fmt(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export function AgoraCallModal({
    isOpen,
    onClose,
    channelName,
    mode,
    peerName,
    peerAvatar,
    callerId,
    peerId,
}: CallModalProps) {
    const { status } = useCallStore();
    const {
        localVideoRef,
        remoteVideoRef,
        isMuted,
        isCamOff,
        isSpeakerOff,
        toggleMute,
        toggleCam,
        toggleSpeaker,
        hangUp,
        startCall,
    } = useWebRTCCall();

    const [duration, setDuration] = React.useState(0);

    // Start call when modal opens
    useEffect(() => {
        if (!isOpen) return;
        startCall(channelName, mode, callerId, peerId).catch(console.error);
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Duration timer
    useEffect(() => {
        if (status !== "connected") return;
        const t = setInterval(() => setDuration((d) => d + 1), 1000);
        return () => clearInterval(t);
    }, [status]);

    const handleHangUp = async () => {
        await hangUp();
        onClose();
    };

    const isConnected = status === "connected";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

            <div className="relative w-full max-w-md mx-4 rounded-[32px] overflow-hidden bg-[#0c0c0c] border border-white/[0.06] shadow-[0_40px_120px_rgba(255,45,85,0.12)]">

                {mode === "video" ? (
                    <div className="relative w-full aspect-[9/16] max-h-[65vh] bg-[#0a0a0a]">
                        {/* Remote video fullscreen */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Waiting overlay */}
                        {!isConnected && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 bg-[#1a1a1a]">
                                    {peerAvatar
                                        ? <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30">{peerName[0]?.toUpperCase()}</div>
                                    }
                                </div>
                                <p className="text-white font-bold text-lg">{peerName}</p>
                                <p className="text-white/40 text-sm animate-pulse">
                                    {status === "calling" ? "Calling…" : "Connecting…"}
                                </p>
                            </div>
                        )}

                        {/* Duration badge */}
                        {isConnected && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                                <span className="text-white text-[13px] font-bold tabular-nums">{fmt(duration)}</span>
                            </div>
                        )}

                        {/* Local PiP */}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute bottom-4 right-4 w-28 h-40 rounded-2xl object-cover border-2 border-white/10 bg-[#111] shadow-xl"
                        />
                        {isCamOff && (
                            <div className="absolute bottom-4 right-4 w-28 h-40 rounded-2xl bg-[#111] border-2 border-white/10 flex items-center justify-center">
                                <VideoOff className="w-6 h-6 text-white/30" />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Audio-only */
                    <div className="flex flex-col items-center justify-center gap-5 py-16 px-8">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#ff3b5c]/30 bg-[#1a1a1a]">
                                {peerAvatar
                                    ? <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/30">{peerName[0]?.toUpperCase()}</div>
                                }
                            </div>
                            {isConnected && (
                                <span className="absolute inset-0 rounded-full border-2 border-[#ff3b5c]/40 animate-ping" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-xl">{peerName}</p>
                            <p className="text-white/40 text-sm mt-1">
                                {isConnected ? fmt(duration) : status === "calling" ? "Calling…" : "Connecting…"}
                            </p>
                        </div>
                        {/* Hidden audio element for remote stream */}
                        <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 px-6 py-6 bg-[#0c0c0c]">
                    <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isMuted ? "bg-white/10 border-white/10 text-white/50" : "bg-white/[0.06] border-white/[0.06] text-white hover:bg-white/10"}`}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleHangUp}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#a855f7] flex items-center justify-center shadow-[0_8px_30px_rgba(255,59,92,0.4)] hover:scale-105 active:scale-95 transition-transform"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>

                    {mode === "video" ? (
                        <button
                            onClick={toggleCam}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isCamOff ? "bg-white/10 border-white/10 text-white/50" : "bg-white/[0.06] border-white/[0.06] text-white hover:bg-white/10"}`}
                        >
                            {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </button>
                    ) : (
                        <button
                            onClick={toggleSpeaker}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isSpeakerOff ? "bg-white/10 border-white/10 text-white/50" : "bg-white/[0.06] border-white/[0.06] text-white hover:bg-white/10"}`}
                        >
                            {isSpeakerOff ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
