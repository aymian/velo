"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Role = "member" | "creator" | null;
type Plan = "free" | "pro" | "elite" | null;

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [agreed, setAgreed] = useState(false);

  const totalSteps = 6;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const finish = () => {
    // Later save to Firestore
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 — Welcome */}
          {step === 1 && (
            <MotionWrapper key="step1">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Velo 🔥
              </h1>
              <p className="text-white/60 mb-8">
                A premium space where creators shine and members connect.
              </p>
              <PrimaryButton onClick={next}>
                Get Started <ArrowRight size={18} />
              </PrimaryButton>
            </MotionWrapper>
          )}

          {/* STEP 2 — Role Selection */}
          {step === 2 && (
            <MotionWrapper key="step2">
              <h2 className="text-2xl font-semibold mb-6">
                Choose Your Role
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <RoleCard
                  title="Member"
                  description="Browse, follow, chat and discover creators."
                  active={role === "member"}
                  onClick={() => setRole("member")}
                />
                <RoleCard
                  title="Creator"
                  description="Upload content, earn money and grow audience."
                  active={role === "creator"}
                  onClick={() => setRole("creator")}
                />
              </div>

              <div className="mt-8">
                <PrimaryButton onClick={next} disabled={!role}>
                  Continue
                </PrimaryButton>
              </div>
            </MotionWrapper>
          )}

          {/* STEP 3 — Profile */}
          {step === 3 && (
            <MotionWrapper key="step3">
              <h2 className="text-2xl font-semibold mb-6">
                Set Up Your Profile
              </h2>

              <div className="space-y-4">
                <Input placeholder="Display Name" />
                <Input placeholder="Username" />
                <Input placeholder="Short Bio" />
              </div>

              <div className="mt-8 flex justify-between">
                <SecondaryButton onClick={back}>Back</SecondaryButton>
                <PrimaryButton onClick={next}>Continue</PrimaryButton>
              </div>
            </MotionWrapper>
          )}

          {/* STEP 4 — Conditional */}
          {step === 4 && (
            <MotionWrapper key="step4">
              {role === "creator" ? (
                <>
                  <h2 className="text-2xl font-semibold mb-6">
                    Creator Setup
                  </h2>
                  <p className="text-white/60 mb-6">
                    Creators earn from subscriptions, tips and boosted visibility.
                  </p>
                  <Input placeholder="Content Category" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-6">
                    What Are You Looking For?
                  </h2>
                  <Input placeholder="Dating, Entertainment, Networking..." />
                </>
              )}

              <div className="mt-8 flex justify-between">
                <SecondaryButton onClick={back}>Back</SecondaryButton>
                <PrimaryButton onClick={next}>Continue</PrimaryButton>
              </div>
            </MotionWrapper>
          )}

          {/* STEP 5 — Plan Selection */}
          {step === 5 && (
            <MotionWrapper key="step5">
              <h2 className="text-2xl font-semibold mb-6">
                Choose Your Plan
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <PlanCard
                  name="Free"
                  price="$0"
                  active={plan === "free"}
                  onClick={() => setPlan("free")}
                />
                <PlanCard
                  name="Pro"
                  price="$29"
                  active={plan === "pro"}
                  popular
                  onClick={() => setPlan("pro")}
                />
                <PlanCard
                  name="Elite"
                  price="$79"
                  active={plan === "elite"}
                  onClick={() => setPlan("elite")}
                />
              </div>

              <div className="mt-8 flex justify-between">
                <SecondaryButton onClick={back}>Back</SecondaryButton>
                <PrimaryButton onClick={next}>Continue</PrimaryButton>
              </div>
            </MotionWrapper>
          )}

          {/* STEP 6 — Agreement */}
          {step === 6 && (
            <MotionWrapper key="step6">
              <h2 className="text-2xl font-semibold mb-6">
                Community Guidelines
              </h2>

              <p className="text-white/60 mb-6">
                Respectful communication, proper content standards, and
                responsible monetization are required.
              </p>

              <div
                onClick={() => setAgreed(!agreed)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center",
                  agreed
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 border-none"
                    : "border-white/40"
                )}>
                  {agreed && <Check size={14} />}
                </div>
                <span>I agree to the guidelines</span>
              </div>

              <div className="mt-8 flex justify-between">
                <SecondaryButton onClick={back}>Back</SecondaryButton>
                <PrimaryButton
                  onClick={finish}
                  disabled={!agreed}
                >
                  Finish
                </PrimaryButton>
              </div>
            </MotionWrapper>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* COMPONENTS */

function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="px-4 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40"
    >
      {children}
    </button>
  );
}

function RoleCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-6 rounded-xl border cursor-pointer transition-all",
        active
          ? "border-purple-500 bg-gradient-to-br from-purple-600/20 to-pink-500/20"
          : "border-white/10 bg-white/5 hover:border-white/30"
      )}
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-white/60 text-sm mt-2">{description}</p>
    </div>
  );
}

function PlanCard({
  name,
  price,
  active,
  popular,
  onClick,
}: {
  name: string;
  price: string;
  active: boolean;
  popular?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-6 rounded-xl border cursor-pointer transition-all relative",
        active
          ? "border-purple-500 bg-gradient-to-br from-purple-600/20 to-pink-500/20"
          : "border-white/10 bg-white/5 hover:border-white/30"
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-2xl font-bold mt-2">{price}/mo</p>
    </div>
  );
}