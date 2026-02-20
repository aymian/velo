"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";
import {
    Users,
    CircleDollarSign,
    ShieldCheck,
    BarChart3,
    AlertTriangle,
    Crown,
    LifeBuoy,
    Settings,
    Fingerprint,
    LayoutDashboard,
    Search,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Monetization", icon: CircleDollarSign, path: "/admin/monetization" },
    { label: "KYC Review", icon: ShieldCheck, path: "/admin/kyc" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { label: "Moderation", icon: AlertTriangle, path: "/admin/moderation" },
    { label: "Creators", icon: Crown, path: "/admin/creators" },
    { label: "Support", icon: LifeBuoy, path: "/admin/support" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
    { label: "Roles", icon: Fingerprint, path: "/admin/roles" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAdminAuthenticated, logout, adminUsername, adminRole } = useAdminStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        // Auth check - skip for login page
        if (!isAdminAuthenticated && !pathname.includes("/admin/login")) {
            router.push("/admin/login");
        }
    }, [isAdminAuthenticated, pathname, router]);

    if (pathname.includes("/admin/login")) {
        return <>{children}</>;
    }

    if (!isAdminAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0D0D12] text-white font-sans selection:bg-blue-500/30 flex">
            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full bg-[#16161D] border-r border-white/5 transition-all duration-300 z-50 flex flex-col",
                isSidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                        <Terminal className="w-4 h-4 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <span className="font-black uppercase tracking-widest text-[11px] text-white/90">Velo Authority</span>
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-blue-400" : "group-hover:text-white")} />
                                {isSidebarOpen && <span className="text-[13px] font-semibold">{item.label}</span>}
                                {isActive && isSidebarOpen && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={() => logout()}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="text-[13px] font-bold">Terminate Session</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-300 min-h-screen flex flex-col",
                isSidebarOpen ? "ml-64" : "ml-20"
            )}>
                {/* Top Bar */}
                <header className="h-16 bg-[#16161D]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                placeholder="Global system search..."
                                className="bg-[#0D0D12] border-white/5 w-80 h-10 pl-10 rounded-lg text-xs placeholder:text-white/10 focus:border-blue-500/30 transition-all border-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-white/5 border border-white/5 rounded-full relative text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <Bell className="w-4 h-4" />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-[#16161D] rounded-full" />
                        </button>

                        <div className="h-8 w-px bg-white/5 mx-2" />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-bold text-white leading-none uppercase tracking-wider">{adminUsername}</p>
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 opacity-80">{adminRole?.replace('_', ' ')}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 border border-white/5">
                                {adminUsername?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
