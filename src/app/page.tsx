import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingNow } from "@/components/TrendingNow";
import Footer from "@/components/footer";

import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Video Background */}
      <BackgroundVideo />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Trending Now Section */}
      <TrendingNow />

      {/* Footer */}
      <Footer />
    </main>
  );
}
