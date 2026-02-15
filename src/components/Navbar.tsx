"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VeloLogo } from "./VeloLogo";
import {
  Search,
  ThumbsUp,
  Heart,
  Compass,
  MessageCircle,
  LogIn,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Crown
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { UserDropdown } from "./UserDropdown";
import { SearchOverlay } from "./SearchOverlay";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: "For You", icon: ThumbsUp, href: "/for-you" },
    { name: "Following", icon: Heart, href: "/following" },
    { name: "Explore", icon: Compass, href: "/explore" },
    { name: "Chats", icon: MessageCircle, href: "/chats" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on 's' key if not typing in an input
      if (e.key.toLowerCase() === 's' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleLogout = () => {
    // Clear cookie
    document.cookie = "velo-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearUser();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 py-2 flex items-center justify-between">
      {/* Left Section: Logo & Search */}
      <div className="flex items-center gap-6 flex-1">
        <Link href="/">
          <VeloLogo showText={false} className="w-10 h-10 hover:scale-105 transition-transform cursor-pointer" />
        </Link>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="hidden lg:flex items-center justify-center gap-10 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.name;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center gap-1 group p-2"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`transition-all duration-300 transform ${isHovered ? "-translate-y-1 scale-110" : ""}`}>
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${isHovered
                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    : "text-white/40"
                    }`}
                  strokeWidth={isHovered ? 2.5 : 2}
                />
              </div>

              <span className={`text-[10px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${isHovered ? "text-white" : "text-white/20"
                }`}>
                {item.name}
              </span>

              {/* Minimalist dot indicator */}
              <span className={`absolute -bottom-1 w-1 h-1 rounded-full bg-white transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`} />
            </Link>
          );
        })}
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all group"
            >
              <Search className="w-4 h-4 text-white/40 group-hover:text-white transition-all" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 pl-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all group"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[11px] font-bold text-white/80 leading-tight">{user?.displayName}</span>
                  <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase flex items-center gap-1">
                    <Crown className="w-2 h-2 text-white/20" /> PLATINUM
                  </span>
                </div>
                <div className="relative border border-white/10 group-hover:border-white/30 rounded-full transition-all overflow-hidden w-8 h-8">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=333&color=fff`}
                    alt="Profile"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/20 group-hover:text-white transition-all ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-[320px] bg-[#1a1a1a] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      <UserDropdown
                        user={user}
                        onLogout={handleLogout}
                        onClose={() => setShowProfileMenu(false)}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-gradient-to-r from-[#ff1493] to-[#ff69b4] hover:from-[#ff0080] hover:to-[#ff50a0] text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all hover:scale-105 active:scale-95">
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
          </Link>
        )}
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
