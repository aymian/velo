"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingNow } from "@/components/TrendingNow";
import Footer from "@/components/footer";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useAuthStore } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="relative flex flex-col min-h-screen bg-black">
      {/* Video Background only for non-authenticated users */}
      {!isAuthenticated && <BackgroundVideo />}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Hide Trending Now Section for authenticated users */}
      {!isAuthenticated && <TrendingNow />}
    </main>
  );
}
