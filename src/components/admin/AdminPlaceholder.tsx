"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function AdminPlaceholderPage({ title }: { title: string }) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 border border-dashed border-white/5 rounded-[40px] opacity-20">
            <LayoutDashboard size={64} strokeWidth={1} />
            <div className="text-center space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-widest leading-none">{title} Hub</h2>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Module Initialization Pending</p>
            </div>
        </div>
    );
}
