"use client";

import React, { useRef, useEffect } from "react";

interface BackgroundVideoProps {
    className?: string;
    blur?: boolean;
}

export function BackgroundVideo({ className = "", blur = false }: BackgroundVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75; // Optional: slow down slightly for better aesthetic
            videoRef.current.play().catch(error => {
                console.error("Auto-play was prevented:", error);
            });
        }
    }, []);

    return (
        <div className={`fixed inset-0 z-0 ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                loop={true}
                muted={true}
                playsInline={true}
                className={`w-full h-full object-cover ${blur ? "blur-md scale-105" : ""}`}
                poster="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&h=1080&fit=crop"
                preload="auto"
            >
                <source
                    src="https://ext.same-assets.com/3286759155/3805063196.mp4"
                    type="video/mp4"
                />
            </video>

            {/* Gradient overlays */}
            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent ${blur ? "bg-black/30" : ""}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        </div>
    );
}
