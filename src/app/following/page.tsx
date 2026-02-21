"use client";

import React from "react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { FollowingFeed } from "@/components/x-layout/FollowingFeed";
import { RightSidebar } from "@/components/x-layout/RightSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FollowingPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background text-white selection:bg-pink-500/30 font-sans">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                {/* Left Sidebar */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                {/* Main Content */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen flex">
                    {/* Center Column - Following Feed */}
                    <div className="flex-grow max-w-[460px] border-r border-white/5 min-h-screen bg-background">
                        <FollowingFeed />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="hidden lg:block w-[350px] xl:w-[390px] ml-4 sticky top-16 self-start">
                        <RightSidebar />
                    </div>
                </main>
            </div>
        </div>
    );
}
