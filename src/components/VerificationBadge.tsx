"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationBadgeProps {
    status?: 'unverified' | 'pending' | 'verified';
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
    const router = useRouter();

    if (status === 'verified') {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/verify')}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
            >
                <Shield className="w-3 h-3 text-purple-400 fill-purple-400/20" />
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest leading-none">Verified</span>
            </motion.div>
        );
    }

    if (status === 'pending') {
        return (
            <div
                onClick={() => router.push('/verify?status=pending')}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 cursor-pointer transition-all"
            >
                <Shield className="w-3 h-3 text-yellow-400" />
                <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest leading-none">Pending</span>
            </div>
        );
    }

    return (
        <div
            onClick={() => router.push('/verify')}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all opacity-40 hover:opacity-100"
        >
            <Shield className="w-3 h-3 text-white/60" />
            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none">Verify Now</span>
        </div>
    );
}
