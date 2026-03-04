"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MoreHorizontal, Send, Star, Eye } from "lucide-react";

export function TrendingNow() {
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section className="relative z-20 w-full pt-0 pb-16 overflow-visible flex flex-col items-center justify-start min-h-[500px]">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(191,90,242,0.2)] rounded-full blur-[140px] pointer-events-none" />
      <div
        className="relative w-full max-w-[780px] h-[500px] flex items-center justify-center translate-x-2 md:translate-x-4 lg:translate-x-8"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="absolute z-10 w-[220px] h-[400px] rounded-[24px] overflow-hidden shadow-[0_30px_60px_-18px_rgba(0,0,0,0.6)] border-2 border-white/10"
          initial={{ opacity: 0, x: -70, y: 10, rotate: -20 }}
          whileInView={{ opacity: 1, x: -160, y: 12, rotate: -12, scale: 0.84 }}
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
          <div className="absolute top-3 left-3 right-3 flex gap-[0.2rem] z-20">
            <div className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: "50%" }} />
            </div>
            <div className="h-[3px] flex-1 bg-white/20 rounded-full" />
          </div>
          <div className="absolute bottom-32 left-8 bg-gradient-to-br from-[#FF2D55] to-[#a855f7] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,45,85,0.3)] z-20">
            <Heart size={32} color="#fff" fill="#fff" />
          </div>
        </motion.div>

        <motion.div
          className="absolute z-10 w-[220px] h-[400px] rounded-[24px] overflow-hidden shadow-[0_30px_60px_-18px_rgba(0,0,0,0.6)] border-2 border-white/10"
          initial={{ opacity: 0, x: 90, y: 5, rotate: 18 }}
          whileInView={{ opacity: 1, x: 160, y: 10, rotate: 10, scale: 0.84 }}
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
          <div className="absolute top-3 left-3 right-3 flex gap-[0.2rem] z-20">
            <div className="h-[3px] flex-1 bg-white/20 rounded-full" />
            <div className="h-[3px] flex-1 bg-white/20 rounded-full" />
          </div>
          <div className="absolute top-24 -right-5 bg-[#00e676] text-black font-bold px-4 py-2 rounded-xl rotate-12 shadow-lg flex items-center gap-1 z-20">
            <Star size={16} fill="#000" />
            <span>POPULAR</span>
          </div>
          <div className="absolute bottom-20 right-6 w-12 h-12 rounded-full border-2 border-[#00e676] overflow-hidden z-20">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="relative z-30 w-[280px] h-[500px] rounded-[32px] overflow-hidden shadow-[0_40px_80px_-18px_rgba(0,0,0,0.8)] border-4 border-white/15 bg-black"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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

          <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/60 to-transparent z-40">
            <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
              <div className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  key={activeIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  style={{ height: "100%", backgroundColor: "#fff" }}
                />
              </div>
              <div className="h-[3px] flex-1 bg-white/30 rounded-full" />
              <div className="h-[3px] flex-1 bg-white/30 rounded-full" />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #ff1493",
                    padding: "2px",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}>
                    Live Session
                  </h3>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem" }}>
                    Streaming now
                  </span>
                </div>
              </div>
              <MoreHorizontal color="#fff" />
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-32 -left-12 bg-white rounded-[24px] px-4 py-3 shadow-xl z-40 flex items-center gap-2"
          >
            <div style={{ backgroundColor: "#f3e8ff", padding: "6px", borderRadius: "50%" }}>
              <Eye size={16} color="#9333ea" />
            </div>
            <span style={{ fontSize: "1.5rem" }}>👀</span>
            <span style={{ fontSize: "1.5rem" }}>😲</span>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                position: "absolute",
                top: "-4px",
                right: "-4px",
              }}
            />
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-40">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center px-5 gap-3 text-white text-sm font-medium">
                <span>Send message...</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-transparent border border-white/40 flex items-center justify-center backdrop-blur-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-transparent border border-white/40 flex items-center justify-center backdrop-blur-md">
                <Send className="w-5 h-5 text-white ml-0.5" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-40" />
        </motion.div>
      </div>
    </section>
  );
}
