"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const { user } = useAuthStore();

  const plans = {
    basic: { price: 9, description: "Starter access for creators & members" },
    pro: { price: 29, description: "Most popular — full growth power" },
    elite: { price: 79, description: "Ultimate visibility & earning power" },
  };

  const selectedPlan = plans[plan as keyof typeof plans];

  const handleCheckout = async () => {
    // Later connect Stripe / Firebase function here
    console.log("Proceeding with:", plan);
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-[1300px] mx-auto flex pt-16">
        <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/10 hidden sm:block">
          <XSidebar />
        </header>

        <main className="flex-grow sm:ml-[72px] xl:ml-[275px] px-6 py-12 flex items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl grid md:grid-cols-2 gap-8"
          >
            {/* LEFT SIDE - SUMMARY */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6"
              >
                <ArrowLeft size={18} /> Back
              </button>

              <h2 className="text-2xl font-bold mb-2 capitalize">{plan} Plan</h2>
              <p className="text-white/60 mb-6">{selectedPlan.description}</p>

              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
                ${selectedPlan.price}/month
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="text-purple-400 w-4 h-4" />
                  Unlimited content access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-400 w-4 h-4" />
                  Chat & file sharing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-400 w-4 h-4" />
                  Priority visibility
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-400 w-4 h-4" />
                  Earnings monetization tools
                </li>
              </ul>
            </div>

            {/* RIGHT SIDE - PAYMENT */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Payment Details</h3>

              {/* Card Form (UI Only) */}
              <div className="space-y-4">
                <input
                  placeholder="Cardholder Name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  placeholder="Card Number"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="MM/YY"
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    placeholder="CVC"
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #ff2d55 100%)",
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.35)",
                }}
              >
                Upgrade to {plan}
              </button>

              <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
                <Shield size={14} />
                Secure encrypted payment
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}