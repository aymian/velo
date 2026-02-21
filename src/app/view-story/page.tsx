"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, MoreHorizontal, Volume2, VolumeX, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, query, getDocs, where, limit, orderBy, doc, getDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";

dayjs.extend(relativeTime);

const IMAGE_DURATION = 20000; // 20 seconds for images
const MAX_VIDEO_DURATION = 120000; // 2 minutes max

export default function StoryViewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF2D55]/20" /></div>}>
            <StoryViewerContent />
        </Suspense>
    );
}

function StoryViewerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const targetUsername = searchParams.get("username");

    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [timerProgress, setTimerProgress] = useState(0);
    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Fetch stories using TanStack Query
    const { data: userGroups = [], isLoading } = useQuery({
        queryKey: ['stories', 'view-page'],
        queryFn: async () => {
            const storiesQuery = query(
                collection(db, COLLECTIONS.STORIES),
                orderBy("createdAt", "desc")
            );
            const storiesSnap = await getDocs(storiesQuery);
            const allStories = storiesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            // Group by user
            const userIds = Array.from(new Set(allStories.map(s => s.userId)));
            const groups = await Promise.all(userIds.map(async (uid) => {
                const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
                const userStories = allStories.filter(s => s.userId === uid).sort((a, b) => {
                    const timeA = (a.createdAt as Timestamp)?.seconds || 0;
                    const timeB = (b.createdAt as Timestamp)?.seconds || 0;
                    return timeA - timeB;
                });
                return {
                    uid,
                    user: userDoc.data(),
                    stories: userStories
                };
            }));

            const validGroups = groups.filter(g => g.user && g.stories.length > 0);
            return validGroups;
        },
        staleTime: 60 * 1000, // 1 minute
    });

    // Set initial index if username is provided
    useEffect(() => {
        if (targetUsername && userGroups.length > 0) {
            const index = userGroups.findIndex(g => (g.user?.username || g.uid) === targetUsername);
            if (index !== -1) setCurrentUserIndex(index);
        }
    }, [targetUsername, userGroups]);

    // Progress Logic
    useEffect(() => {
        if (isLoading || userGroups.length === 0 || !isMediaLoaded) return;

        setTimerProgress(0);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);

        const currentStory = userGroups[currentUserIndex]?.stories[currentStoryIndex];
        if (!currentStory) return;

        const isVideo = currentStory.mediaType === 'video';

        if (isVideo) {
            // Video progress is handled by onTimeUpdate in the component
            return;
        } else {
            // Image timer
            const duration = IMAGE_DURATION;
            const interval = 50;
            const step = (interval / duration) * 100;

            progressTimerRef.current = setInterval(() => {
                setTimerProgress(prev => {
                    if (prev >= 100) {
                        handleNext();
                        return 100;
                    }
                    return prev + step;
                });
            }, interval);
        }

        return () => {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, [currentUserIndex, currentStoryIndex, isLoading, userGroups, isMediaLoaded]);

    const handleNext = () => {
        setIsMediaLoaded(false);
        const currentUser = userGroups[currentUserIndex];
        if (!currentUser) return;

        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else if (currentUserIndex < userGroups.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
        } else {
            router.push("/");
        }
    };

    const handlePrev = () => {
        setIsMediaLoaded(false);
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else if (currentUserIndex > 0) {
            setCurrentUserIndex(prev => prev - 1);
            const prevUser = userGroups[currentUserIndex - 1];
            setCurrentStoryIndex(prevUser.stories.length - 1);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF2D55]" /></div>;

    if (userGroups.length === 0) return (
        <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5">
                <Loader2 className="w-8 h-8 text-neutral-500" />
            </div>
            <div className="text-center space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Void Detected</h3>
                <p className="text-[11px] text-white/30 font-medium">No active stories in this sector.</p>
            </div>
            <button onClick={() => router.push("/")} className="text-[11px] font-black uppercase tracking-widest text-[#FF2D55] py-2 px-6 border border-[#FF2D55]/20 rounded-full hover:bg-[#FF2D55]/5 transition-all">
                Return to Index
            </button>
        </div>
    );

    const currentStory = userGroups[currentUserIndex]?.stories[currentStoryIndex];

    return (
        <div className="min-h-screen bg-[#070708] text-white flex items-center justify-center overflow-hidden relative font-sans">
            {/* Ambient Dynamic Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${currentUserIndex}-${currentStoryIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    {currentStory && (
                        <img
                            src={currentStory.mediaUrl}
                            className="w-full h-full object-cover blur-[120px] scale-125"
                            alt=""
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-[1500px] flex items-center justify-center px-4 md:px-10 h-screen py-4 md:py-8">

                {/* Left Preview Group */}
                {currentUserIndex > 0 && (
                    <div
                        onClick={handlePrev}
                        className="hidden xl:flex flex-col items-center gap-6 cursor-pointer opacity-10 hover:opacity-60 transition-all duration-500 scale-[0.65] -mr-16 group select-none"
                    >
                        <StoryPreview user={userGroups[currentUserIndex - 1]} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{userGroups[currentUserIndex - 1]?.user?.username}</span>
                    </div>
                )}

                {/* Main Story Hub */}
                <div className="relative flex items-center justify-center h-full w-full max-w-[420px]">

                    {/* Navigation Regions */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-40 cursor-pointer" onClick={handlePrev} title="Previous" />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-40 cursor-pointer" onClick={handleNext} title="Next" />

                    {/* Active Story Pod */}
                    <motion.div
                        key={`pod-${currentUserIndex}-${currentStoryIndex}`}
                        layoutId="active-pod"
                        className="relative h-full w-full bg-black rounded-[42px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 ring-1 ring-white/5 flex flex-col group/pod"
                    >
                        {!isMediaLoaded && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-3 font-black uppercase tracking-widest text-[9px] text-white/20">
                                <Loader2 className="w-5 h-5 animate-spin text-[#FF2D55]" />
                                <span>Calibrating...</span>
                            </div>
                        )}

                        <StoryContent
                            group={userGroups[currentUserIndex]}
                            currentIndex={currentStoryIndex}
                            timerProgress={timerProgress}
                            setTimerProgress={setTimerProgress}
                            isMuted={isMuted}
                            onToggleMute={() => setIsMuted(!isMuted)}
                            setIsMediaLoaded={setIsMediaLoaded}
                            handleNext={handleNext}
                            videoRef={videoRef}
                        />
                    </motion.div>
                </div>

                {/* Right Preview Group */}
                {currentUserIndex < userGroups.length - 1 && (
                    <div
                        onClick={handleNext}
                        className="hidden xl:flex flex-col items-center gap-6 cursor-pointer opacity-10 hover:opacity-60 transition-all duration-500 scale-[0.65] -ml-16 group select-none"
                    >
                        <StoryPreview user={userGroups[currentUserIndex + 1]} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{userGroups[currentUserIndex + 1]?.user?.username}</span>
                    </div>
                )}
            </div>

            {/* Global Exit */}
            <button
                onClick={() => router.push("/")}
                className="absolute top-8 right-8 w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 z-[100] group"
            >
                <X className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </button>
        </div>
    );
}

function StoryPreview({ user }: { user: any }) {
    const latestStory = user.stories[user.stories.length - 1];
    return (
        <div className="relative w-[280px] h-[500px] rounded-[42px] overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl">
            <img src={latestStory?.mediaUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-1000" alt="" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-5">
                <div className="w-20 h-20 rounded-full p-[3px] bg-neutral-800 shadow-2xl">
                    <Avatar className="w-full h-full border-4 border-black">
                        <AvatarImage src={user?.user?.photoURL} />
                        <AvatarFallback className="bg-neutral-800">{user?.user?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}

function StoryContent({ group, currentIndex, timerProgress, setTimerProgress, isMuted, onToggleMute, setIsMediaLoaded, handleNext, videoRef }: {
    group: any,
    currentIndex: number,
    timerProgress: number,
    setTimerProgress: (p: number) => void,
    isMuted: boolean,
    onToggleMute: () => void,
    setIsMediaLoaded: (l: boolean) => void,
    handleNext: () => void,
    videoRef: React.MutableRefObject<HTMLVideoElement | null>
}) {
    const story = group?.stories?.[currentIndex];
    if (!story) return null;

    const isVideo = story.mediaType === 'video';

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0">
                {isVideo ? (
                    <video
                        ref={videoRef}
                        src={story.mediaUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted={isMuted}
                        playsInline
                        onLoadedData={() => setIsMediaLoaded(true)}
                        onTimeUpdate={(e) => {
                            const v = e.currentTarget;
                            const p = (v.currentTime / Math.min(v.duration, MAX_VIDEO_DURATION / 1000)) * 100;
                            setTimerProgress(Math.min(p, 100));
                            if (v.currentTime >= 120) handleNext();
                        }}
                        onEnded={handleNext}
                    />
                ) : (
                    <img
                        src={story.mediaUrl}
                        className="w-full h-full object-cover"
                        alt=""
                        onLoad={() => setIsMediaLoaded(true)}
                    />
                )}
            </div>

            {/* Precision Overlays */}
            {story.textOverlay && (
                <div
                    className="absolute pointer-events-none select-none"
                    style={{
                        left: story.textOverlay.x,
                        top: story.textOverlay.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div
                        style={{
                            color: story.textOverlay.color,
                            fontSize: `${story.textOverlay.fontSize * 0.8}px`,
                            textAlign: story.textOverlay.textAlign as any,
                            backgroundColor: story.textOverlay.hasBg ? (story.textOverlay.color === '#ffffff' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)') : 'transparent',
                            padding: story.textOverlay.hasBg ? '3px 10px' : '0',
                            borderRadius: '6px',
                            backdropFilter: story.textOverlay.hasBg ? 'blur(4px)' : 'none'
                        }}
                        className={cn("font-bold drop-shadow-lg break-words max-w-[280px]", story.textOverlay.fontFamily)}
                    >
                        {story.textOverlay.text}
                    </div>
                </div>
            )}

            {story.stickers?.map((sticker: any) => (
                <div
                    key={sticker.id}
                    className="absolute pointer-events-none select-none"
                    style={{
                        left: sticker.x,
                        top: sticker.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <span className="text-3xl filter drop-shadow-2xl">{sticker.content}</span>
                </div>
            ))}

            {/* Heads-Up Display (HUD) */}
            <div className="absolute top-0 left-0 right-0 p-5 space-y-4 bg-gradient-to-b from-black/80 to-transparent pt-8">
                <div className="flex gap-1 h-[2px] px-1">
                    {group.stories.map((s: any, idx: number) => (
                        <div key={s.id} className="flex-1 h-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_8px_white]"
                                style={{
                                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${timerProgress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full p-[1.5px] bg-white/10 ring-1 ring-white/5">
                            <Avatar className="w-full h-full border-none">
                                <AvatarImage src={group.user?.photoURL} />
                                <AvatarFallback className="bg-neutral-800 text-[10px] font-bold">{group.user?.username?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-black uppercase tracking-widest text-white drop-shadow-md">{group.user?.username}</span>
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none">
                                {dayjs(story.createdAt?.toDate?.() || story.createdAt).fromNow(true)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                        <button onClick={onToggleMute} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md transition-all active:scale-95">
                            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                        <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md transition-all active:scale-95">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Transmission Hub */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent pb-10">
                <div className="flex-1 max-w-[85%] relative">
                    <input
                        type="text"
                        placeholder={`Reply to ${group.user?.username || "user"}...`}
                        className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2.5 text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all font-bold uppercase tracking-wider"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all active:scale-90 border border-white/5">
                        <Share2 className="w-3.5 h-3.5 text-white/40" />
                    </button>
                </div>
            </div>
        </div>
    );
}
