"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Smartphone } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-20 pb-40">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-0" />

      <div className="relative z-10 max-w-2xl">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Connect Live, Now!
        </h1>

        {/* Subtitle - italic style like original */}
        <p className="text-xl md:text-2xl text-white/80 mb-10 italic font-light leading-relaxed">
          Chat and engage with real people - just one click away.
        </p>

        {/* Sign in buttons */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Continue with Email button */}
          <Button
            className="bg-white hover:bg-white/90 text-black font-semibold px-8 py-6 rounded-full flex items-center gap-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </Button>

          <span className="text-white/60 font-medium">OR</span>

          {/* Social login buttons */}
          <div className="flex items-center gap-3">
            {/* Google */}
            <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>

            {/* X (Twitter) */}
            <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="black"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </button>

            {/* Phone */}
            <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
              <Smartphone className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
