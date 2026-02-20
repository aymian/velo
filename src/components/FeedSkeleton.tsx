"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 py-8 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    {/* Profile Circle */}
                    <Skeleton className="w-12 h-12 rounded-full bg-white/[0.03]" />

                    {/* Lines Container */}
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3 bg-white/[0.03] rounded-full" />
                        <Skeleton className="h-3 w-2/3 bg-white/[0.03] rounded-full" />
                    </div>

                    {/* Small Right Action */}
                    <Skeleton className="w-10 h-5 bg-white/[0.03] rounded-full" />
                </div>
            ))}
        </div>
    );
}

export function PageLoadingState() {
    return (
        <div className="min-h-screen bg-background flex flex-col pt-24 animate-in fade-in duration-500">
            <FeedSkeleton />
        </div>
    );
}
