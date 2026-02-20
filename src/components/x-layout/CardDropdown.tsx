"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    MoreHorizontal,
    Bookmark,
    EyeOff,
    UserMinus,
    ShieldAlert,
    UserX,
    AlertCircle,
    Link,
    ChevronRight,
    PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CardDropdown() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-white/30 hover:text-[#FF2D55] hover:bg-[#FF2D55]/10 p-2 rounded-full transition-all outline-none"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-50 min-w-[240px] bg-[#1a1a1a] border border-white/5 rounded-2xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
                    align="end"
                    sideOffset={5}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Add to feed</span>
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <div className="h-[1px] bg-white/5 my-1.5" />

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Save</span>
                        <Bookmark className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Not interested</span>
                        <EyeOff className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <div className="h-[1px] bg-white/5 my-1.5" />

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Mute</span>
                        <UserMinus className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Restrict</span>
                        <ShieldAlert className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Unfollow</span>
                        <UserX className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-[#FF2D55] outline-none rounded-xl hover:bg-[#FF2D55]/10 cursor-pointer transition-colors group">
                        <span>Report</span>
                        <AlertCircle className="w-5 h-5 text-[#FF2D55]/60 group-hover:text-[#FF2D55] transition-colors" />
                    </DropdownMenu.Item>

                    <div className="h-[1px] bg-white/5 my-1.5" />

                    <DropdownMenu.Item className="flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-white outline-none rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <span>Copy link</span>
                        <Link className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
