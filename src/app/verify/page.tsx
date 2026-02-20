"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    CheckCircle2,
    ChevronRight,
    Upload,
    Camera,
    User,
    FileText,
    MonitorCheck,
    Loader2,
    AlertCircle,
    X,
    ArrowLeft,
    Clock,
    Lock,
    Globe,
    CreditCard,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

// --- Components for Each Step ---

const StepProgress = ({ currentStep }: { currentStep: number }) => {
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    if (currentStep === 0) return null;

    return (
        <div className="w-full max-w-xl mx-auto mb-8 space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-1 bg-white/5" />
        </div>
    );
};

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-xl bg-[#0F0F14] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
    >
        {/* Abstract background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Shield className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Verify Your Identity
                </h1>
                <p className="text-white/60 text-lg">
                    Required to unlock monetization, live streaming, and premium features on Velo.
                </p>
            </div>

            <div className="space-y-4">
                {[
                    { icon: Lock, text: "Secure & end-to-end encrypted" },
                    { icon: Clock, text: "Takes under 3 minutes to complete" },
                    { icon: FileText, text: "Government-issued ID required" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80">
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                            <item.icon size={14} className="text-pink-500" />
                        </div>
                        <span className="text-sm font-medium">{item.text}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button
                    onClick={onStart}
                    className="h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-xl shadow-pink-500/20 rounded-xl transition-all active:scale-95"
                >
                    Start Verification
                </Button>
                <Button
                    variant="ghost"
                    className="h-14 text-white/40 hover:text-white hover:bg-white/5 rounded-xl font-medium"
                >
                    Maybe Later
                </Button>
            </div>

            <p className="text-[11px] text-center text-white/20 pt-4 px-8">
                By continuing, you agree to Velo's Identity Verification Terms. Your data is protected by 256-bit encryption.
            </p>
        </div>
    </motion.div>
);

const IdentityStep = ({ onNext }: { onNext: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        country: ""
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Legal Identity</h2>
                <p className="text-white/50 text-sm">Please ensure this matches your government ID exactly.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="first-name" className="text-white/60 text-xs uppercase tracking-wider">Legal First Name</Label>
                    <Input
                        id="first-name"
                        placeholder="John"
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-pink-500/50 transition-colors"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="last-name" className="text-white/60 text-xs uppercase tracking-wider">Legal Last Name</Label>
                    <Input
                        id="last-name"
                        placeholder="Doe"
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-pink-500/50 transition-colors"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="dob" className="text-white/60 text-xs uppercase tracking-wider">Date of Birth</Label>
                <Input
                    id="dob"
                    type="date"
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-pink-500/50 transition-colors text-white"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Country of Issue</Label>
                <Select onValueChange={(val) => setFormData({ ...formData, country: val })}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-pink-500/50 text-white">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#16161D] border-white/10 text-white">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="ge">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                onClick={() => onNext(formData)}
                disabled={!formData.firstName || !formData.lastName || !formData.dob || !formData.country}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-xl shadow-pink-500/20 rounded-xl font-bold transition-all disabled:opacity-30"
            >
                Continue
            </Button>
        </motion.div>
    );
};

const DocumentStep = ({ onNext }: { onNext: (type: string) => void }) => {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const docTypes = [
        { id: "passport", title: "Passport", icon: Globe, desc: "Fastest verification" },
        { id: "national_id", title: "National ID", icon: CreditCard, desc: "Standard verification" },
        { id: "driver_license", title: "Driver's License", icon: User, desc: "For selected regions" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Identity Document</h2>
                <p className="text-white/50 text-sm">Select the document you'd like to use for verification.</p>
            </div>

            <div className="space-y-3">
                {docTypes.map((doc) => (
                    <button
                        key={doc.id}
                        onClick={() => setSelectedType(doc.id)}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                            selectedType === doc.id
                                ? "bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/5"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                selectedType === doc.id ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 group-hover:text-white"
                            )}>
                                <doc.icon size={22} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">{doc.title}</h3>
                                <p className="text-white/40 text-xs">{doc.desc}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedType === doc.id ? "border-pink-500" : "border-white/10 group-hover:border-white/30"
                        )}>
                            {selectedType === doc.id && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-dashed border-white/10 space-y-4 text-center group cursor-pointer hover:border-pink-500/40 transition-all">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                    <Upload className="w-5 h-5 text-white/40 group-hover:text-pink-500 transition-colors" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Upload document photo</p>
                    <p className="text-xs text-white/40">JPG, PNG or PDF (Max 10MB)</p>
                </div>
            </div>

            <div className="flex gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 h-14 border-white/10 hover:bg-white/5 text-white rounded-xl font-bold">
                            <Camera className="mr-2 w-4 h-4" /> Use Camera
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0F0F14] border-white/10 text-white max-w-md rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Take Document Photo</DialogTitle>
                            <DialogDescription className="text-white/40">
                                Place your document in the frame and ensure all 4 corners are visible.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="aspect-[4/3] bg-black rounded-2xl border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                            <div className="w-full h-full relative">
                                <div className="absolute inset-8 border-2 border-dashed border-white/20 rounded-lg pointer-events-none" />
                                <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                                    <Camera size={48} className="mb-4" />
                                    <p className="text-sm">Initializing Camera...</p>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => onNext(selectedType || "document")} className="w-full h-12 bg-pink-500 hover:bg-pink-600 font-bold rounded-xl mt-4">
                            Capture Photo
                        </Button>
                    </DialogContent>
                </Dialog>

                <Button
                    onClick={() => onNext(selectedType || "document")}
                    disabled={!selectedType}
                    className="flex-1 h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-xl shadow-pink-500/20 rounded-xl font-bold transition-all disabled:opacity-30"
                >
                    Continue
                </Button>
            </div>
        </motion.div>
    );
};

const SelfieStep = ({ onNext }: { onNext: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-white">Selfie Verification</h2>
                <p className="text-white/50 text-sm">We need to ensure it's really you.</p>
            </div>

            <div className="relative mx-auto w-64 h-64">
                {/* Circular camera preview frame */}
                <div className="absolute inset-0 rounded-full border-4 border-pink-500/30 animate-pulse" />
                <div className="absolute inset-[3px] rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center">
                    <div className="text-center space-y-2 opacity-50">
                        <Camera size={40} className="mx-auto" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Alignment Guide</p>
                    </div>
                </div>

                {/* Corner highlights */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-pink-500 rounded-tl-3xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-pink-500 rounded-tr-3xl" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { text: "Look front", icon: User },
                    { text: "No glasses", icon: X },
                    { text: "Good lighting", icon: Shield }
                ].map((tip, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <tip.icon size={16} className="text-white/40" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{tip.text}</span>
                    </div>
                ))}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-xl shadow-pink-500/20 rounded-xl font-bold transition-all">
                        Take Selfie
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-sm rounded-[40px] p-8">
                    <div className="space-y-8 py-4">
                        <div className="w-64 h-64 mx-auto relative rounded-full border-4 border-pink-500 p-1">
                            <div className="w-full h-full rounded-full bg-[#111] overflow-hidden flex items-center justify-center">
                                <Camera size={64} className="opacity-20" />
                            </div>
                        </div>
                        <div className="space-y-4 text-center">
                            <DialogTitle className="text-2xl">Position your face</DialogTitle>
                            <DialogDescription className="text-white/40">
                                Fit your face within the circle and stay still.
                            </DialogDescription>
                            <Button onClick={onNext} className="w-full h-14 bg-white text-black hover:bg-white/90 font-bold rounded-2xl mt-4">
                                Capture
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

