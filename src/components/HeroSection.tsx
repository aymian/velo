"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

export function HeroSection() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isAuthenticated) {
    return (
      <section className="relative min-h-screen pt-24 pb-20">
        {/* Simplified gradient for feed clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none z-0" />

        <div className="relative z-10 container mx-auto">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
            <p className="text-lg text-white/80">Your personalized content feed is coming soon.</p>
          </div>
        </div>
      </section>
    );
  }

  // Loading state placeholder to prevent layout shift
  if (isLoading) {
    return <section className="relative min-h-screen bg-black/20 animate-pulse" />;
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-20 pb-40">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-0" />

      <div className="relative z-10 max-w-2xl text-left">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight min-h-[1.2em]">
          <TypewriterEffect text="Content, Redefined." delay={0.2} />
        </h1>

        {/* Subtitle - italic style like original */}
        <p className="text-xl md:text-2xl text-white/80 mb-10 italic font-light leading-relaxed min-h-[3em]">
          <TypewriterEffect text="A platform for reels, premium clips, and real human connection." delay={1.5} cursorColor="#ffffff" />
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup">
            <Button
              className="bg-[#FF2D55] hover:bg-[#FF0040] text-white font-bold px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(255,45,85,0.4)] hover:shadow-[0_0_30px_rgba(255,45,85,0.6)] transition-all duration-300 hover:scale-105 w-full sm:w-auto"
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
