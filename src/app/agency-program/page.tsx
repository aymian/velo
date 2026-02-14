"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Users, Wallet, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { VeloLogo } from "@/components/VeloLogo";
import { Navbar } from "@/components/Navbar";

export default function AgencyProgramPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <Navbar />

            {/* Hero Section */}
            <main className="relative pt-20 px-4 md:px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[21/9] min-h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl shadow-purple-500/10"
                >
                    {/* Background Content */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071"
                            alt="Agency Growth"
                            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Gradient Overlay strictly matching the purple-to-transparent design */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6] via-transparent to-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8"
                        >
                            <span className="text-sm md:text-base font-bold tracking-wide uppercase">Veeloo Business Program</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl md:text-8xl font-black mb-6 tracking-tight drop-shadow-2xl"
                        >
                            Grow with Veeloo
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="max-w-2xl text-lg md:text-2xl text-white/90 font-medium mb-12 drop-shadow-lg"
                        >
                            Earn up to 15% of revenue. Enjoy 5% of referred supporters' revenue.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <button className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all active:scale-95">
                                How it works
                            </button>
                            <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                Start earning now <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute bottom-10 flex flex-col items-center gap-2 opacity-60"
                        >
                            <span className="text-[12px] font-bold uppercase tracking-widest">scroll down for more</span>
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Brand Showcase Section */}
                <section className="py-24 px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/10 pb-24">
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl md:text-7xl font-black italic tracking-tighter">veeloo</span>
                            <span className="text-3xl md:text-5xl font-light text-purple-400">for Business</span>
                        </div>
                        <div className="max-w-md text-right md:text-left">
                            <h3 className="text-2xl font-bold mb-4">The #1 Platform for Communities</h3>
                            <p className="text-white/60 leading-relaxed">
                                Join 5,000+ agencies worldwide who are scaling their businesses through Veeloo's industry-leading revenue sharing model.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Key Benefits Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
                    {[
                        {
                            icon: Wallet,
                            title: "Highest payouts",
                            desc: "Get industry-leading commission rates on every transaction made through your network."
                        },
                        {
                            icon: Users,
                            title: "Agency Support",
                            desc: "Dedicated account managers available 24/7 to help you scale and optimize your growth."
                        },
                        {
                            icon: TrendingUp,
                            title: "Real-time tracking",
                            desc: "Advanced dashboard with detailed analytics to monitor performance and earnings live."
                        }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group"
                        >
                            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <benefit.icon className="w-8 h-8 text-purple-400" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4">{benefit.title}</h4>
                            <p className="text-white/50 leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </section>
            </main>

            {/* Sticky CTA for high conversion */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl flex items-center gap-6"
            >
                <span className="text-sm font-bold text-white/80 hidden sm:inline">Ready to join the revolution?</span>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-purple-500/20">
                    Apply Now
                </button>
            </motion.div>
        </div>
    );
}
