"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VeloLogo } from "./VeloLogo";
import {
  Search,
  ThumbsUp,
  Users,
  Send,
  Plus,
  Compass,
  ChevronDown,
  Crown,
  Info,
  Mail,
  ShoppingBag,
  Bookmark
} from "lucide-react";
import { useAuthStore, useSearchStore } from "@/lib/store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useRouter, usePathname } from "next/navigation";
import { UserDropdown } from "./UserDropdown";
import { SearchOverlay } from "./SearchOverlay";
import { ChatModal } from "./ChatModal";
import { cn } from "@/lib/utils";
import { useUserRealtime } from "@/lib/firebase/hooks";
import { VerifiedBadge } from "./ui/VerifiedBadge";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, isAuthenticated, clearUser } = useAuthStore();
  const { data: userProfile } = useUserRealtime(authUser?.uid);
  const user = userProfile || authUser;
  const { isOpen: isSearchOpen, setOpen: setIsSearchOpen } = useSearchStore();
  const { coins } = useOnboardingStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  interface NavItem {
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & React.RefAttributes<SVGSVGElement>>;
    href: string;
    badge?: string | number;
  }

  const navItems: NavItem[] = [
    { name: "For You", icon: ThumbsUp, href: "/" },
    { name: "Following", icon: Users, href: "/following" },
    { name: "Explore", icon: Compass, href: "/explore" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleLogout = () => {
    document.cookie = "velo-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearUser();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 h-16 flex items-center justify-between bg-transparent border-none transition-all duration-300">
      <div className="flex items-center gap-4 sm:gap-8 w-[140px] sm:w-[180px]">
        <Link href="/">
          <VeloLogo showText={true} className="h-6 hover:opacity-80 transition-opacity cursor-pointer" />
        </Link>
      </div>

      <div className="hidden lg:flex items-center justify-center gap-10 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.name;
          const isActive = pathname === item.href;

          return (
            <div
              key={item.name}
              className="relative flex flex-col items-center gap-1 py-1 px-3 group cursor-pointer h-full justify-center"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (item.name === "Chats") {
                  setIsChatOpen(!isChatOpen);
                } else if (pathname !== item.href) {
                  router.push(item.href);
                }
              }}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-[22px] h-[22px] transition-all duration-300",
                    item.name === "Chats" && "-rotate-12 translate-x-0.5",
                    (isHovered || isActive || (item.name === "Chats" && isChatOpen)) ? "text-white" : "text-white/50"
                  )}
                  strokeWidth={1.8}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 bg-[#FF2D55] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border-[1.5px] border-[#0F0F0F]">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${(isHovered || isActive || (item.name === "Chats" && isChatOpen)) ? "text-white" : "text-white/30"
                }`}>
                {item.name}
              </span>

              {/* Active Underline & Glow */}
              {(isActive || (item.name === "Chats" && isChatOpen)) && (
                <>
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#ff3b5c] to-[#f127a3] rounded-full z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#ff3b5c]/20 blur-xl rounded-full pointer-events-none" />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 w-[140px] sm:w-[180px] justify-end">
        {isAuthenticated ? (
          <>
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/30 hover:text-white transition-colors"
            >
              <Search className="w-[20px] h-[20px]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 group px-2 py-1.5 rounded-full hover:bg-white/5 transition-all"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-white tracking-tight leading-none">
                    {user?.displayName || user?.email?.split('@')[0] || "User"}
                  </span>
                  <span className="text-[11px] text-white/40 font-medium">
                    @{user?.email?.split('@')[0] || "member"}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-[#FF2D55]/50 transition-all overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=333&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {user?.verified && (
                    <VerifiedBadge
                      className="absolute -bottom-0.5 -right-0.5 z-10 bg-black rounded-full border border-white/10 p-[1px]"
                      size={14}
                    />
                  )}
                </div>
              </button>

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
                      className="absolute right-0 mt-4 w-[320px] bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden z-50 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
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
          </>
        ) : (
          <Link href="/login">
            <button className="bg-[#FF2D55] hover:bg-[#FF4D6D] text-white px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-pink-500/20">
              Sign in
            </button>
          </Link>
        )}
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </nav>
  );
}
