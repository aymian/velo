"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Youtube,
  Instagram,
  Smartphone,
  Globe,
  Mail,
  ShieldCheck,
  Heart,
  ArrowRight,
  Send
} from "lucide-react";
import { VeloLogo } from "./VeloLogo";
import { TypewriterEffect } from "./ui/TypewriterEffect";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
  community: [
    { name: "Guidelines", href: "/guidelines" },
    { name: "Safety Center", href: "/safety" },
    { name: "Creator Fund", href: "/fund" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Law Enforcement", href: "/law-enforcement" },
  ]
};

export default function VeloFooter() {
  return (
    <footer className="relative mt-40 z-30">

      {/* 1. Netflix-style Floating CTA Card */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-40">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/10 p-12 md:p-16 shadow-2xl flex flex-col items-center text-center">

          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-900/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight min-h-[1.2em]">
              <TypewriterEffect text="Ready to start your journey?" delay={0.2} />
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto min-h-[3em]">
              <TypewriterEffect text="Enter your email to create your account or restart your membership. Join the Velo community today." delay={1.5} cursorColor="#a1a1aa" />
            </p>

            {/* Email Input Group */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-2xl mx-auto pt-6">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-black/50 text-white border border-white/20 rounded-md px-6 py-4 text-base outline-none focus:border-[#ff1493] focus:ring-1 focus:ring-[#ff1493] transition-all placeholder:text-zinc-500 hover:bg-black/70"
              />

              <button className="flex items-center justify-center gap-2 bg-[#ff1493] hover:bg-[#ff0080] text-white px-8 py-4 rounded-md font-bold text-lg whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="bg-black pt-96 pb-20 border-t border-white/5 relative overflow-hidden">

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20 border-b border-white/5 pb-16">

            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-8 pr-8">
              <VeloLogo className="mb-2 scale-110 origin-left" />
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Velo is where the world comes to play. High-fidelity streaming, instant connections, and a creator-first economy.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Connect with us</h4>
                <div className="flex gap-4">
                  {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ y: -4, color: "#fff" }}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#ff1493] hover:border-transparent hover:shadow-[0_0_20px_rgba(255,20,147,0.4)] transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            {[
              { title: "Company", links: footerLinks.company },
              { title: "Community", links: footerLinks.community },
              { title: "Legal", links: footerLinks.legal }
            ].map((column) => (
              <div key={column.title} className="lg:col-span-1">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-base">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-zinc-500 hover:text-white text-sm font-medium transition-colors block w-fit hover:translate-x-1 duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Newsletter / Contact Quick Send */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-pink-500">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-white font-bold">Suggestions or Feedback?</h5>
                <p className="text-zinc-500 text-sm">Directly message the Velo team.</p>
              </div>
            </div>

            <div className="relative w-full max-w-md group">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-black/50 border border-white/10 rounded-full pl-5 pr-14 py-3 text-sm text-white focus:border-pink-500 focus:outline-none transition-colors"
              />
              <button className="absolute right-1 top-1 bottom-1 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <span>&copy; {new Date().getFullYear()} Velo Inc.</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <span>Made in San Francisco</span>
              </div>
              <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
                <Globe className="w-3 h-3" />
                English (US)
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}