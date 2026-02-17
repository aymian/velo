"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Coins, Heart, Zap, ShoppingBag } from "lucide-react";

export default function StorePage() {
    const items = [
        { name: "COINS", qty: "1K", price: "$9" },
        { name: "COINS", qty: "5K", price: "$44" },
        { name: "HEART", qty: "SUPER", price: "500C" },
        { name: "BOOST", qty: "24H", price: "200C" },
        { name: "VIP", qty: "YEAR", price: "$199" },
        { name: "BOX", qty: "ELITE", price: "1000C" }
    ];

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />

            <div className="relative z-10 pt-40 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
                {/* Minimalist Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-[0.1em] uppercase mb-4 leading-none">
                        STORE
                    </h1>
                    <div className="h-[2px] w-32 bg-white mx-auto opacity-20" />
                </motion.div>

                {/* Sharp Monochrome Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 w-full border-t border-l border-white/10">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-12 bg-black/40 border-r border-b border-white/10 hover:bg-white/5 transition-all group flex flex-col items-center justify-between text-center min-h-[350px]"
                        >
                            <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                                {item.name === "COINS" && <Coins className="w-10 h-10" />}
                                {item.name === "HEART" && <Heart className="w-10 h-10" />}
                                {item.name === "BOOST" && <Zap className="w-10 h-10" />}
                                {item.name === "VIP" && <ShoppingBag className="w-10 h-10" />}
                                {item.name === "BOX" && <Zap className="w-10 h-10 -rotate-90" />}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black tracking-tight mb-1">{item.name}</h3>
                                <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">{item.qty}</p>
                            </div>

                            <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all active:scale-95">
                                {item.price}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Minimal Footer Info */}
                <div className="mt-20 flex gap-12 opacity-30 text-[9px] font-black tracking-[.4em] uppercase">
                    <span>Secure</span>
                    <span className="text-white">//</span>
                    <span>Instant</span>
                    <span className="text-white">//</span>
                    <span>Global</span>
                </div>
            </div>
        </main>
    );
}
