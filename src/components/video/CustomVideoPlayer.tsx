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

interface CustomVideoPlayerProps {
    id: string;
    url: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
}

import { usePlayerStore } from "@/lib/store";

export function CustomVideoPlayer({ id, url, poster, className, autoPlay = true }: CustomVideoPlayerProps) {
    const { muted, setMuted, currentVideoId, setCurrentVideo } = usePlayerStore();
    const playing = currentVideoId === id; // Derive playing state from global store
    const [volume, setVolume] = useState(0.8);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for Autoplay
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting && autoPlay) {
                    setCurrentVideo(id);
                } else if (!entry.isIntersecting && currentVideoId === id) {
                    setCurrentVideo(null);
                }
            },
            { threshold: 0.6 } // Play when 60% visible
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [autoPlay, id, currentVideoId, setCurrentVideo]);

    // Sync playing state to video element
    useEffect(() => {
        if (!videoRef.current) return;

        if (playing && isVisible) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                        // console.log('Playback interrupted or blocked');
                    }
                });
            }
        } else {
            videoRef.current.pause();
        }
    }, [playing, isVisible]);

    const handlePlayPause = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (playing) {
            setCurrentVideo(null);
        } else {
            setCurrentVideo(id);
        }
    };

    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMuted(!muted);
    };

    const handleTimeUpdate = () => {
        if (!seeking && videoRef.current) {
            setPlayed(videoRef.current.currentTime / videoRef.current.duration || 0);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeekChange = (value: number[]) => {
        setPlayed(value[0]);
    };

    const handleSeekCommit = (value: number[]) => {
        setSeeking(false);
        if (videoRef.current) {
            videoRef.current.currentTime = value[0] * videoRef.current.duration;
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
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

    const handlePiP = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                videoRef.current.requestPictureInPicture();
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "group relative bg-black flex items-center justify-center overflow-hidden cursor-pointer rounded-xl",
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
                className="w-full h-full object-cover"
                muted={muted}
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                // No autoPlay prop here, we handle it via useEffect and playing state
                // standard attributes for better mobile/safari support
                webkit-playsinline="true"
                x5-playsinline="true"
            />

            {/* Overlay Scrim */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 pointer-events-none",
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
                "absolute bottom-0 left-0 right-0 px-4 pb-3 transition-all duration-300",
                (showControls || !playing) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
                {/* Progress Bar */}
                <div className="mb-2">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-3 group/slider"
                        value={[played]}
                        max={1}
                        step={0.001}
                        onValueChange={handleSeekChange}
                        onValueCommit={handleSeekCommit}
                        onPointerDown={() => setSeeking(true)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Slider.Track className="bg-white/20 relative grow h-[2px] rounded-full overflow-hidden transition-all group-hover/slider:h-[4px]">
                            <Slider.Range className="absolute bg-white h-full" />
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-3 h-3 bg-white rounded-full shadow-lg outline-none opacity-0 group-hover/slider:opacity-100 transition-opacity"
                            aria-label="Seek"
                        />
                    </Slider.Root>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button onClick={handlePlayPause} className="text-white hover:opacity-80 transition-opacity">
                            {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>
                        <div className="text-[14px] font-medium text-white/90 tabular-nums">
                            {formatTime(played * duration)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button onClick={handleToggleMute} className="text-white hover:opacity-80 transition-opacity">
                            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="text-white hover:opacity-80 transition-opacity">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={handlePiP} className="text-white hover:opacity-80 transition-opacity">
                            <PictureInPicture className="w-5 h-5" />
                        </button>
                        <button onClick={toggleFullscreen} className="text-white hover:opacity-80 transition-opacity">
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
