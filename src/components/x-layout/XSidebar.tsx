"use client";

import React from "react";
import {
    Home,
    Search,
    Bell,
    Info,
    Mail,
    MoreHorizontal,
    Feather,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useSearchStore } from "@/lib/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarItemProps {
    href?: string;
    onClick?: () => void;
    icon: any;
    label: string;
    active?: boolean;
    badge?: string;
}

function SidebarItem({ href, onClick, icon: Icon, label, active, badge }: SidebarItemProps) {
    const content = (
        <div className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-300 w-full",
            "hover:bg-white/10 group-active:scale-95",
            active ? "text-white" : "text-white/85"
        )}>
            <div className="relative">
                <Icon className={cn("w-7 h-7", active && "stroke-[2.5px]")} />
                {badge && (
                    <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-[10px] font-black px-1.2 rounded-full border-2 border-black min-w-[18px] text-center">
                        {badge}
                    </span>
                )}
            </div>
            <span className={cn(
                "text-[19px] hidden xl:block",
                active ? "font-bold" : "font-medium"
            )}>
                {label}
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="group flex items-center w-full">
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className="group flex items-center w-full text-left">
            {content}
        </button>
    );
}

export function XSidebar() {
    const pathname = usePathname();
    const { setOpen: setSearchOpen } = useSearchStore();

    return (
        <div className="flex flex-col h-full py-8 justify-center items-center xl:items-start">
            {/* Nav Items Container */}
            <div className="space-y-4 w-full px-2">
                <SidebarItem href="/" icon={Home} label="Home" active={pathname === "/"} />
                <SidebarItem href="/following" icon={Users} label="Following" active={pathname === "/following"} />
                <SidebarItem
                    onClick={() => setSearchOpen(true)}
                    icon={Search}
                    label="Search"
                    active={false}
                />
                <SidebarItem href="/notifications" icon={Bell} label="Notifications" active={pathname === "/notifications"} badge="3" />
                <SidebarItem href="/about" icon={Info} label="About" active={pathname === "/about"} />
                <SidebarItem href="/contact" icon={Mail} label="Contact" active={pathname === "/contact"} />
            </div>
        </div>
    );
}
