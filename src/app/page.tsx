"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingNow } from "@/components/TrendingNow";
import Footer from "@/components/footer";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useAuthStore } from "@/lib/store";
import { TwitterLayout } from "@/components/x-layout/TwitterLayout";
import { TwitterLayoutSkeleton } from "@/components/x-layout/TwitterLayoutSkeleton";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show skeleton while checking auth status to prevent flashing
  if (isLoading) {
    return (
      <main className="bg-black min-h-screen">
        <Navbar />
        <TwitterLayoutSkeleton />
      </main>
    );
  }

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
