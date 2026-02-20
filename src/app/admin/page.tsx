"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";
import { Loader2 } from "lucide-react";

export default function AdminRootPage() {
    const router = useRouter();
    const { isAdminAuthenticated } = useAdminStore();

    useEffect(() => {
        if (isAdminAuthenticated) {
            router.push("/admin/dashboard");
        } else {
            router.push("/admin/login");
        }
    }, [isAdminAuthenticated, router]);

    return (
        <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );
}