const ReviewStep = ({ onNext }: { onNext: () => void }) => {
    const [confirmed, setConfirmed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Review Details</h2>
                <p className="text-white/50 text-sm">Please verify all information is accurate.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Legal Name</p>
                        <p className="text-sm font-semibold text-white">Johnathan Doe</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Country</p>
                        <p className="text-sm font-semibold text-white">United States</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Date of Birth</p>
                        <p className="text-sm font-semibold text-white">Jan 12, 1992</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">ID Type</p>
                        <p className="text-sm font-semibold text-white">Passport</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group relative">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-100 flex flex-col items-center justify-center gap-2">
                            <Lock size={16} className="text-white/40" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-white/40">Secure Preview</span>
                        </div>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group relative">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-100 flex flex-col items-center justify-center gap-2">
                            <Lock size={16} className="text-white/40" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-white/40">Secure Preview</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                        id="confirm"
                        onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />
                    <label
                        htmlFor="confirm"
                        className="text-xs leading-relaxed text-white/50 select-none cursor-pointer"
                    >
                        I confirm that the information provided is accurate and matches my legal document. I understand that false information may lead to permanent account suspension.
                    </label>
                </div>
            </div>

            <Button
                onClick={onNext}
                disabled={!confirmed}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-xl shadow-pink-500/20 rounded-xl font-bold transition-all disabled:opacity-30"
            >
                Submit for Review
            </Button>
        </motion.div>
    );
};

