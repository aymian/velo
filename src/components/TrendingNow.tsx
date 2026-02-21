"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MoreHorizontal, Send, Star, Eye } from "lucide-react";

export function TrendingNow() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate array of 32 images from public/images/1.png to 32.png
  // Assuming the user has images named 1.png, 2.png, ..., 32.png in /public/images/
  const images = Array.from({ length: 32 }, (_, i) => `/images/${i + 1}.png`);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getIndex = (offset: number) => {
    return (activeIndex + offset + images.length) % images.length;
  };

  return (
    <section className="relative z-20 w-full py-20 overflow-hidden flex flex-col items-center justify-center min-h-[800px]">

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Text */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Trending <span className="text-[#ff1493]">Live</span>
        </h2>
        <p className="text-zinc-400 text-lg">See what's happening right now.</p>
      </div>

      {/* 3D Fan Stack Container */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center perspective-[2000px]">

        {/* LEFT CARD (Previous Image) */}
        <motion.div
          className="absolute z-10 w-[300px] h-[540px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-black/20"
          initial={{ opacity: 0, x: -100, rotate: -20 }}
          whileInView={{ opacity: 1, x: -280, rotate: -15, scale: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "bottom right" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`left-${getIndex(-1)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={images[getIndex(-1)]}
              alt="Previous Stream"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            <div className="h-1 flex-1 bg-white/50 rounded-full" />
            <div className="h-1 flex-1 bg-white/20 rounded-full" />
          </div>

          {/* Reaction Bubble */}
          <div className="absolute bottom-32 left-8 bg-gradient-to-br from-[#FF2D55] to-[#a855f7] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,45,85,0.3)] animate-bounce z-20">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
        </motion.div>

        {/* RIGHT CARD (Next Image) */}
        <motion.div
          className="absolute z-10 w-[300px] h-[540px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-black/20"
          initial={{ opacity: 0, x: 100, rotate: 20 }}
          whileInView={{ opacity: 1, x: 280, rotate: 15, scale: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "bottom left" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`right-${getIndex(1)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={images[getIndex(1)]}
              alt="Next Stream"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            <div className="h-1 flex-1 bg-white/50 rounded-full" />
            <div className="h-1 flex-1 bg-white/20 rounded-full" />
          </div>

          {/* Floating Sticker */}
          <div className="absolute top-24 right-[-20px] bg-[#00e676] text-black font-bold px-4 py-2 rounded-xl rotate-12 shadow-lg flex items-center gap-1 z-20">
            <Star className="w-4 h-4 fill-black" />
            <span>POPULAR</span>
          </div>

          <div className="absolute bottom-20 right-6 w-12 h-12 rounded-full border-2 border-[#00e676] overflow-hidden z-20">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* CENTER CARD (Current Image) */}
        <motion.div
          className="relative z-30 w-[340px] h-[600px] rounded-[40px] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] border-[6px] border-black bg-black"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Image */}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={`center-${activeIndex}`}
              initial={{ opacity: 0.5, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.5, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              src={images[activeIndex]}
              alt="Main Stream"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Top Overlay UI */}
          <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/60 to-transparent z-40">
            {/* Progress Bars */}
            <div className="flex gap-1.5 mb-4">
              {/* Animated Progress Bar matching 5s interval */}
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  key={activeIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-white"
                />
              </div>
              <div className="h-1 flex-1 bg-white/30 rounded-full" />
              <div className="h-1 flex-1 bg-white/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-pink-500 p-0.5">
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Sarah & Jen</h3>
                  <span className="text-white/60 text-xs">2h ago</span>
                </div>
              </div>
              <MoreHorizontal className="text-white w-6 h-6" />
            </div>
          </div>

          {/* Floating Reaction Bubble */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-32 -left-12 bg-white rounded-[24px] px-4 py-3 shadow-xl z-40 flex items-center gap-2"
          >
            <div className="bg-purple-100 p-1.5 rounded-full">
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl">👀</span>
            <span className="text-2xl">😲</span>
            <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1" />
          </motion.div>

          {/* Bottom Interactive UI */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-40">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center px-5 gap-3">
                <div className="w-full bg-transparent text-white text-sm font-medium placeholder:text-white/70">Send message...</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-transparent border border-white/40 flex items-center justify-center backdrop-blur-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-transparent border border-white/40 flex items-center justify-center backdrop-blur-md">
                <Send className="w-5 h-5 text-white ml-0.5" />
              </div>
            </div>
          </div>

          {/* Center Bottom Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-40" />
        </motion.div>

      </div>
    </section>
  );
}
