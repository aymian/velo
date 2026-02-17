"use client";

import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Dynamic imports to avoid hydration issues with localStorage persistence
const Step1AgeGate = dynamic(() => import('@/components/onboarding/steps/Step1AgeGate'), { ssr: false });
const Step2Consent = dynamic(() => import('@/components/onboarding/steps/Step2Consent'), { ssr: false });
const Step3Profile = dynamic(() => import('@/components/onboarding/steps/Step3Profile'), { ssr: false });
const Step4Social = dynamic(() => import('@/components/onboarding/steps/Step4Social'), { ssr: false });
const Step5Notifications = dynamic(() => import('@/components/onboarding/steps/Step5Notifications'), { ssr: false });
const Step6Reward = dynamic(() => import('@/components/onboarding/steps/Step6Reward'), { ssr: false });

function OnboardingContent() {
    const { step, reset, setStep } = useOnboardingStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!user?.uid) {
                router.push('/login');
                return;
            }

            // Handle query parameters for direct step access (e.g., ?step=3 or ?firstep=step3)
            const stepParam = searchParams.get('step') || searchParams.get('firstep');
            if (stepParam) {
                let targetStep = 1;
                const cleanParam = stepParam.toLowerCase();

                if (cleanParam.includes('step')) {
                    targetStep = parseInt(cleanParam.replace('step', '')) || 1;
                } else if (!isNaN(parseInt(cleanParam))) {
                    targetStep = parseInt(cleanParam);
                }

                if (targetStep >= 1 && targetStep <= 6) {
                    setStep(targetStep);
                }
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.onboardingCompleted === true) {
                        router.push('/discover');
                        return;
                    }
                } else {
                    if (!stepParam) reset();
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                if (!stepParam) reset();
            } finally {
                setIsChecking(false);
            }
        };

        checkOnboardingStatus();
    }, [user, router, reset, searchParams, setStep]);

    // Sync current step with URL
    useEffect(() => {
        if (!isChecking) {
            const currentParams = new URLSearchParams(searchParams.toString());
            if (currentParams.get('step') !== step.toString()) {
                currentParams.set('step', step.toString());
                router.replace(`/onboarding?${currentParams.toString()}`);
            }
        }
    }, [step, router, searchParams, isChecking]);

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1AgeGate />;
            case 2: return <Step2Consent />;
            case 3: return <Step3Profile />;
            case 4: return <Step4Social />;
            case 5: return <Step5Notifications />;
            case 6: return <Step6Reward />;
            default: return <Step1AgeGate />;
        }
    };

    // Show loading while checking onboarding status
    if (isChecking) {
        return (
            <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full h-full flex items-center justify-center z-10 p-4"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center text-white">
                Loading onboarding...
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    );
}
