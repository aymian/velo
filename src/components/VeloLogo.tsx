"use client";

import React from "react";

interface VeloLogoProps {
    className?: string;
    showText?: boolean;
}

export function VeloLogo({ className = "", showText = true }: VeloLogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <defs>
                    <linearGradient id="veloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff4081" />
                        <stop offset="100%" stopColor="#7c4dff" />
                    </linearGradient>
                </defs>

                {/* Stylized V shape mimicking the fluid Tango style */}
                <path
                    d="M10 10 C 14 20, 20 38, 24 38 C 28 38, 34 20, 38 10"
                    stroke="url(#veloGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Optional: Add a subtle overlay or shine if needed, but keeping it simple for now to match the icon style */}
            </svg>

            {showText && (
                <span className="text-2xl font-bold text-white tracking-tight font-sans">
                    velo
                </span>
            )}
        </div>
    );
}
