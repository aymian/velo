"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
    showOnCondition?: boolean;
}

export function VerifiedBadge({ className, size = 14, showOnCondition = true }: VerifiedBadgeProps) {
    if (!showOnCondition) return null;

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className="text-[#1DA1F2] fill-current"
            >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zM11.66 16.91l-3.5-3.5 1.41-1.41 2.09 2.08 4.59-4.58 1.41 1.41-6 6z" />
            </svg>
        </div>
    );
}
