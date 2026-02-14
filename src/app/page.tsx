import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingNow } from "@/components/TrendingNow";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&h=1080&fit=crop"
        >
          <source
            src="https://ext.same-assets.com/3286759155/3805063196.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

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
