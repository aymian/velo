"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="relative flex flex-col min-h-screen">
            <BackgroundVideo />
            <Navbar />

            <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-black/40 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] border border-white/10"
                >
                    <div className="flex flex-col justify-center">
                        <span className="text-[#FF2D55] font-bold tracking-widest uppercase text-sm mb-4">Connect Now</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Let's <span className="text-[#FF2D55]">Veeloo</span></h1>
                        <p className="text-white/60 text-lg mb-10 leading-relaxed">
                            Ready to take your project to the next level? Reach out for collaboration or inquiries about our technologies.
                        </p>

                        <div className="space-y-6">
                            <a href="mailto:ishimweyvesian@gmail.com" className="flex items-center gap-4 text-white hover:text-[#FF2D55] transition-colors group">
                                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#FF2D55]/50 overflow-hidden">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Email</p>
                                    <p className="text-lg">ishimweyvesian@gmail.com</p>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 text-white transition-colors group">
                                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#FF2D55]/50 overflow-hidden">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Location</p>
                                    <p className="text-lg">Kigali, Rwanda | Digital Space</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF2D55]/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF2D55]/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    rows={4}
                                    placeholder="Your Message"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF2D55]/50 transition-all font-medium resize-none"
                                />
                            </div>
                            <button
                                disabled
                                className="w-full bg-[#FF2D55] hover:bg-[#FF0040] text-white font-bold py-5 rounded-2xl shadow-xl shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
