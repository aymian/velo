"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingNow } from "@/components/TrendingNow";
import Footer from "@/components/footer";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useAuthStore } from "@/lib/store";


import { TwitterLayout } from "@/components/x-layout/TwitterLayout";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <TwitterLayout />;
  }

  return (
    <main className="relative flex flex-col min-h-screen bg-background">
      {/* Video Background only for non-authenticated users */}
      {!isAuthenticated && <BackgroundVideo />}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Hide Trending Now Section for authenticated users */}
      {!isAuthenticated && <TrendingNow />}

      {/* Footer */}
      {!isAuthenticated && <Footer />}
    </main>
  );
}
