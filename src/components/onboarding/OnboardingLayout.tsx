import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title?: string;
  description?: string;
}

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F0F14] text-white font-sans antialiased py-10 px-4">
      <div className="w-full max-w-[420px] space-y-8">

        {/* Progress Dots - Premium Minimal */}
        <div className="flex justify-center gap-3 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i + 1 === currentStep
                  ? "bg-[#FF2D55] scale-110"
                  : i + 1 < currentStep
                    ? "bg-[#FF2D55]/50"
                    : "border border-[#27272A] bg-transparent"
              )}
            />
          ))}
        </div>

        {/* Main Card Content - Motion Wrapper */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="w-full relative">
            {(title || description) && (
              <div className="mb-8 text-center space-y-3">
                {title && <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>}
                {description && <p className="text-[15px] text-[#A1A1AA] leading-relaxed max-w-[95%] mx-auto font-medium">{description}</p>}
              </div>
            )}

            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
