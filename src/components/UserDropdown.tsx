"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Crown,
    Gem,
    PlayCircle,
    Gavel,
    Headphones,
    Smartphone,
    LogOut,
    Settings2,
    MoonStar,
    Wallet,
    BarChart4,
    HeartPulse,
    ChevronRight,
    Zap,
    MessageSquare,
    Info,
    HelpCircle,
    ShieldCheck,
    Building2,
    Handshake,
    Store,
    Briefcase,
    UserCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface UserDropdownProps {
    user: any;
    onLogout: () => void;
    onClose: () => void;
}

export function UserDropdown({ user, onLogout, onClose }: UserDropdownProps) {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const MenuItem = ({ icon: Icon, label, subtitle, hasNotification, onClick, badge }: any) => (
        <button
            onClick={onClick}
            className="w-full flex items-start gap-4 px-4 py-3 hover:bg-white/5 transition-all group"
        >
            <div className="relative mt-1">
                <Icon className="w-6 h-6 text-white/90 group-hover:text-white transition-colors" />
                {hasNotification && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff1493] rounded-full border-2 border-[#1a1a1a]" />
                )}
            </div>
            <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                    <span className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">{label}</span>
                    {badge && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/60">{badge}</span>}
                </div>
                {subtitle && <p className="text-[11px] text-white/40 leading-tight mt-1">{subtitle}</p>}
            </div>
        </button>
    );

    const SectionHeader = ({ label }: { label: string }) => (
        <div className="px-4 pt-6 pb-2">
            <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-wider">{label}</h3>
        </div>
    );

    return (
        <div className="flex flex-col h-[85vh] max-h-[700px]">
            {/* Header */}
            <div
                onClick={() => { router.push('/profile'); onClose(); }}
                className="p-4 border-b border-white/5 bg-white/2 hover:bg-white/5 transition-colors cursor-pointer group"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-pink-500/20 group-hover:ring-pink-500/40 transition-all">
                            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=ff4081&color=fff`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[17px] font-bold text-white leading-tight">{user?.displayName || "Funny Badger"}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <Gem className="w-3.5 h-3.5 text-white/40" />
                                    <span className="text-[13px] font-bold text-white/80">7</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-white/40" />
                                    <span className="text-[13px] font-bold text-white/80">1</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-white/40" />
                                    <span className="text-[13px] font-bold text-white/80">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 bg-[#0f0f0f]">
                <SectionHeader label="Special Programs" />
                <MenuItem
                    icon={Briefcase}
                    label="Agency Program"
                    onClick={() => { router.push('/agency-program'); onClose(); }}
                />
                <MenuItem icon={Crown} label="VIP Loyalty" />
                <MenuItem icon={Store} label="MyVIP Store" hasNotification={true} />
                <MenuItem icon={PlayCircle} label="How to Veeloo" hasNotification={true} />
                <MenuItem icon={Gavel} label="Veeloo Cards Auction" />

                <div className="my-2 h-px bg-white/5 mx-4" />

                <SectionHeader label="Creator Tools" />
                <MenuItem icon={Wallet} label="Get Money" hasNotification={true} />
                <MenuItem icon={BarChart4} label="Statistics" />
                <MenuItem icon={HeartPulse} label="My Fans" />

                <div className="my-2 h-px bg-white/5 mx-4" />

                <SectionHeader label="Settings" />
                <MenuItem icon={Headphones} label="Customer Support" />
                <MenuItem icon={Smartphone} label="Get Veeloo App" subtitle="Stay connected with your friends anywhere and anytime!" hasNotification={true} />
                <MenuItem icon={Settings2} label="Settings" />

                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                        <MoonStar className="w-6 h-6 text-white/90 group-hover:text-white transition-colors" />
                        <span className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">Dark theme</span>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} className="data-[state=checked]:bg-[#ff1493]" />
                </div>

                <div className="my-2 h-px bg-white/5 mx-4" />

                <SectionHeader label="Service Info" />
                <MenuItem icon={Info} label="About" />
                <MenuItem icon={Building2} label="Veeloo's Agencies Program" />
                <MenuItem icon={Handshake} label="Veeloo's Resellers Program" />
                <MenuItem icon={HelpCircle} label="Help Center" />
                <MenuItem icon={MessageSquare} label="FAQ" />
                <MenuItem icon={ShieldCheck} label="Legal Information" />

                <div className="mt-4 px-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 text-white hover:bg-white/5 rounded-2xl transition-all group"
                    >
                        <LogOut className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                        <span className="text-[15px] font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
