import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingLayout } from '../OnboardingLayout';

export default function Step1AgeGate() {
    const { nextStep, setAgeVerified } = useOnboardingStore();

    const [isEighteen, setIsEighteen] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const canProceed = isEighteen && agreedToTerms;

    const handleConfirm = () => {
        if (canProceed) {
            setAgeVerified(true);
            nextStep();
        }
    };

    return (
        <OnboardingLayout
            currentStep={1}
            totalSteps={6}
            title="Are you 18 or older?"
            description="This platform contains explicit adult live content. By entering, you confirm that you are of legal age."
        >
            <div className="space-y-8">
                <div className="flex justify-center py-4">
                    <div className="bg-[#27272A]/50 p-4 rounded-full border border-[#27272A] shadow-inner">
                        <ShieldAlert className="w-10 h-10 text-[#FF2D55]" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div
                        className="flex items-center space-x-4 p-4 rounded-lg border border-[#27272A] hover:border-[#FF2D55]/50 transition-all bg-[#0F0F14] cursor-pointer group"
                        onClick={() => setIsEighteen(!isEighteen)}
                    >
                        <Checkbox
                            id="eighteen"
                            checked={isEighteen}
                            onCheckedChange={() => { }} // Controlled by the div click
                            className="border-[#3F3F46] data-[state=checked]:bg-[#FF2D55] data-[state=checked]:border-[#FF2D55] w-6 h-6 rounded"
                        />
                        <Label htmlFor="eighteen" className="text-lg font-medium text-white cursor-pointer flex-1 group-hover:text-white transition-colors">
                            Yes, I am 18+
                        </Label>
                    </div>

                    <div
                        className="flex items-center space-x-4 p-4 rounded-lg border border-[#27272A] hover:border-[#FF2D55]/50 transition-all bg-[#0F0F14] cursor-pointer group"
                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                    >
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={() => { }} // Controlled by the div click
                            className="border-[#3F3F46] data-[state=checked]:bg-[#FF2D55] data-[state=checked]:border-[#FF2D55] w-6 h-6 rounded"
                        />
                        <Label htmlFor="terms" className="text-base font-medium text-[#A1A1AA] cursor-pointer flex-1 group-hover:text-white transition-colors">
                            I agree to the <span className="text-white underline decoration-white/30 underline-offset-4">Terms & Conditions</span>
                        </Label>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <Button
                        onClick={handleConfirm}
                        disabled={!canProceed}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                            !canProceed && "opacity-50 grayscale cursor-not-allowed shadow-none bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Enter Veeloo
                    </Button>
                    <Button variant="ghost" className="w-full text-[#52525B] hover:text-[#A1A1AA] hover:bg-transparent h-auto py-2 text-sm font-medium tracking-wide uppercase" onClick={() => window.location.href = 'https://google.com'}>
                        I am under 18
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
