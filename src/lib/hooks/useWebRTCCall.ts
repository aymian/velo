"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
    doc,
    collection,
    setDoc,
    getDoc,
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useCallStore } from "@/lib/store";

// Public STUN servers — fast, no account needed
const ICE_SERVERS: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
];

export interface UseWebRTCCallReturn {
    localVideoRef: React.RefObject<HTMLVideoElement | null>;
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
    isMuted: boolean;
    isCamOff: boolean;
    isSpeakerOff: boolean;
    toggleMute: () => void;
    toggleCam: () => void;
    toggleSpeaker: () => void;
    hangUp: () => Promise<void>;
    startCall: (channelId: string, mode: "video" | "audio", callerId: string, peerId: string) => Promise<void>;
    answerCall: (channelId: string, mode: "video" | "audio") => Promise<void>;
}

export function useWebRTCCall(): UseWebRTCCallReturn {
    const { setStatus, endCall } = useCallStore();

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const unsubOfferRef = useRef<(() => void) | null>(null);
    const unsubAnswerRef = useRef<(() => void) | null>(null);
    const unsubIceRef = useRef<(() => void) | null>(null);
    const channelIdRef = useRef<string | null>(null);

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [isSpeakerOff, setIsSpeakerOff] = useState(false);

    // ── Cleanup everything ──────────────────────────────────────────────────
    const cleanup = useCallback(async () => {
        unsubOfferRef.current?.();
        unsubAnswerRef.current?.();
        unsubIceRef.current?.();

        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        remoteStreamRef.current = null;

        pcRef.current?.close();
        pcRef.current = null;

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        // Delete signaling doc so the other side knows the call ended
        if (channelIdRef.current) {
            try {
                await deleteDoc(doc(db, "calls", channelIdRef.current));
            } catch { /* already deleted */ }
            channelIdRef.current = null;
        }
    }, []);

    const hangUp = useCallback(async () => {
        await cleanup();
        endCall();
    }, [cleanup, endCall]);

    // ── Build RTCPeerConnection ─────────────────────────────────────────────
    const createPC = useCallback(() => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pcRef.current = pc;

        // Attach remote tracks as they arrive
        const remoteStream = new MediaStream();
        remoteStreamRef.current = remoteStream;

        pc.ontrack = (e) => {
            e.streams[0]?.getTracks().forEach((t) => remoteStream.addTrack(t));
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setStatus("connected");
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
                hangUp();
            }
        };

        return pc;
    }, [hangUp, setStatus]);

    // ── Get local media ─────────────────────────────────────────────────────
    const getLocalStream = useCallback(async (mode: "video" | "audio") => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: mode === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current && mode === "video") {
            localVideoRef.current.srcObject = stream;
        }
        return stream;
    }, []);

    // ── ICE candidate exchange via Firestore subcollection ──────────────────
    const listenForRemoteICE = useCallback((channelId: string, side: "callerCandidates" | "calleeCandidates") => {
        const col = collection(db, "calls", channelId, side);
        return onSnapshot(col, (snap) => {
            snap.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pcRef.current?.addIceCandidate(candidate).catch(() => {});
                }
            });
        });
    }, []);

    const sendLocalICE = useCallback((channelId: string, side: "callerCandidates" | "calleeCandidates") => {
        if (!pcRef.current) return;
        pcRef.current.onicecandidate = (e) => {
            if (e.candidate) {
                addDoc(collection(db, "calls", channelId, side), e.candidate.toJSON());
            }
        };
    }, []);

    // ── CALLER: create offer ────────────────────────────────────────────────
    const startCall = useCallback(async (
        channelId: string,
        mode: "video" | "audio",
        callerId: string,
        peerId: string,
    ) => {
        channelIdRef.current = channelId;
        setStatus("calling");

        const pc = createPC();
        const stream = await getLocalStream(mode);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        sendLocalICE(channelId, "callerCandidates");

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await setDoc(doc(db, "calls", channelId), {
            offer: { type: offer.type, sdp: offer.sdp },
            mode,
            callerId,
            peerId,
            createdAt: serverTimestamp(),
        });

        // Listen for answer
        unsubAnswerRef.current = onSnapshot(doc(db, "calls", channelId), async (snap) => {
            const data = snap.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                setStatus("connected");
            }
            // Call ended by callee
            if (!snap.exists()) {
                await cleanup();
                endCall();
            }
        });

        // Listen for callee ICE
        unsubIceRef.current = listenForRemoteICE(channelId, "calleeCandidates");
    }, [createPC, getLocalStream, sendLocalICE, listenForRemoteICE, cleanup, endCall, setStatus]);

    // ── CALLEE: answer offer ────────────────────────────────────────────────
    const answerCall = useCallback(async (channelId: string, mode: "video" | "audio") => {
        channelIdRef.current = channelId;
        setStatus("ringing");

        const pc = createPC();
        const stream = await getLocalStream(mode);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        sendLocalICE(channelId, "calleeCandidates");

        const callDoc = await getDoc(doc(db, "calls", channelId));
        const offer = callDoc.data()?.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await updateDoc(doc(db, "calls", channelId), {
            answer: { type: answer.type, sdp: answer.sdp },
        });

        // Listen for caller ICE
        unsubIceRef.current = listenForRemoteICE(channelId, "callerCandidates");

        // Watch for call end
        unsubOfferRef.current = onSnapshot(doc(db, "calls", channelId), (snap) => {
            if (!snap.exists()) {
                cleanup();
                endCall();
            }
        });

        setStatus("connected");
    }, [createPC, getLocalStream, sendLocalICE, listenForRemoteICE, cleanup, endCall, setStatus]);

    // ── Controls ────────────────────────────────────────────────────────────
    const toggleMute = useCallback(() => {
        localStreamRef.current?.getAudioTracks().forEach((t) => {
            t.enabled = isMuted; // flip: if currently muted, re-enable
        });
        setIsMuted((v) => !v);
    }, [isMuted]);

    const toggleCam = useCallback(() => {
        localStreamRef.current?.getVideoTracks().forEach((t) => {
            t.enabled = isCamOff;
        });
        setIsCamOff((v) => !v);
    }, [isCamOff]);

    const toggleSpeaker = useCallback(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = !isSpeakerOff;
        }
        setIsSpeakerOff((v) => !v);
    }, [isSpeakerOff]);

    // Cleanup on unmount
    useEffect(() => () => { cleanup(); }, [cleanup]);

    return {
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
        answerCall,
    };
}
