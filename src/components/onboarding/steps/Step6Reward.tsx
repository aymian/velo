"use client";

import { useOnboardingStore } from '@/store/onboarding-store';
import { OnboardingLayout } from '../OnboardingLayout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Coins, CheckCircle2, Loader2, PartyPopper, ArrowRight, User } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Step6Reward() {
    const {
        username, phoneNumber, birthDate, gender, bio, profilePic, coins,
        privacySettings, onboardingCompleted, completeOnboarding
    } = useOnboardingStore();
    const { user: currentUser } = useAuthStore();
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [showParty, setShowParty] = useState(false);

    useEffect(() => {
        // Trigger celebration after 500ms
        const timer = setTimeout(() => setShowParty(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFinish = async () => {
        if (!currentUser) return;

        setIsSaving(true);
        try {
            const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
            await updateDoc(userRef, {
                username,
                phoneNumber,
                birthDate,
                gender,
                bio,
                photoURL: profilePic || currentUser.photoURL,
                coins: coins,
                onboardingCompleted: true,
                updatedAt: serverTimestamp(),
                privacySettings: privacySettings
            });

            completeOnboarding();
            router.push('/discover');
        } catch (error) {
            console.error("Error completing onboarding:", error);
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={6}
            totalSteps={6}
            title="You're all set!"
            description="Welcome to the community. Your account is ready and your reward is waiting."
        >
            <div className="space-y-8 relative">
                {/* Reward Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="bg-gradient-to-br from-[#1A1A24] to-[#16161D] border border-[#FF2D55]/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-[0_0_40px_-10px_rgba(255,45,85,0.3)]"
                >
                    {/* Background Shine */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF2D55]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#FF2D55]/10 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-[#FF2D55] flex items-center justify-center shadow-[0_0_20px_rgba(255,45,85,0.5)]">
                                <Coins className="w-10 h-10 text-white animate-bounce" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white">{coins}</h2>
                            <p className="text-sm font-bold text-[#FF2D55] uppercase tracking-[0.2em]">Starter Coins</p>
                        </div>

                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center">
                                <User className="w-4 h-4 text-[#A1A1AA]" />
                            </div>
                            <span className="text-lg font-bold text-white">@{username}</span>
                        </div>
                    </div>

                    {showParty && (
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Simple CSS Confetti Mock */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 0, x: 0, opacity: 1 }}
                                    animate={{
                                        y: Math.random() * -200 - 50,
                                        x: (Math.random() - 0.5) * 200,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i % 2 === 0 ? '#FF2D55' : '#FFD700' }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#16161D]/50 border border-[#27272A]">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Profile Verified</p>
                            <p className="text-xs text-[#71717A]">Your account has been successfully set up and secured.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={handleFinish}
                        disabled={isSaving}
                        className="w-full bg-white hover:bg-[#E4E4E7] text-black font-black h-14 text-lg rounded-xl transition-all shadow-xl group"
                    >
                        {isSaving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Start Exploring <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
