"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Suspense, useState } from "react";
import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    FileLock2,
    MessageSquareLock,
    Ban,
    EyeOff,
    Smartphone,
    Users,
    Zap,
    CheckCircle2,
    TrendingUp,
    Clock,
    Heart,
    Camera,
    User,
    Mail,
    Bell,
    Smartphone as PushIcon,
    Wallet,
    Send,
    Sparkles,
    Search,
    Check,
    Lock,
    Unlock
} from "lucide-react";

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const stepStr = searchParams.get("step") || "1";
    const step = parseInt(stepStr);
    const nameParam = searchParams.get("name") || "Yves Ishimwe";
    const emailParam = searchParams.get("email") || "yvesishimwe20252026@gmail.com";

    const [interests, setInterests] = useState<string[]>([]);
    const [contentPref, setContentPref] = useState<string>("Casual");
    const [username, setUsername] = useState(nameParam.split(" ")[0].toLowerCase() + Math.floor(Math.random() * 100));
    const [followedCount, setFollowedCount] = useState(0);
    const [selectedAmount, setSelectedAmount] = useState<number>(10);

    const nextStep = (next: string | number) => {
        const params = new URLSearchParams(searchParams);
        params.set("step", next.toString());
        router.push(`/onboarding?${params.toString()}`);
    };

    const prevStep = () => nextStep(step - 1);

    const Layout = ({ children, title, hideBack = false }: {
        children: React.ReactNode,
        title: string,
        hideBack?: boolean,
    }) => (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0B0B0F] font-sans text-white">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-[3px] bg-[#111217] z-50">
                <div
                    className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
                    style={{ width: `${(step / 20) * 100}%` }}
                />
            </div>

            <div className="w-full max-w-[550px] bg-[#111217] rounded-[2.5rem] p-10 md:p-12 flex flex-col gap-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] border border-[#1F2937]">
                <div className="flex items-center gap-6">
                    {!hideBack && (
                        <button
                            onClick={prevStep}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#333333] transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] m-0">
                        {title}
                    </h1>
                </div>
                <div className="flex-1 flex flex-col justify-start">
                    {children}
                </div>
            </div>
        </div>
    );

    if (step === 1) {
        return (
            <Layout title="Welcome" hideBack>
                <div className="space-y-8">
                    <div className="flex items-center gap-6 p-6 bg-[#181920] rounded-[2rem] border border-white/5">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-white text-black font-bold text-2xl uppercase">
                                {nameParam[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-bold text-2xl mb-1">{nameParam}</div>
                            <div className="text-lg text-[#9CA3AF] leading-[1.5]">{emailParam}</div>
                        </div>
                    </div>
                    <p className="text-lg text-[#999999] leading-[1.6] m-0 text-center max-w-[700px] mx-auto">
                        By continuing, you agree to our terms. We prioritize your privacy and anonymity above all else.
                    </p>
                    <button
                        onClick={() => nextStep(2)}
                        className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                    >
                        Agree & Join
                    </button>
                </div>
            </Layout>
        );
    }

    if (step === 2) {
        return (
            <Layout title="Verify Age">
                <div className="space-y-10 text-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl text-white font-bold m-0">Are you 18 or older?</h2>
                        <p className="text-lg text-[#999999] leading-[1.5] m-0 max-w-[600px] mx-auto">
                            To maintain legal compliance and community safety, we require all users to be of legal age.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
                        <button
                            onClick={() => nextStep(3)}
                            className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                        >
                            Yes, I am over 18
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full h-16 rounded-full bg-transparent border-2 border-[#444444] text-white font-bold text-xl hover:bg-[#111217] transition-all"
                        >
                            No
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (step === 3) {
        return (
            <Layout title="Privacy">
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-xl text-[#999999] font-medium m-0">Your security is our priority.</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {[
                            { icon: CreditCard, label: "Secure Payments", desc: "PCI compliant transactions." },
                            { icon: FileLock2, label: "Discreet Billing", desc: "Appear invisibly on statements." },
                            { icon: MessageSquareLock, label: "Encrypted Chat", desc: "End-to-end signal privacy." },
                            { icon: ShieldCheck, label: "Identity Protection", desc: "We never share your data." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-6 p-6 bg-[#181920] rounded-[1.5rem] border-2 border-transparent hover:border-white/10 transition-all">
                                <item.icon size={32} className="shrink-0" />
                                <div>
                                    <div className="text-xl font-bold mb-0.5">{item.label}</div>
                                    <div className="text-sm text-[#999999]">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => nextStep(4)}
                        className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                    >
                        Continue Securely
                    </button>
                </div>
            </Layout>
        );
    }

    if (step === 4) {
        return (
            <Layout title="Community Rules">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {[
                            { icon: Ban, label: "No Harassment", desc: "Zero tolerance for bullying or hate speech." },
                            { icon: EyeOff, label: "No Leaks", desc: "Content redistribution is strictly prohibited." },
                            { icon: Users, label: "Respect Creators", desc: "Treat everyone with professional courtesy." },
                            { icon: Smartphone, label: "No Screenshots", desc: "In-app protection prevents unauthorized captures." }
                        ].map((rule, idx) => (
                            <div key={idx} className="flex items-start gap-6 p-6 bg-[#181920] rounded-[1.5rem] border-2 border-transparent hover:border-white/10 transition-all">
                                <rule.icon size={28} className="shrink-0 mt-1" />
                                <div>
                                    <div className="text-xl font-bold mb-1">{rule.label}</div>
                                    <p className="text-sm text-[#999999] leading-[1.6] m-0">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => nextStep(5)}
                        className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                    >
                        I Agree to the Rules
                    </button>
                </div>
            </Layout>
        );
    }

    if (step === 9) {
        return (
            <Layout title="Interests">
                <div className="space-y-8">
                    <div className="text-center">
                        <p className="text-xl text-[#999999]">Select your interests.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {["Fitness", "Fashion", "Lifestyle", "Glamour", "Cooking", "Gaming", "Travel", "Art"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setInterests(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                                className={`h-16 rounded-[1.2rem] border-2 font-bold text-lg transition-all ${interests.includes(tag)
                                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                                    : "border-[#1F2937] bg-transparent text-[#9CA3AF] hover:border-[#2563EB]/50 hover:bg-[#1c1d24]"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={interests.length === 0}
                        onClick={() => nextStep(10)}
                        className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)] disabled:bg-[#333333] disabled:text-[#666666] disabled:cursor-not-allowed"
                    >
                        Apply Preferences
                    </button>
                </div>
            </Layout>
        );
    }

    if (step === 16) {
        return (
            <Layout title="Starter Balance">
                <div className="space-y-8">
                    <div className="text-center">
                        <p className="text-xl text-[#999999]">Top up your wallet.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {[5, 10, 25].map(amt => (
                            <button
                                key={amt}
                                onClick={() => setSelectedAmount(amt)}
                                className={`flex flex-col items-center justify-center gap-2 h-32 rounded-[1.5rem] border-2 transition-all p-4 ${selectedAmount === amt
                                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                                    : "border-[#1F2937] bg-[#111217] text-[#9CA3AF] hover:border-[#2563EB]/30"
                                    }`}
                            >
                                <span className="text-3xl font-black">${amt}</span>
                                {amt === 10 && (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${selectedAmount === amt ? 'bg-white text-[#2563EB]' : 'bg-[#2563EB] text-white'}`}>
                                        POPULAR
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => nextStep(17)}
                        className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                    >
                        Proceed to Secure Deposit
                    </button>
                </div>
            </Layout>
        );
    }

    if (step === 20) {
        return (
            <Layout title="You're All Set" hideBack>
                <div className="space-y-10 text-center">
                    <div className="w-24 h-24 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black">Welcome to Velo.</h2>
                        <div className="max-w-[400px] mx-auto flex items-center justify-between p-6 bg-[#181920] rounded-[1.5rem] border border-white/10 shadow-inner">
                            <span className="opacity-40 text-xs font-black tracking-widest uppercase">WALLET</span>
                            <span className="text-4xl font-black text-white">${selectedAmount}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/feed")}
                        className="w-full h-20 rounded-full bg-[#2563EB] text-white font-black text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_-10px_rgba(37,99,235,0.4)]"
                    >
                        Discover Content
                    </button>
                </div>
            </Layout>
        );
    }

    // Generic Default 
    return (
        <Layout title={`Onboarding Phase`}>
            <div className="text-center space-y-8">
                <p className="text-lg text-[#999999] leading-[1.6] max-w-[800px] mx-auto">
                    This automated setup ensures your profile is perfectly calibrated for the best Velo experience.
                </p>
                <button
                    onClick={() => nextStep(step + 1)}
                    className="w-full h-16 rounded-full bg-[#2563EB] text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.3)]"
                >
                    Continue to Next Phase
                </button>
            </div>
        </Layout>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}>
            <OnboardingContent />
        </Suspense>
    );
}
