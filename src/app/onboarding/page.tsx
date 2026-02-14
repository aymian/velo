"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    Play,
    Mic2,
    Users,
    TrendingUp,
    Music,
    Gamepad2,
    Camera,
    Heart,
    Coins,
    CheckCircle2,
    Bell,
    Star,
    Check,
    ChevronRight,
    UserPlus,
    Smartphone
} from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

type OnboardingPath = "viewer" | "creator" | null;

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [path, setPath] = useState<OnboardingPath>(null);
    const [interests, setInterests] = useState<string[]>([]);
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(1, prev - 1));

    // Progress percentage
    const progress = (step / 15) * 100;

    // Handlers
    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else if (interests.length < 5) {
            setInterests([...interests, interest]);
        }
    };

    const steps = [
        // 1: Welcome Screen
        <WelcomeStep key="step1" onNext={nextStep} />,
        // 2: Continue Method (Transition to Onboarding if not logged in)
        <ContinueMethodStep key="step2" onNext={nextStep} />,
        // 3: Personalization
        <PathStep key="step3" onNext={(p) => { setPath(p); nextStep(); }} />,
        // 4: Interests
        <InterestsStep key="step4" interests={interests} onToggle={toggleInterest} onNext={nextStep} />,
        // 5: AI Preview
        <PreviewStep key="step5" onNext={nextStep} />,
        // 6: Engagement Trigger
        <EngagementStep key="step6" onNext={nextStep} />,
        // 7: Username
        <UsernameStep key="step7" defaultValue={user?.displayName || "velo_user"} onNext={(u) => { setUsername(u); nextStep(); }} />,
        // 8: Profile Photo
        <PhotoStep key="step8" onNext={nextStep} />,
        // 9: Follow Suggestions
        <FollowStep key="step9" onNext={nextStep} />,
        // 10: Notifications
        <NotificationsStep key="step10" onNext={nextStep} />,
        // 11: Creator Activation
        <CreatorStep key="step11" path={path} onNext={nextStep} />,
        // 12: Reward
        <RewardStep key="step12" onNext={nextStep} />,
        // 13: Wallet Setup
        <WalletStep key="step13" onNext={nextStep} />,
        // 14: Action Milestone
        <MilestoneStep key="step14" onNext={nextStep} />,
        // 15: Completion
        <CompletionStep key="step15" onFinish={() => router.push("/")} />
    ];

    return (
        <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white">
            <BackgroundVideo blur={true} className="opacity-40" />

            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
                <VeloLogo showText={false} className="w-10 h-10" />

                {step > 1 && step < 15 && (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Step {step} of 15</span>
                            <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#ff4081] to-[#ff80ab]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="text-[10px] text-white/30 hover:text-white uppercase font-bold tracking-widest transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-xl"
                    >
                        {steps[step - 1]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Step Navigation Dots (Hidden on small steps) */}
            {step > 1 && step < 15 && (
                <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? "bg-[#ff4081] scale-125 shadow-[0_0_10px_#ff4081]" : "bg-white/10"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ------------------- SUB-COMPONENTS (STEPS) -------------------

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-[#ff4081] to-[#ff80ab] rounded-3xl rotate-12 flex items-center justify-center shadow-2xl relative"
            >
                <div className="absolute inset-0 blur-2xl bg-[#ff4081]/30 -z-10 animate-pulse" />
                <Play className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    Discover. <br />
                    Go Live. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4081] to-purple-600">Earn.</span>
                </h1>
                <p className="text-white/40 text-xl font-light">Experience the next generation of vibes.</p>
            </div>

            <button
                onClick={onNext}
                className="group relative px-12 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                    Let&apos;s Get Started <ArrowRight className="w-5 h-5" />
                </span>
            </button>
        </div>
    );
}

function ContinueMethodStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Pick your path</h2>
                <p className="text-white/40">Choose how you want to join the vibe</p>
            </div>

            <div className="grid gap-4">
                <button onClick={onNext} className="w-full h-16 bg-white rounded-2xl flex items-center px-6 gap-4 text-black font-bold hover:bg-gray-100 transition-all active:scale-[0.98]">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                    Continue with Google
                </button>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onNext} className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-white/10 transition-all">
                        <SmartphoneIcon className="w-5 h-5" /> Phone
                    </button>
                    <button onClick={onNext} className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-white/10 transition-all">
                        <AppleIcon className="w-5 h-5" /> Apple
                    </button>
                </div>
                <button onClick={onNext} className="text-white/40 hover:text-white transition-colors py-4 font-medium tracking-wide">
                    Explore as Guest
                </button>
            </div>
        </div>
    );
}

