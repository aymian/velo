"use client";

import React from "react";
import {
    Home,
    Search,
    Bell,
    UserPlus,
    Mail,
    Compass,
    User,
    MoreHorizontal,
    Feather,
    Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    icon: any;
    active?: boolean;
    notification?: boolean | string;
    badge?: string;
}

function SidebarItem({ icon: Icon, active, notification, badge }: SidebarItemProps) {
    return (
        <button className="relative p-3 group transition-all duration-300">
            <div className="relative">
                <Icon
                    className={cn(
                        "w-7 h-7 transition-colors duration-300",
                        active ? "text-white" : "text-white/60 group-hover:text-white"
                    )}
                    strokeWidth={1.5}
                />

                {/* Small Pink Dot Notification */}
                {notification && !badge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF2D55] rounded-full border border-black" />
                )}

                {/* Large Pink/Purple Pill Badge (e.g., 20+) */}
                {badge && (
                    <div className="absolute -top-2.5 -right-4 bg-gradient-to-br from-[#FF2D55] to-[#7c4dff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-black min-w-[24px] flex items-center justify-center shadow-[0_0_10px_rgba(255,45,85,0.3)]">
                        {badge}
                    </div>
                )}
            </div>
        </button>
    );
}

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[72px] hidden md:flex flex-col items-center justify-center gap-4 z-[60]">
            <SidebarItem icon={Home} active notification />
            <SidebarItem icon={Search} />
            <SidebarItem icon={Bell} badge="20+" />
            <button className="p-3 group transition-all duration-300">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
            </button>
        </aside>
    );
}
