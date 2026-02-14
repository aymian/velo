"use client";

import React, { useRef, useState, useEffect } from "react";
import { Flame, Users, ChevronLeft, ChevronRight, Play } from "lucide-react";

// Enhanced dummy data with thumbnails for a richer UI
const streamers = [
  {
    id: 1,
    name: "Muku",
    viewers: "12.5k",
    category: "Just Chatting",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=600&fit=crop"
  },
  {
    id: 2,
    name: "Phoenix",
    viewers: "8.2k",
    category: "Music",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop"
  },
  {
    id: 3,
    name: "Aaru",
    viewers: "5.4k",
    category: "Dance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop"
  },
  {
    id: 4,
    name: "Ishika",
    viewers: "10.1k",
    category: "Gaming",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop"
  },
  {
    id: 5,
    name: "Abhya",
    viewers: "3.2k",
    category: "Lifestyle",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"
  },
  {
    id: 6,
    name: "Shruti",
    viewers: "15k",
    category: "Singing",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=600&fit=crop"
  },
  {
    id: 7,
    name: "Queen",
    viewers: "9.6k",
    category: "Vibes",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop"
  }
];

function StreamerCard({ streamer }: { streamer: typeof streamers[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-48 h-72 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ease-out hover:w-56 hover:shadow-[0_0_30px_rgba(255,20,147,0.3)] border border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={streamer.thumbnail}
        alt={streamer.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

      {/* Live Badge - Pulsing */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full shadow-lg shadow-pink-900/20 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="text-[10px] font-bold text-white tracking-wide">LIVE</span>
      </div>

      {/* Viewer Count Badge */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/10">
        <Users className="w-3 h-3 text-white/80" />
        <span className="text-[10px] font-medium text-white">{streamer.viewers}</span>
      </div>

      {/* Content Container (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">

        {/* Play Button Overlay (appears on hover) */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </div>

        <div className="flex items-end gap-3">
          {/* Avatar with Ring */}
          <div className={`relative w-10 h-10 rounded-full border-2 border-pink-500 p-0.5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <img
              src={streamer.avatar}
              alt={streamer.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col mb-1">
            <h3 className="text-white font-bold text-sm leading-tight group-hover:text-pink-400 transition-colors">
              {streamer.name}
            </h3>
            <span className="text-white/60 text-xs font-medium">
              {streamer.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      return () => ref.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative z-20 flex flex-col gap-4 py-8 pb-20">
      {/* Section Header with Glass Effect */}
      <div className="px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Trending Now
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/5">
                Live
              </span>
            </h2>
            <p className="text-white/40 text-xs font-medium mt-0.5">Top rated streams for you</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 ${canScrollLeft
              ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              : "bg-black/20 text-white/20 cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 ${canScrollRight
              ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              : "bg-black/20 text-white/20 cursor-not-allowed"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="w-full overflow-hidden py-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 md:px-16 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {streamers.map((streamer) => (
            <div key={streamer.id} className="snap-start">
              <StreamerCard streamer={streamer} />
            </div>
          ))}

          {/* Spacer for right padding */}
          <div className="w-12 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
