"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    PlaySquare,
    ShieldAlert,
    DollarSign,
    BarChart3,
    Bell,
    Settings,
    UserCog,
    History,
    ChevronLeft,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VeloLogo } from "../VeloLogo";

const ADMIN_NAV_ITEMS = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Content", href: "/admin/content", icon: PlaySquare },
    { name: "Reports", href: "/admin/reports", icon: ShieldAlert, badge: "12" },
    { name: "Monetization", href: "/admin/monetization", icon: DollarSign },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Roles", href: "/admin/roles", icon: UserCog },
    { name: "System Logs", href: "/admin/logs", icon: History },
];

export function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("velo_admin_access");
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-[#080808] border-r border-white/5 flex flex-col z-50">
            {/* Admin Branding */}
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <VeloLogo showText={false} className="h-6" />
                <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tighter text-white">VELO ADMIN</span>
                    <span className="text-[10px] font-bold text-[#FF2D55] uppercase tracking-widest">Control Panel</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                {ADMIN_NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-white/5 text-white"
                                    : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-[#FF2D55]" : "group-hover:text-white"
                                )} />
                                <span className="text-sm font-semibold">{item.name}</span>
                            </div>
                            {item.badge && (
                                <span className="bg-[#FF2D55]/10 text-[#FF2D55] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FF2D55]/20">
                                    {item.badge}
                                </span>
                            )}
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] shadow-[0_0_10px_#FF2D55]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.03] transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm font-semibold">Exit to Site</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF2D55] hover:bg-[#FF2D55]/5 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-semibold">Logout Admin</span>
                </button>
            </div>
        </aside>
    );
}
