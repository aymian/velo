"use client"


import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '../OnboardingLayout';
import { useRouter } from 'next/navigation';
import { CheckCircle, Coins, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Step6Reward() {
    // NOTE: Repurposing Step 6 for Reward/Completion
    const {
        privacySettings,
        identityType,
        interests,
        is18Verified,
    } = useOnboardingStore();

    const { user } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    // Coin Animation
    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 0;
            const end = 500; // Updated amount
            const duration = 1500;
            const incrementTime = duration / end;

            const counter = setInterval(() => {
                start += 5;
                if (start > end) start = end;
                setBalance(start);
                if (start === end) clearInterval(counter);
            }, incrementTime);

            return () => clearInterval(counter);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            if (user) {
                // Save to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    identityType,
                    interests,
                    is18Verified,
                    privacySettings,
                    onboardingCompleted: true,
                    onboardingCompletedAt: serverTimestamp(),
                    coinsBalance: 500, // Welcome bonus
                }, { merge: true });
            }

            router.push('/discover');
        } catch (error) {
            console.error("Error saving onboarding data:", error);
            router.push('/discover');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={6}
            totalSteps={6}
            title="Your access is unlocked."
            description="Welcome to the inner circle."
        >
            <div className="flex flex-col items-center justify-center py-6 space-y-10">

                <div className="relative">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-32 h-32 rounded-full bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center relative z-10 shadow-[0_0_40px_-10px_rgba(255,45,85,0.3)]"
                    >
                        <Coins className="w-14 h-14 text-[#FF2D55]" />
                    </motion.div>
                </div>

                <div className="text-center space-y-2">
                    <div className="text-sm font-bold text-[#FF2D55] uppercase tracking-widest">Welcome Gift</div>
                    <motion.div
                        key={balance}
                        className="text-7xl font-bold text-white tracking-tighter"
                    >
                        {balance}
                    </motion.div>
                    <p className="text-[#A1A1AA] text-base font-medium">Free credits added to your account</p>
                </div>

                <div className="w-full space-y-4">
                    <div className="w-full bg-[#16161D] border border-[#27272A] rounded-lg p-4 text-center">
                        <p className="text-[#71717A] text-sm flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#FF2D55]" />
                            <span className="font-medium">Valid for your first session only</span>
                        </p>
                    </div>

                    <Button
                        onClick={handleComplete}
                        disabled={isLoading}
                        className="w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg shadow-lg shadow-[#FF2D55]/20 transition-all"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Unlocking...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Enter Live Rooms
                                <CheckCircle className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
