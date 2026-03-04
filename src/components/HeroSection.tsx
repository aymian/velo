"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { TrendingNow } from "@/components/TrendingNow";

type HeroSectionProps = {
  showSkeleton?: boolean;
};

export function HeroSection({ showSkeleton = false }: HeroSectionProps) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <section className="relative min-h-screen bg-black/20 animate-pulse" />;
  }

  const [email, setEmail] = useState("");

  if (showSkeleton) {
    return (
      <section className="relative min-h-screen flex items-center justify-center py-24 bg-[#0A0A0A] overflow-visible">
        <div className="relative z-10 w-full max-w-6xl px-6 grid gap-12 items-center lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex justify-center lg:justify-start w-full">
            <div className="translate-x-0 md:translate-x-2 lg:translate-x-6 overflow-visible relative h-[500px] w-full max-w-[780px]">
              <div className="absolute inset-0 mx-auto h-[500px] w-full flex items-center justify-center animate-pulse">
                <div className="absolute w-[220px] h-[400px] rounded-[24px] bg-white/10 border border-white/10 rotate-[-12deg] -translate-x-[160px]" />
                <div className="relative z-10 w-[280px] h-[500px] rounded-[32px] bg-white/10 border border-white/10 shadow-[0_40px_80px_-18px_rgba(0,0,0,0.6)]" />
                <div className="absolute w-[220px] h-[400px] rounded-[24px] bg-white/10 border border-white/10 rotate-[10deg] translate-x-[160px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center lg:text-left animate-pulse">
            <div className="self-center lg:self-start h-7 w-32 bg-white/10 rounded-full mb-6" />
            <div className="h-8 w-[320px] max-w-full bg-white/10 rounded mb-3 self-center lg:self-start" />
            <div className="h-8 w-[260px] max-w-full bg-white/10 rounded mb-6 self-center lg:self-start" />
            <div className="h-4 w-[360px] max-w-full bg-white/10 rounded mb-2 self-center lg:self-start" />
            <div className="h-4 w-[300px] max-w-full bg-white/10 rounded mb-6 self-center lg:self-start" />
            <div className="w-full max-w-[460px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1 h-[54px] rounded-[10px] bg-white/10" />
              <div className="w-[160px] h-[54px] rounded-[10px] bg-white/10" />
            </div>
            <div className="h-3 w-40 bg-white/10 rounded self-center lg:self-start" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 bg-[#0A0A0A] overflow-visible">
      <div className="relative z-10 w-full max-w-6xl px-6 grid gap-12 items-center lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex justify-center lg:justify-start w-full">
          <div className="translate-x-0 md:translate-x-2 lg:translate-x-6 overflow-visible">
            <TrendingNow />
          </div>
        </div>

        <div className="flex flex-col text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center lg:self-start bg-[rgba(255,45,85,0.1)] border border-[rgba(255,45,85,0.25)] text-[#FF2D55] rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider mb-6">
            Ready to Switch?
          </div>
          <h1 className="text-[clamp(26px,4vw,36px)] font-black tracking-[-0.04em] leading-tight text-white mb-5">
            Get early access to a
            {" "}
            <span className="inline-block whitespace-nowrap bg-[linear-gradient(135deg,#FF2D55,#BF5AF2)] bg-clip-text text-transparent">
              better social
            </span>
          </h1>
          <p className="text-[1.0625rem] text-white/50 leading-7 mb-10 max-w-[500px] mx-auto lg:mx-0">
            Join thousands choosing focus over noise, connection over virality, and privacy over surveillance.
          </p>
          <form
            id="cta-form-hero"
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-[460px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 mb-4"
          >
            <input
              id="cta-email-hero"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-[10px] border border-white/10 bg-[#111111] text-white placeholder-white/60 px-4 py-3.5 text-sm outline-none focus:border-white/10 focus:ring-0 transition"
            />
            <button
              id="cta-submit-hero"
              type="submit"
              className="px-7 py-3.5 rounded-[10px] font-bold text-white bg-[linear-gradient(135deg,#FF2D55,#BF5AF2)] hover:scale-[1.03] transition shadow-[0_0_20px_rgba(255,45,85,0.35)]"
            >
              Get Early Access
            </button>
          </form>
          <p className="text-xs text-white/30 mt-2">No spam. No ads. Unsubscribe any time.</p>
        </div>
      </div>
    </section>
  );
}
