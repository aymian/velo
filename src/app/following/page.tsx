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
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 font-sans">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                {/* Left Sidebar */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                {/* Main Content - No Right Sidebar */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen">
                    <div className="w-full min-h-screen border-x border-white/5 bg-[#0d0d0d]">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <FollowingFeed />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
