"use client";

import { Download, Smartphone, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-20">

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Download Veeloo
        </h1>

        <p className="text-gray-300 text-lg mb-12">
          Experience premium HD video & crystal-clear audio calls.
          Fast. Secure. Private.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Link
            href="#"
            className="px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 
            bg-gradient-to-r from-pink-500 to-purple-600 
            hover:opacity-90 transition shadow-lg shadow-purple-900/40"
          >
            <Download size={20} />
            Download for Android
          </Link>

          <Link
            href="#"
            className="px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 
            border border-pink-500 
            hover:bg-pink-500/10 transition"
          >
            <Download size={20} />
            Download for iOS
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-zinc-900/70 backdrop-blur-md p-8 rounded-3xl text-center border border-purple-800/30 hover:border-pink-500/40 transition">
          <Smartphone className="mx-auto mb-4 text-pink-500" size={36} />
          <h3 className="font-semibold text-xl mb-2">HD Video Calls</h3>
          <p className="text-gray-400 text-sm">
            Smooth, high-quality private calls anytime.
          </p>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-md p-8 rounded-3xl text-center border border-purple-800/30 hover:border-pink-500/40 transition">
          <ShieldCheck className="mx-auto mb-4 text-purple-500" size={36} />
          <h3 className="font-semibold text-xl mb-2">Secure & Private</h3>
          <p className="text-gray-400 text-sm">
            Protected with modern real-time technology.
          </p>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-md p-8 rounded-3xl text-center border border-purple-800/30 hover:border-pink-500/40 transition">
          <Zap className="mx-auto mb-4 text-pink-500" size={36} />
          <h3 className="font-semibold text-xl mb-2">Instant Connection</h3>
          <p className="text-gray-400 text-sm">
            Ultra-fast call setup with low latency.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-24 text-gray-500 text-sm">
        © {new Date().getFullYear()} Veeloo. All rights reserved.
      </div>
    </div>
  );
}