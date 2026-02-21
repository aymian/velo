"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Settings,
    Maximize,
    PictureInPicture,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";
import { usePlayerStore } from "@/lib/store";

interface CustomVideoPlayerProps {
    id: string;
    url: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
}

export function CustomVideoPlayer({ id, url, poster, className, autoPlay = true }: CustomVideoPlayerProps) {
    const { muted, setMuted, currentVideoId, setCurrentVideo } = usePlayerStore();
    const playing = currentVideoId === id;
    const [played, setPlayed] = useState(0); // 0 to 1
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [manuallyPaused, setManuallyPaused] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync Playing State with Store & Visibility
    useEffect(() => {
        if (!videoRef.current) return;

        if (playing && isVisible && !manuallyPaused) {
            videoRef.current.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
            });
        } else {
            videoRef.current.pause();
        }
    }, [playing, isVisible, manuallyPaused]);

    // Intersection Observer for Autoplay
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isNowVisible = entry.isIntersecting;
                setIsVisible(isNowVisible);

                // When a new video enters the view significantly, it becomes the current video
                if (isNowVisible && autoPlay) {
                    setCurrentVideo(id);
                    setManuallyPaused(false); // Reset manual pause state when scrolling to a new focus
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [autoPlay, id, setCurrentVideo]);

    const handlePlayPause = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (playing && !manuallyPaused) {
            setManuallyPaused(true);
        } else {
            setManuallyPaused(false);
            setCurrentVideo(id);
        }
    };

    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMuted(!muted);
    };

    const onTimeUpdate = () => {
        if (!seeking && videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            if (total > 0) {
                setPlayed(current / total);
            }
        }
    };

    const onLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeekChange = (value: number[]) => {
        setSeeking(true);
        setPlayed(value[0]);
    };

    const handleSeekCommit = (value: number[]) => {
        setSeeking(false);
        if (videoRef.current) {
            videoRef.current.currentTime = value[0] * videoRef.current.duration;
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === Infinity) return "0:00";
        const mm = Math.floor(seconds / 60);
        const ss = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handlePiP = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await videoRef.current.requestPictureInPicture();
                }
            } catch (error) {
                console.error("PiP error:", error);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "group relative bg-black flex items-center justify-center overflow-hidden cursor-pointer",
                className
            )}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={() => handlePlayPause()}
        >
            <video
                ref={videoRef}
                src={url}
                poster={poster}
                className="w-full h-full object-contain pointer-events-none"
                muted={muted}
                playsInline
                loop
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onPlay={() => setCurrentVideo(id)}
                onPause={() => {
                    // Only clear if it was the one playing
                    if (currentVideoId === id && isVisible) {
                        // We don't necessarily want to clear it if it was paused manually
                        // but stay consistent with store logic
                    }
                }}
            />

            {/* Overlay Scrim */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none",
                (showControls || !playing) ? "opacity-100" : "opacity-0"
            )} />

            {/* Play/Pause Center Icon */}
            {!playing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 scale-110">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Controls Area */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 px-3 pb-2 pt-10 transition-all duration-300 bg-gradient-to-t from-black/90 via-transparent to-transparent",
                (showControls || !playing) ? "opacity-100" : "opacity-0"
            )}>
                {/* Progress Bar - Minimalist X Style */}
                <div className="absolute top-0 left-0 right-0 px-3 -translate-y-1">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-1 group/slider cursor-pointer"
                        value={[played]}
                        max={1}
                        step={0.001}
                        onValueChange={handleSeekChange}
                        onValueCommit={handleSeekCommit}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Slider.Track className="bg-white/20 relative grow h-[2px] rounded-full overflow-hidden transition-all group-hover/slider:h-[4px]">
                            <Slider.Range className="absolute bg-white h-full" />
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-2.5 h-2.5 bg-white rounded-full shadow-lg outline-none opacity-0 group-hover/slider:opacity-100 transition-opacity"
                            aria-label="Seek"
                        />
                    </Slider.Root>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={handlePlayPause} className="text-white hover:scale-110 transition-transform p-1">
                            {playing ? (
                                <Pause className="w-5 h-5 fill-white" />
                            ) : (
                                <Play className="w-5 h-5 fill-white" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-[12px] font-medium text-white tabular-nums">
                            {formatTime(played * duration)} / {formatTime(duration)}
                        </div>
                        <button onClick={handleToggleMute} className="text-white hover:scale-110 transition-transform">
                            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="text-white hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={handlePiP} className="text-white hover:scale-110 transition-transform">
                            <PictureInPicture className="w-4 h-4" />
                        </button>
                        <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition-transform">
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomVideoPlayer;
