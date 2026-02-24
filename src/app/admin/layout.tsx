"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isLoading) {
            // Bypass check for login page
            if (pathname === "/admin/login") {
                setIsAuthorized(true);
                return;
            }

            // Check both Firebase role AND the manual admin login flag
            const hasAdminFlag = localStorage.getItem("velo_admin_access") === "true";
            const isAdmin = user?.role === 'admin' || user?.email === 'admin@veeloo.com' || hasAdminFlag;

            if (!isAdmin) {
                setIsAuthorized(false);
                router.push("/admin/login");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, isAuthenticated, isLoading, router, pathname]);

    // Bypass layout for login page
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-black text-white">{children}</div>;
    }

    // Loading state
    if (isLoading || isAuthorized === null) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">Authenticating Admin...</span>
            </div>
        );
    }

    // Not authorized state
    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[#FF2D55]/10 flex items-center justify-center mb-8 border border-[#FF2D55]/20">
                    <ShieldAlert className="w-10 h-10 text-[#FF2D55]" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Access Denied</h1>
                <p className="text-white/40 max-w-md mb-8">
                    You do not have the required permissions to access the Veeloo Control Panel.
                    Your attempt has been logged for security purposes.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-transform active:scale-95"
                >
                    Return to Site
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex selection:bg-[#FF2D55]/30">
            <AdminSidebar />
            <main className="flex-1 ml-64 min-h-screen p-8 lg:p-12 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