const SuccessScreen = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl text-center space-y-8"
    >
        <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Identity Verified</h1>
            <p className="text-white/60">
                Congratulations! Your account has been fully verified. You now have access to all premium features.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            {[
                { label: "Monetization", status: "Unlocked" },
                { label: "Live Streaming", status: "Unlocked" },
                { label: "Premium Badge", status: "Awarded" }
            ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-bold text-emerald-400">✓ {item.status}</span>
                </div>
            ))}
        </div>

        <Button
            className="w-full h-14 bg-white text-black hover:bg-white/90 border-none rounded-xl font-bold transition-all"
            onClick={() => window.location.href = '/'}
        >
            Go to Creator Studio
        </Button>
    </motion.div>
);

const PendingScreen = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl text-center space-y-8"
    >
        <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-10 h-10 text-purple-500" />
        </div>

        <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Verification in Review</h1>
            <p className="text-white/60">
                Your documents have been submitted and are being reviewed by our team.
            </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-left flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Info size={18} className="text-blue-400" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-white">What happens next?</p>
                <p className="text-xs text-white/40">Most reviews are completed within 24 hours. We'll notify you via email once the process is complete.</p>
            </div>
        </div>

        <Button
            variant="outline"
            className="w-full h-14 border-white/10 text-white hover:bg-white/5 rounded-xl font-bold transition-all"
            onClick={() => window.location.href = '/'}
        >
            Return Home
        </Button>
    </motion.div>
);

// --- Main Page Component ---

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const step = searchParams.get("step") || "intro";
    const status = searchParams.get("status");

    const setStep = (newStep: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", newStep);
        router.push(`?${params.toString()}`);
    };

    const setStatus = (newStatus: string) => {
        const params = new URLSearchParams();
        params.set("status", newStatus);
        router.push(`?${params.toString()}`);
    };

    const getStepNumber = () => {
        switch (step) {
            case "identity": return 1;
            case "document": return 2;
            case "selfie": return 3;
            case "review": return 4;
            default: return 0;
        }
    };

    // Render logic
    const renderStep = () => {
        if (status === "success") return <SuccessScreen />;
        if (status === "pending") return <PendingScreen />;

        switch (step) {
            case "intro":
                return <IntroScreen onStart={() => setStep("identity")} />;
            case "identity":
                return <IdentityStep onNext={() => setStep("document")} />;
            case "document":
                return <DocumentStep onNext={() => setStep("selfie")} />;
            case "selfie":
                return <SelfieStep onNext={() => setStep("review")} />;
            case "review":
                return <ReviewStep onNext={() => setStatus("pending")} />;
            default:
                return <IntroScreen onStart={() => setStep("identity")} />;
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center font-sans selection:bg-pink-500/30 overflow-x-hidden pt-16">
            <Navbar />

            <main className="flex-grow w-full flex flex-col items-center justify-center p-6 md:p-12 relative">
                <div className="relative z-10 w-full flex flex-col items-center">
                    {!status && <StepProgress currentStep={getStepNumber()} />}

                    <AnimatePresence mode="wait">
                        <div key={status || step} className="w-full flex justify-center">
                            {renderStep()}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Trust Footer */}
            <footer className="w-full h-20 border-t border-white/5 flex items-center justify-center gap-8 px-6 text-white/20">
                <div className="flex items-center gap-2">
                    <Lock size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">256-Bit Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">GDPR Compliant</span>
                </div>
            </footer>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Secure Connection...</span>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
