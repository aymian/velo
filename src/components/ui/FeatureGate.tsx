"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { hasFeature, PlanFeatures } from "@/lib/config/plans";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

interface FeatureGateProps {
    feature: keyof PlanFeatures;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showPaywall?: boolean;
}

/**
 * FeatureGate Component
 * Wraps features that require a specific plan level.
 * Can show a locked UI or a custom fallback.
 */
export function FeatureGate({
    feature,
    children,
    fallback,
    showPaywall = true
}: FeatureGateProps) {
    const { user } = useAuthStore();
    const router = useRouter();

    const hasAccess = hasFeature(user, feature);

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (!showPaywall) {
        return null; // Just hide it
    }

    // Default "Soft Paywall" UI
    return (
        <div
            className="relative group cursor-pointer"
            onClick={() => router.push("/premium")}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Lock className="w-3 h-3" />
                    Upgrade to Unlock
                </div>
            </div>
            <div className="filter grayscale-[0.5] opacity-50 blur-[1px]">
                {children}
            </div>
        </div>
    );
}
