import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '../OnboardingLayout';
import { Video, Lock, Heart, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Step2Consent() {
    // NOTE: This step is now "Intent Question" based on new design
    const { nextStep } = useOnboardingStore();
    const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

    const intents = [
        {
            id: 'live',
            icon: Video,
            title: "Watch live shows",
        },
        {
            id: 'private',
            icon: Lock,
            title: "Private interaction",
        },
        {
            id: 'support',
            icon: Heart,
            title: "Support creators",
        },
        {
            id: 'explore',
            icon: Search,
            title: "Just exploring",
        }
    ];

    const handleContinue = () => {
        if (selectedIntent) {
            nextStep();
        }
    };

    return (
        <OnboardingLayout
            currentStep={2}
            totalSteps={6}
            title="What brings you here tonight?"
            description=""
        >
            <div className="space-y-8">
                <div className="grid gap-3">
                    {intents.map((intent) => {
                        const isSelected = selectedIntent === intent.id;
                        return (
                            <div
                                key={intent.id}
                                onClick={() => setSelectedIntent(intent.id)}
                                className={cn(
                                    "flex items-center gap-4 p-5 rounded-lg border transition-all duration-200 cursor-pointer group",
                                    isSelected
                                        ? "bg-[#16161D] border-[#FF2D55] shadow-[0_0_15px_-3px_rgba(255,45,85,0.2)]"
                                        : "bg-[#16161D] border-[#27272A] hover:border-[#FF2D55]/50 hover:scale-[1.02]"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-lg transition-colors",
                                    isSelected ? "bg-[#FF2D55] text-white" : "bg-[#27272A] text-[#A1A1AA] group-hover:text-white"
                                )}>
                                    <intent.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-medium text-lg transition-colors",
                                        isSelected ? "text-white" : "text-[#E4E4E7]"
                                    )}>{intent.title}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedIntent}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                            !selectedIntent && "opacity-50 grayscale cursor-not-allowed shadow-none bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
