import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '../OnboardingLayout';
import { User, Star, Crown, Trophy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Step5Reward() {
    // NOTE: Repurposing Step 5 for "Identity Selection"
    const { nextStep } = useOnboardingStore();
    const [identity, setIdentity] = useState<string | null>(null);

    const identities = [
        {
            id: 'viewer',
            icon: User,
            title: "Viewer",
            subtitle: "Browse and discover"
        },
        {
            id: 'supporter',
            icon: Star,
            title: "Supporter",
            subtitle: "Follow favorite creators"
        },
        {
            id: 'vip',
            icon: Crown,
            title: "VIP",
            subtitle: "Exclusive access"
        },
        {
            id: 'gifter',
            icon: Trophy,
            title: "Top Gifter",
            subtitle: "Compete on leaderboards"
        }
    ];

    const handleContinue = () => {
        if (identity) {
            nextStep();
        }
    };

    return (
        <OnboardingLayout
            currentStep={5}
            totalSteps={6}
            title="Choose how you want to be recognized."
            description=""
        >
            <div className="space-y-8">
                <div className="grid gap-3">
                    {identities.map((item) => {
                        const isSelected = identity === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() => setIdentity(item.id)}
                                className={cn(
                                    "flex items-center gap-4 p-5 rounded-lg border transition-all duration-200 cursor-pointer group relative overflow-hidden",
                                    isSelected
                                        ? "bg-[#2A1A20] border-[#FF2D55] shadow-[0_0_15px_-3px_rgba(255,45,85,0.2)]"
                                        : "bg-[#16161D] border-[#27272A] hover:border-[#FF2D55]/50 hover:scale-[1.02]"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-lg transition-colors",
                                    isSelected ? "bg-[#FF2D55] text-white" : "bg-[#27272A] text-[#A1A1AA] group-hover:text-white"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-medium text-lg transition-colors",
                                        isSelected ? "text-white" : "text-[#E4E4E7]"
                                    )}>{item.title}</h3>
                                    <p className="text-sm text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">{item.subtitle}</p>
                                </div>

                                {isSelected && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[#FF2D55] text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={!identity}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                            !identity && "opacity-50 grayscale cursor-not-allowed shadow-none bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
