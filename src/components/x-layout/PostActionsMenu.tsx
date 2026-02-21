"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bookmark,
    EyeOff,
    UserX,
    Shield,
    UserMinus,
    AlertCircle,
    Link as LinkIcon,
    ChevronRight,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    isMobile?: boolean;
}

export function PostActionsMenu({ isOpen, onClose, anchorEl, isMobile }: PostActionsMenuProps) {
    if (!isOpen || !anchorEl) return null;

    const menuItems = [
        { label: "Add to feed", icon: ChevronRight, type: "nested" },
        { label: "Save", icon: Bookmark, section: "top" },
        { label: "Not interested", icon: EyeOff },
        { label: "Mute", icon: UserX, section: "middle" },
        { label: "Restrict", icon: Shield },
        { label: "Unfollow", icon: UserMinus },
        { label: "Report", icon: AlertCircle, variant: "danger" },
        { label: "Copy link", icon: LinkIcon, section: "bottom" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay to close */}
                    <div
                        className="fixed inset-0 z-[100] cursor-default"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className={cn(
                            "fixed z-[101] w-[260px] bg-[#1c1c1e] border border-white/10 rounded-[1rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1.5 overflow-hidden",
                            "backdrop-blur-2xl"
                        )}
                        style={{
                            top: anchorEl.getBoundingClientRect().bottom + 8,
                            right: window.innerWidth - anchorEl.getBoundingClientRect().right,
                        }}
                    >
                        {/* Sections based on the image provided */}

                        {/* 1. Add to feed */}
                        <MenuItem
                            label="Add to feed"
                            icon={ChevronRight}
                            isNested
                        />

                        <div className="h-[0.5px] bg-white/[0.08] my-1" />

                        {/* 2. Save & Not interested */}
                        <MenuItem label="Save" icon={Bookmark} />
                        <MenuItem label="Not interested" icon={EyeOff} />

                        <div className="h-[0.5px] bg-white/[0.08] my-1" />

                        {/* 3. Mute, Restrict, Unfollow, Report */}
                        <MenuItem label="Mute" icon={UserX} />
                        <MenuItem label="Restrict" icon={Shield} />
                        <MenuItem label="Unfollow" icon={UserMinus} />
                        <MenuItem label="Report" icon={AlertCircle} variant="danger" />

                        <div className="h-[0.5px] bg-white/[0.08] my-1" />

                        {/* 4. Copy link */}
                        <MenuItem label="Copy link" icon={LinkIcon} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface MenuItemProps {
    label: string;
    icon: any;
    isNested?: boolean;
    variant?: "default" | "danger";
}

function MenuItem({ label, icon: Icon, isNested, variant = "default" }: MenuItemProps) {
    return (
        <button
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.05] transition-colors group",
                variant === "danger" ? "text-[#FF3B30]" : "text-white"
            )}
        >
            <span className="text-[14px] font-bold tracking-tight">{label}</span>
            {isNested ? (
                <Icon className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
                <Icon className={cn(
                    "w-5 h-5",
                    variant === "danger" ? "text-[#FF3B30]" : "text-white/80"
                )} />
            )}
        </button>
    );
}
