import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '../OnboardingLayout';
import { Globe, Lock, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Step4Interests() {
    // NOTE: Repurposing Step 4 for "Privacy Control"
    const { nextStep } = useOnboardingStore();
    const [privacyMode, setPrivacyMode] = useState<string | null>(null);

    const privacyOptions = [
        {
            id: 'public',
            icon: Globe,
            title: "Public Profile",
            subtitle: "Visible on leaderboards & chat"
        },
        {
            id: 'private',
            icon: Lock,
            title: "Private Mode",
            subtitle: "Only friends can see you"
        },
        {
            id: 'invisible',
            icon: Ghost,
            title: "Invisible Viewer",
            subtitle: "Browse without being seen"
        }
    ];

    const handleContinue = () => {
        if (privacyMode) {
            nextStep();
        }
    };

    return (
        <OnboardingLayout
            currentStep={4}
            totalSteps={6}
            title="How visible do you want to be?"
            description=""
        >
            <div className="space-y-8">
                <div className="grid gap-3">
                    {privacyOptions.map((option) => {
                        const isSelected = privacyMode === option.id;
                        return (
                            <div
                                key={option.id}
                                onClick={() => setPrivacyMode(option.id)}
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
                                    <option.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-medium text-lg transition-colors",
                                        isSelected ? "text-white" : "text-[#E4E4E7]"
                                    )}>{option.title}</h3>
                                    <p className="text-sm text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">{option.subtitle}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={!privacyMode}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                            !privacyMode && "opacity-50 grayscale cursor-not-allowed shadow-none bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
