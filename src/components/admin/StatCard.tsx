"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down";
    icon: any;
    color?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, color = "white" }: StatCardProps) {
    return (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    "p-3 rounded-xl bg-white/[0.03] group-hover:scale-110 transition-transform duration-500",
                    color === "pink" && "text-[#FF2D55] bg-[#FF2D55]/5",
                    color === "green" && "text-emerald-500 bg-emerald-500/5",
                    color === "blue" && "text-blue-500 bg-blue-500/5",
                    color === "purple" && "text-purple-500 bg-purple-500/5"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                {change && (
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border",
                        trend === "up"
                            ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                            : "text-rose-500 bg-rose-500/5 border-rose-500/10"
                    )}>
                        {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{title}</span>
                <h3 className="text-2xl font-black text-white">{value}</h3>
            </div>
        </div>
    );
}
