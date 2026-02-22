"use client";

import React, { useMemo } from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PLAN_PRICING = {
  basic: { monthly: 9, yearly: 75 },
  pro: { monthly: 29, yearly: 203 },
  elite: { monthly: 79, yearly: 553 },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const plan = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";

  const price = useMemo(() => {
    return PLAN_PRICING[plan as keyof typeof PLAN_PRICING]?.[
      billing as "monthly" | "yearly"
    ];
  }, [plan, billing]);

  const handlePayment = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Navigate to checkout with plan and billing info
    router.push(`/checkout?plan=${plan}&billing=${billing}`);
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-[1300px] mx-auto flex pt-16">
        <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/10 hidden sm:block">
          <XSidebar />
        </header>

        <main className="flex-grow sm:ml-[72px] xl:ml-[275px] px-6 py-12">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

            {/* Left Side - Plan Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold capitalize">
                {plan} Plan
              </h2>

              <p className="text-white/50 mt-2">
                {billing === "monthly"
                  ? "Billed monthly"
                  : "Billed yearly (30% discount applied)"}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">
                  ${price}
                </span>
                <span className="text-white/40 ml-2">
                  /{billing === "monthly" ? "month" : "year"}
                </span>
              </div>

              <div className="mt-10 space-y-4 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-pink-500" />
                  Unlimited content access
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-pink-500" />
                  Priority support
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-pink-500" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            {/* Right Side - Payment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-medium mb-6">
                Secure Payment
              </h3>

              <div className="space-y-4 text-sm text-white/60 mb-8">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  256-bit SSL encryption
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Secure payment processing
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full rounded-xl py-4 text-sm font-semibold text-white transition-all active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #ff2d55 100%)",
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.35)",
                }}
              >
                Confirm & Pay ${price}
              </button>

              <p className="text-white/40 text-xs mt-6 text-center">
                By continuing, you agree to our Terms & Subscription Policy.
              </p>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
}