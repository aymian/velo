import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '../OnboardingLayout';
import { Moon, Calendar, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Step3Identity() {
    // NOTE: Repurposing this step for "Frequency" as per new design
    // In a real app, we'd rename the component or store field
    const { nextStep } = useOnboardingStore();
    const [frequency, setFrequency] = useState<string | null>(null);

    const frequencies = [
        {
            id: 'occasionally',
            icon: Calendar,
            title: "Occasionally",
            subtitle: "A few times a month"
        },
        {
            id: 'weekly',
            icon: Clock,
            title: "A few times a week",
            subtitle: "Regular check-ins"
        },
        {
            id: 'daily',
            icon: Zap,
            title: "Daily",
            subtitle: "Don't want to miss anything"
        },
        {
            id: 'nightly',
            icon: Moon,
            title: "Late nights only",
            subtitle: "After hours vibe"
        }
    ];

    const handleContinue = () => {
        if (frequency) {
            // We could save this to store here
            nextStep();
        }
    };

    return (
        <OnboardingLayout
            currentStep={3}
            totalSteps={6}
            title="How often do you plan to visit?"
            description=""
        >
            <div className="space-y-8">
                <div className="grid gap-3">
                    {frequencies.map((freq) => {
                        const isSelected = frequency === freq.id;
                        return (
                            <div
                                key={freq.id}
                                onClick={() => setFrequency(freq.id)}
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
                                    <freq.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-medium text-lg transition-colors",
                                        isSelected ? "text-white" : "text-[#E4E4E7]"
                                    )}>{freq.title}</h3>
                                    <p className="text-sm text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">{freq.subtitle}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={!frequency}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                            !frequency && "opacity-50 grayscale cursor-not-allowed shadow-none bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
