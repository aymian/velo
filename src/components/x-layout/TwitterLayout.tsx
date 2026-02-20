"use client";

import React from "react";
import { XSidebar } from "./XSidebar";
import { XFeed } from "./XFeed";
import { RightSidebar } from "./RightSidebar";
import { Navbar } from "@/components/Navbar";

export function TwitterLayout() {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-pink-500/30 font-sans">
            <Navbar />

            {/* Max width container matches X/Twitter layout */}
            <div className="max-w-[1300px] mx-auto flex pt-16">

                {/* Left Sidebar - Fixed or sticky depending on implementation */}
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/5 hidden sm:block">
                    <XSidebar />
                </header>

                {/* Main Content + Right Sidebar Wrapper */}
                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] min-h-screen flex">

                    {/* Center Column - Feed */}
                    <div className="flex-grow max-w-[460px] border-r border-white/5 min-h-screen bg-background">
                        <XFeed />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="hidden lg:block w-[350px] xl:w-[390px] ml-4 sticky top-16 self-start">
                        <RightSidebar />
                    </div>

                </main>
            </div>

            {/* Mobile Bottom Nav (Optional placeholder) */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-50 px-4">
                {/* Mobile nav icons would go here if needed, or stick to Navbar */}
            </div>
        </div>
    );
}
