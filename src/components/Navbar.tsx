"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VeloLogo } from "./VeloLogo";
import {
  Search,
  Sparkles,
  Heart,
  Compass,
  MessageCircle,
  LogIn
} from "lucide-react";

export function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: "For You", icon: Sparkles },
    { name: "Following", icon: Heart },
    { name: "Explore", icon: Compass },
    { name: "Chats", icon: MessageCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 py-2 flex items-center justify-between">
      {/* Left Section: Logo & Search */}
      <div className="flex items-center gap-6 flex-1">
        <VeloLogo showText={false} className="w-10 h-10" />

      </div>

      {/* Center Section: Navigation Links */}
      <div className="hidden lg:flex items-center justify-center gap-10 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.name;

          return (
            <button
              key={item.name}
              className="relative flex flex-col items-center gap-1 group p-2"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`transition-all duration-300 transform ${isHovered ? "-translate-y-1 scale-110" : ""}`}>
                <Icon
                  className={`w-7 h-7 transition-all duration-300 ${isHovered
                    ? "text-[#ff4081] drop-shadow-[0_0_10px_rgba(255,64,129,0.5)] fill-[#ff4081]/10"
                    : "text-white/80"
                    }`}
                  strokeWidth={isHovered ? 2.5 : 2}
                />
              </div>

              <span className={`text-[11px] font-bold tracking-wide transition-all duration-300 ${isHovered ? "text-white" : "text-white/60"
                }`}>
                {item.name}
              </span>

              {/* Glowing dot indicator */}
              <span className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#ff4081] shadow-[0_0_8px_#ff4081] transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`} />
            </button>
          );
        })}
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Balance Pill */}


        {/* Action Icons */}



        {/* Sign In Button */}
        <Link href="/login">
          <button className="bg-gradient-to-r from-[#ff1493] to-[#ff69b4] hover:from-[#ff0080] hover:to-[#ff50a0] text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all hover:scale-105 active:scale-95">
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
        </Link>
      </div>
    </nav>
  );
}
