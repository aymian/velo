"use client";

"use client";

import * as stylex from "@stylexjs/stylex";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import Footer from "@/components/footer";
import { useAuthStore } from "@/lib/store";
import { TwitterLayout } from "@/components/x-layout/TwitterLayout";
import { TwitterLayoutSkeleton } from "@/components/x-layout/TwitterLayoutSkeleton";
import { useEffect, useState } from "react";

const styles = stylex.create({
  main: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#02010a",
  },
  skeletonMain: {
    backgroundColor: "#000000",
    minHeight: "100vh",
  },
});

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Show skeleton while checking auth status to prevent flashing
  if (isLoading) {
    return (
      <main {...stylex.props(styles.skeletonMain)}>
        <Navbar />
        <TwitterLayoutSkeleton />
      </main>
    );
  }

  if (isAuthenticated) {
    return <TwitterLayout />;
  }

  return (
    <main {...stylex.props(styles.main)}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection showSkeleton={showSkeleton} />

      {/* Footer */}
      {!isAuthenticated &&
        (showSkeleton ? (
          <div className="mt-16 w-full border-t border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
              <div className="h-4 w-40 bg-white/10 rounded mb-4" />
              <div className="h-3 w-64 bg-white/10 rounded mb-2" />
              <div className="h-3 w-56 bg-white/10 rounded" />
            </div>
          </div>
        ) : (
          <Footer />
        ))}
    </main>
  );
}
