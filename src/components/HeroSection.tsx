"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-20 pb-40">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-0" />

      <div className="relative z-10 max-w-2xl">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight min-h-[1.2em]">
          <TypewriterEffect text="Connect Live, Now!" delay={0.2} />
        </h1>

        {/* Subtitle - italic style like original */}
        <p className="text-xl md:text-2xl text-white/80 mb-10 italic font-light leading-relaxed min-h-[3em]">
          <TypewriterEffect text="Chat and engage with real people - just one click away." delay={1.5} cursorColor="#ffffff" />
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup">
            <Button
              className="bg-[#ff1493] hover:bg-[#ff0080] text-white font-bold px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Create Account
            </Button>
          </Link>

          <Button
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-6 rounded-full text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Refer & Earn
          </Button>
        </div>
      </div>
    </section>
  );
}
