"use client";

import { useOnboardingStore } from '@/store/onboarding-store';
import { OnboardingLayout } from '../OnboardingLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Bell, BellRing, Shield, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export default function Step5Notifications() {
    const { nextStep, updatePrivacy, privacySettings } = useOnboardingStore();
    const [isEnabled, setIsEnabled] = useState(privacySettings.notifications);
    const [isRequesting, setIsRequesting] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        updatePrivacy('notifications', checked);
    };

    const requestPermission = async () => {
        setIsRequesting(true);
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                handleToggle(true);
            }
        }
        setIsRequesting(false);
        nextStep();
    };

    return (
        <OnboardingLayout
            currentStep={5}
            totalSteps={6}
            title="Stay in the loop"
            description="Enable notifications to never miss an update, message, or a new post from creators."
        >
            <div className="space-y-8">
                <div className="flex justify-center py-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#FF2D55]/10 flex items-center justify-center animate-pulse">
                            <BellRing className="w-12 h-12 text-[#FF2D55]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#FF2D55] border-4 border-[#0F0F14] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white fill-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-xl bg-[#16161D] border border-[#27272A] group hover:border-[#FF2D55]/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center group-hover:bg-[#FF2D55]/20 transition-colors">
                                <Shield className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#FF2D55]" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Push Notifications</h3>
                                <p className="text-xs text-[#71717A]">Posts, Mentions, and Updates</p>
                            </div>
                        </div>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={handleToggle}
                            className="data-[state=checked]:bg-[#FF2D55]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-[#16161D]/50 border border-[#27272A] space-y-2">
                            <CheckCircle2 className="w-4 h-4 text-[#FF2D55]" />
                            <p className="text-xs text-[#E4E4E7] font-medium">Instant Alerts</p>
                            <p className="text-[10px] text-[#71717A]">Real-time engagement tracking</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#16161D]/50 border border-[#27272A] space-y-2">
                            <CheckCircle2 className="w-4 h-4 text-[#FF2D55]" />
                            <p className="text-xs text-[#E4E4E7] font-medium">Smart Batching</p>
                            <p className="text-[10px] text-[#71717A]">Optimized for your timezone</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <Button
                        onClick={requestPermission}
                        disabled={isRequesting}
                        className="w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-xl transition-all shadow-lg shadow-[#FF2D55]/20"
                    >
                        {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enable Notifications"}
                    </Button>
                    <Button
                        onClick={nextStep}
                        variant="ghost"
                        className="text-[#71717A] hover:text-white font-medium h-10"
                    >
                        Maybe Later
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
