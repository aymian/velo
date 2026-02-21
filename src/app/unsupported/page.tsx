"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Tablet, Tv, Rocket, Sparkles } from "lucide-react";
import { VeloLogo } from "@/components/VeloLogo";

export default function UnsupportedPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF2D55]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[500px] w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-12 flex justify-center"
                >
                    <VeloLogo showText={true} className="h-10" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                            <Smartphone className="w-8 h-8 text-[#FF2D55] opacity-50" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight leading-tight">
                        Wider Screen <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D55] to-[#a855f7]">Required</span>
                    </h1>

                    <p className="text-white/50 text-[15px] leading-relaxed">
                        Veeloo's premium real-time experience is currently optimized for larger displays. Please switch to a device with more space to enjoy the transmission.
                    </p>

                    <div className="grid grid-cols-3 gap-3 py-8">
                        {[
                            { icon: Monitor, label: "PC / Mac" },
                            { icon: Tablet, label: "Tablet" },
                            { icon: Tv, label: "Smart TV" }
                        ].map((device, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                <device.icon className="w-6 h-6 text-white/80" />
                                <span className="text-[10px] uppercase font-black tracking-widest text-white/40">{device.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-[#FF2D55]">
                            <Rocket className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Mobile Release</span>
                        </div>

                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                            <div className="relative bg-white/5 border border-white/10 px-8 py-3 rounded-2xl flex flex-col items-center">
                                <span className="text-[24px] font-black text-white italic">JUNE 20, 2026</span>
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Android & iOS App</span>
                            </div>
                        </div>

                        <p className="text-[12px] text-white/30 pt-4 flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Coming soon to the stores
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Footer */}
            <div className="absolute bottom-10 text-[10px] font-bold text-white/10 uppercase tracking-[0.5em] text-center w-full">
                Veeloo Transmission Protocol v2.4
            </div>
        </div>
    );
}
