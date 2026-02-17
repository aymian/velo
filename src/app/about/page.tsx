"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="relative flex flex-col min-h-screen">
            <BackgroundVideo />
            <Navbar />

            <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FF2D55] text-sm font-bold tracking-widest uppercase mb-8"
                >
                    Our Story
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
                >
                    Vision of <span className="text-[#FF2D55]">Veeloo</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6 text-xl text-white/70 leading-relaxed font-light italic"
                >
                    <p>
                        "I am Ishimwe Yves Ian, and I built Veeloo to bridge the gap between static interfaces and human connection. Our mission is to transform the web into a living, breathing ecosystem."
                    </p>
                    <div className="h-px w-20 bg-[#FF2D55]/50 mx-auto my-10" />
                    <p className="text-white/90 font-medium not-italic">
                        We specialize in Next.js performance and real-time interactions, ensuring every click feels like a conversation.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full"
                >
                    {[
                        { title: "Speed", desc: "Edge-optimized performance" },
                        { title: "Design", desc: "Elite glassmorphism UI" },
                        { title: "Scale", desc: "Built for global traffic" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#FF2D55]/50 transition-all group">
                            <h3 className="text-[#FF2D55] text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">{item.title}</h3>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
