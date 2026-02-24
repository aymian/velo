"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function XSidebarSkeleton() {
    return (
        <div className="flex flex-col h-full py-8 justify-center items-center xl:items-start px-2 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 w-full">
                    <Skeleton className="w-7 h-7 rounded-full bg-white/[0.03]" />
                    <Skeleton className="h-5 w-24 hidden xl:block bg-white/[0.03] rounded-full" />
                </div>
            ))}
        </div>
    );
}

export function RightSidebarSkeleton() {
    return (
        <div className="flex flex-col w-full max-w-[320px] py-4 pr-4 space-y-8">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-20 bg-white/[0.03] rounded-full mx-1" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                        <Skeleton className="w-[54px] h-[54px] rounded-full bg-white/[0.03]" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-20 bg-white/[0.03] rounded-full" />
                            <Skeleton className="h-2 w-16 bg-white/[0.03] rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-32 bg-white/[0.03] rounded-full mx-1" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5">
                        <Skeleton className="w-4 h-3 bg-white/[0.03] rounded-full shrink-0" />
                        <Skeleton className="w-9 h-9 rounded-full bg-white/[0.03] shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-24 bg-white/[0.03] rounded-full" />
                            <Skeleton className="h-2 w-16 bg-white/[0.03] rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TwitterLayoutSkeleton() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 font-sans">
            {/* Navbar is rendered outside usually but here we simulate the layout container */}
            <div className="max-w-[1300px] mx-auto flex pt-16">

                {/* Left Sidebar Skeleton */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebarSkeleton />
                </header>

                {/* Main Content Skeleton */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen flex">

                    {/* Feed Skeleton */}
                    <div className="flex-grow max-w-[460px] border-r border-white/5 min-h-screen bg-black">
                        <div className="w-full space-y-8 py-8 px-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full bg-white/[0.03]" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-3 w-24 bg-white/[0.03] rounded-full" />
                                            <Skeleton className="h-2 w-16 bg-white/[0.02] rounded-full" />
                                        </div>
                                    </div>
                                    <Skeleton className="aspect-[4/5] w-full rounded-[2rem] bg-white/[0.02]" />
                                    <div className="flex gap-4">
                                        <Skeleton className="w-6 h-6 rounded-full bg-white/[0.03]" />
                                        <Skeleton className="w-6 h-6 rounded-full bg-white/[0.03]" />
                                        <Skeleton className="w-6 h-6 rounded-full bg-white/[0.03]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar Skeleton */}
                    <div className="hidden lg:block w-[350px] xl:w-[390px] ml-4 sticky top-16 self-start">
                        <RightSidebarSkeleton />
                    </div>

                </main>
            </div>
        </div>
    );
}