function PathStep({ onNext }: { onNext: (p: OnboardingPath) => void }) {
    const options = [
        { id: 'watch', name: 'Watch & Relax', icon: Play, path: 'viewer' as const },
        { id: 'live', name: 'Go Live & Earn', icon: Mic2, path: 'creator' as const },
        { id: 'friends', name: 'Make Friends', icon: Users, path: 'viewer' as const },
        { id: 'trends', name: 'Explore Trends', icon: TrendingUp, path: 'viewer' as const },
    ];

    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">What brings you here today?</h2>
                <p className="text-white/40">We&apos;ll tailor your experience</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onNext(opt.path)}
                        className="group relative aspect-square bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#ff4081]/10 hover:border-[#ff4081]/50"
                    >
                        <opt.icon className="w-10 h-10 text-white/60 group-hover:text-[#ff4081] transition-colors" />
                        <span className="font-bold text-sm">{opt.name}</span>
                        <div className="absolute inset-0 bg-[#ff4081]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    </button>
                ))}
            </div>
        </div>
    );
}

function InterestsStep({ interests, onToggle, onNext }: { interests: string[], onToggle: (i: string) => void, onNext: () => void }) {
    const items = ["Music", "Gaming", "Comedy", "Business", "Sports", "Lifestyle", "Relationships", "Fashion"];

    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Your Interests</h2>
                <p className="text-white/40">Select 3–5 things you love</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {items.map((item) => (
                    <button
                        key={item}
                        onClick={() => onToggle(item)}
                        className={`px-6 py-3 rounded-full border transition-all ${interests.includes(item)
                                ? "bg-[#ff4081] border-[#ff4081] text-white shadow-[0_0_15px_#ff408144]"
                                : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="pt-4">
                <button
                    disabled={interests.length < 3}
                    onClick={onNext}
                    className="w-full bg-white text-black py-5 rounded-full font-bold disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Continue ({interests.length}/3)
                </button>
            </div>
        </div>
    );
}

function PreviewStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8 h-full">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Peek into the vibe</h2>
                <p className="text-white/40">Here&apos;s what people are doing right now</p>
            </div>

            <div className="grid grid-cols-2 gap-3 h-[400px]">
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 text-left">
                        <div className="w-8 h-4 bg-[#ff4081] rounded text-[8px] flex items-center justify-center font-bold mb-1">LIVE</div>
                        <p className="text-[10px] font-bold">Morning Vibes ☕</p>
                    </div>
                </div>
                <div className="grid gap-3">
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl relative overflow-hidden h-[120px]">
                        <Music className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
                    </div>
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl relative overflow-hidden flex-1">
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 text-left">
                            <p className="text-[10px] font-bold">@ian_official</p>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold">
                See More
            </button>
        </div>
    );
}

function EngagementStep({ onNext }: { onNext: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onNext, 2500);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-pink-500/50">
                <Heart className="w-10 h-10 text-[#ff4081] fill-[#ff4081]" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Love what you see?</h2>
                <p className="text-white/40">Create an account to save your favorites ❤️</p>
            </div>
            <div className="h-1 w-32 bg-white/10 mx-auto rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[#ff4081]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5 }}
                />
            </div>
        </div>
    );
}

function UsernameStep({ defaultValue, onNext }: { defaultValue: string, onNext: (u: string) => void }) {
    const [val, setVal] = useState(defaultValue);
    const suggestions = [`${val}_live`, `${val}official`, `credaa_${val}`];

    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">What&apos;s your vibe?</h2>
                <p className="text-white/40">Claim your unique username</p>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-[#ff4081]/50 transition-all" />
                <div className="relative flex items-center px-6">
                    <span className="text-white/30 text-2xl font-bold">@</span>
                    <input
                        className="w-full bg-transparent border-none outline-none py-6 text-2xl font-bold placeholder-white/10"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                    <button key={s} onClick={() => setVal(s)} className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/30 transition-all font-bold">
                        {s}
                    </button>
                ))}
            </div>

            <button onClick={() => onNext(val)} className="w-full bg-white text-black py-5 rounded-full font-bold">
                Continue
            </button>
        </div>
    );
}

function PhotoStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Show yourself</h2>
                <p className="text-white/40">Add a profile photo so people know it&apos;s you</p>
            </div>

            <div className="w-40 h-40 bg-zinc-900 rounded-full mx-auto flex items-center justify-center border-4 border-white/5 relative group cursor-pointer transition-all hover:border-[#ff4081]/30">
                <Camera className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" />
                <div className="absolute bottom-1 right-1 w-10 h-10 bg-[#ff4081] rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform">
                    <UserPlus className="w-4 h-4 text-white" />
                </div>
            </div>

            <div className="grid gap-3">
                <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold">Upload Photo</button>
                <button onClick={onNext} className="text-white/40 hover:text-white transition-colors py-2 font-medium tracking-wide">Skip for now</button>
            </div>
        </div>
    );
}

function FollowStep({ onNext }: { onNext: () => void }) {
    const creators = [
        { id: 1, name: "Ianofficially", handle: "@ianofficial", category: "Music" },
        { id: 2, name: "Mora Vibe", handle: "@moravibe", category: "Lifestyle" },
        { id: 3, name: "DJ Neon", handle: "@djneon", category: "Gaming" },
        { id: 4, name: "Velo Star", handle: "@velostar", category: "Comedy" },
        { id: 5, name: "Earn Pro", handle: "@earnpro", category: "Business" },
        { id: 6, name: "Live Queen", handle: "@livequeen", category: "Sports" },
    ];

    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Who to follow?</h2>
                <p className="text-white/40">Follow at least 1 to improve your feed</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {creators.map(c => (
                    <div key={c.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl mb-2" />
                        <span className="text-xs font-bold block truncate w-full">{c.name}</span>
                        <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black group-hover:bg-white group-hover:text-black transition-all">FOLLOW</button>
                    </div>
                ))}
            </div>

            <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold">
                Continue
            </button>
        </div>
    );
}

function NotificationsStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <div className="space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20">
                    <Bell className="w-10 h-10 text-blue-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Never miss a vibe</h2>
                    <p className="text-white/40">Get notified when your favorites go live 🔴</p>
                </div>
            </div>

            <div className="space-y-3">
                <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold shadow-xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Allow Notifications
                </button>
                <button onClick={onNext} className="w-full text-white/30 hover:text-white transition-colors py-2 text-sm font-bold tracking-widest uppercase">
                    Not now
                </button>
            </div>
        </div>
    );
}

function CreatorStep({ path, onNext }: { path: OnboardingPath, onNext: () => void }) {
    if (path !== 'creator') {
        useEffect(() => { onNext(); }, []);
        return null;
    }

    return (
        <div className="text-center space-y-10">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Start your first live</h2>
                <p className="text-white/40">Become a creator and get featured</p>
            </div>

            <div className="space-y-6 text-left max-w-sm mx-auto">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20 flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-[#ff4081]" />
                    </div>
                    <div>
                        <h4 className="font-bold">Visibility Boost</h4>
                        <p className="text-xs text-white/40">New creators get featured on the main feed for 24 hours.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20 flex-shrink-0">
                        <Coins className="w-5 h-5 text-[#ff4081]" />
                    </div>
                    <div>
                        <h4 className="font-bold">Earn from Gifts</h4>
                        <p className="text-xs text-white/40">Receive digital gifts from viewers that convert to real money.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20 flex-shrink-0">
                        <Users className="w-5 h-5 text-[#ff4081]" />
                    </div>
                    <div>
                        <h4 className="font-bold">Build Your Community</h4>
                        <p className="text-xs text-white/40">Engage directly with your fans in real-time chat.</p>
                    </div>
                </div>
            </div>

            <button onClick={onNext} className="w-full bg-gradient-to-r from-[#ff4081] to-[#ff80ab] text-white py-5 rounded-full font-bold shadow-2xl shadow-pink-500/20">
                Activate Creator Mode
            </button>
        </div>
    );
}

function RewardStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-24 h-24 bg-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]"
            >
                <Star className="w-12 h-12 text-black fill-black" />
            </motion.div>
            <div className="space-y-3">
                <span className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] block">Reward Unlocked</span>
                <h2 className="text-4xl font-black">24-Hr Visibility Boost! 🎁</h2>
                <p className="text-white/40 max-w-xs mx-auto">You&apos;ll be pushed to the top of the feed for the next 24 hours to jumpstart your vibe.</p>
            </div>
            <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold">Claim My Boost</button>
        </div>
    );
}

function WalletStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Your Wallet</h2>
                <p className="text-white/40">Send gifts. Earn rewards.</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 blur-xl group-hover:opacity-20 transition-opacity">
                    <Coins className="w-32 h-32 text-[#ff4081]" />
                </div>
                <div className="relative space-y-2">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Available Balance</span>
                    <div className="flex items-center justify-center gap-3">
                        <Coins className="w-8 h-8 text-[#ff4081]" />
                        <span className="text-5xl font-black tabular-nums tracking-tighter">0.00</span>
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-white/20 font-medium px-8 italic">&ldquo;Gifting increases your visibility in chat and helps creators grow.&rdquo;</p>

            <button onClick={onNext} className="w-full bg-white/5 border border-white/10 hover:border-white/20 py-5 rounded-full font-bold transition-all">Explore the Store</button>
        </div>
    );
}

function MilestoneStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-10">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Almost there...</h2>
                <p className="text-white/40">Complete these to unlock your full feed</p>
            </div>

            <div className="space-y-4 text-left max-w-sm mx-auto">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-6 h-6 rounded-full border border-[#ff4081] flex items-center justify-center text-[10px] text-[#ff4081] font-bold">1</div>
                    <span className="flex-1 text-sm font-bold">Like 3 posts</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">0/3</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <CheckCircle2 className="w-6 h-6 text-[#ff4081]" />
                    <span className="flex-1 text-sm font-bold line-through text-white/30">Follow 2 creators</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest text-[#ff4081]">Done</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white/30 font-bold">3</div>
                    <span className="flex-1 text-sm font-bold">Watch for 5 minutes</span>
                    <div className="w-16 h-1 bg-white/10 rounded-full" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-[#ff4081] uppercase tracking-widest px-2">
                    <span>Progress psychology</span>
                    <span>60% COMPLETE 🎯</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#ff4081] to-[#ff80ab] rounded-full shadow-[0_0_10px_#ff408155]"
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                    />
                </div>
            </div>

            <button onClick={onNext} className="w-full bg-white text-black py-5 rounded-full font-bold">
                Finish Setup
            </button>
        </div>
    );
}

function CompletionStep({ onFinish }: { onFinish: () => void }) {
    return (
        <div className="text-center space-y-10">
            <div className="relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.3)] relative z-10"
                >
                    <Check className="w-16 h-16 text-white stroke-[4px]" />
                </motion.div>
                {/* Confetti simulation with motion.divs */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-sm ${i % 2 === 0 ? 'bg-pink-500' : 'bg-purple-500'}`}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{
                            x: (Math.random() - 0.5) * 400,
                            y: (Math.random() - 0.5) * 400,
                            opacity: 0,
                            rotate: 360
                        }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                    />
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter">Your Velo Experience <br /> Is Ready 🚀</h2>
                <p className="text-white/40 text-lg">Welcome to the inner circle.</p>
            </div>

            <button
                onClick={onFinish}
                className="group relative w-full py-6 bg-gradient-to-r from-[#ff4081] to-purple-600 rounded-full text-white font-black text-xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse" />
                <span className="flex items-center justify-center gap-3">
                    Enter Feed <ChevronRight className="w-6 h-6" />
                </span>
            </button>
        </div>
    );
}

// ICON HELPERS
function AppleIcon({ className }: { className?: string }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.7.9 3.4 1.9-3.06 1.83-2.47 5.76.62 7.07-.63 1.61-1.54 3.2-2.61 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" />
        </svg>
    );
}

function SmartphoneIcon({ className }: { className?: string }) {
    return <Smartphone className={className} />;
}
