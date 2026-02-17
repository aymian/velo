"use client";

import React from "react";
import { motion } from "framer-motion";

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
    id?: string;
}

export function Switch({ checked, onCheckedChange, className, id }: SwitchProps) {
    return (
        <button
            id={id}
            onClick={() => onCheckedChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-pink-500/50 ${checked ? "bg-[#ff1493]" : "bg-white/20"
                } ${className}`}
        >
            <motion.div
                animate={{ x: checked ? 22 : 2 }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
        </button>
    );
}
