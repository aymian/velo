"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Camera, MapPin, AtSign, Loader2, Shield, Star, Crown, Zap } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getUserByUsername, updateUser, getDocuments, followUser } from "@/lib/firebase/helpers";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { orderBy, limit } from "firebase/firestore";
import { auth } from "@/lib/firebase/config";

type Role = "member" | "creator" | null;

export default function OnboardingPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>("member");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [kycDocument, setKycDocument] = useState<string | null>(null);
    const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [followedUsers, setFollowedUsers] = useState<string[]>([]);

    const totalSteps = 12;

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const interests = [
        // Survival & Basic Needs
        { id: "food", title: "Food & cooking", category: "survival" },
        { id: "water", title: "Water", category: "survival" },
        { id: "shelter", title: "Shelter & housing", category: "survival" },
        { id: "health", title: "Health & medicine", category: "survival" },
        { id: "safety", title: "Safety & protection", category: "survival" },
        { id: "clothing", title: "Clothing", category: "survival" },
        { id: "reproduction", title: "Reproduction", category: "survival" },
        { id: "parenting", title: "Parenting", category: "survival" },
        // Social & Relationships
        { id: "friendship", title: "Friendship", category: "social" },
        { id: "romance", title: "Love & romance", category: "social" },
        { id: "marriage", title: "Marriage", category: "social" },
        { id: "family", title: "Family", category: "social" },
        { id: "community", title: "Community", category: "social" },
        { id: "belonging", title: "Belonging", category: "social" },
        { id: "reputation", title: "Reputation", category: "social" },
        { id: "status", title: "Status", category: "social" },
        // Power & Influence
        { id: "leadership", title: "Leadership", category: "power" },
        { id: "politics", title: "Politics", category: "power" },
        { id: "control", title: "Control", category: "power" },
        { id: "strategy", title: "Strategy", category: "power" },
        { id: "war", title: "War", category: "power" },
        { id: "diplomacy", title: "Diplomacy", category: "power" },
        { id: "governance", title: "Governance", category: "power" },
        // Knowledge & Curiosity
        { id: "science", title: "Science", category: "knowledge" },
        { id: "mathematics", title: "Mathematics", category: "knowledge" },
        { id: "philosophy", title: "Philosophy", category: "knowledge" },
        { id: "astronomy", title: "Astronomy", category: "knowledge" },
        { id: "nature", title: "Nature", category: "knowledge" },
        { id: "tech", title: "Technology", category: "knowledge" },
        { id: "education", title: "Education", category: "knowledge" },
        { id: "invention", title: "Invention", category: "knowledge" },
        // Wealth & Resources
        { id: "trade", title: "Trade", category: "wealth" },
        { id: "business", title: "Business", category: "wealth" },
        { id: "money", title: "Money", category: "wealth" },
        { id: "investment", title: "Investment", category: "wealth" },
        { id: "economics", title: "Economics", category: "wealth" },
        { id: "property", title: "Property", category: "wealth" },
        { id: "entrepreneurship", title: "Entrepreneurship", category: "wealth" },
        // Creativity & Expression
        { id: "art", title: "Art", category: "creativity" },
        { id: "music", title: "Music", category: "creativity" },
        { id: "dance", title: "Dance", category: "creativity" },
        { id: "writing", title: "Writing", category: "creativity" },
        { id: "storytelling", title: "Storytelling", category: "creativity" },
        { id: "fashion", title: "Fashion", category: "creativity" },
        { id: "design", title: "Design", category: "creativity" },
        { id: "architecture", title: "Architecture", category: "creativity" },
        // Entertainment & Fun
        { id: "games", title: "Games", category: "entertainment" },
        { id: "sports", title: "Sports", category: "entertainment" },
        { id: "movies", title: "Movies", category: "entertainment" },
        { id: "humor", title: "Humor", category: "entertainment" },
        { id: "adventure", title: "Adventure", category: "entertainment" },
        { id: "competition", title: "Competition", category: "entertainment" },
        { id: "gambling", title: "Gambling", category: "entertainment" },
        // Spirituality & Meaning
        { id: "religion", title: "Religion", category: "spirituality" },
        { id: "mythology", title: "Mythology", category: "spirituality" },
        { id: "rituals", title: "Rituals", category: "spirituality" },
        { id: "meditation", title: "Meditation", category: "spirituality" },
        { id: "afterlife", title: "Afterlife", category: "spirituality" },
        { id: "purpose", title: "Purpose of life", category: "spirituality" },
        // Identity & Self-Development
        { id: "self_improvement", title: "Self-improvement", category: "identity" },
        { id: "fitness", title: "Fitness", category: "identity" },
        { id: "beauty", title: "Beauty", category: "identity" },
        { id: "intelligence", title: "Intelligence", category: "identity" },
        { id: "personal_growth", title: "Personal growth", category: "identity" },
        { id: "discipline", title: "Discipline", category: "identity" },
        { id: "achievement", title: "Achievement", category: "identity" },
        // Exploration & Discovery
        { id: "travel", title: "Travel", category: "exploration" },
        { id: "ocean", title: "Ocean exploration", category: "exploration" },
        { id: "space", title: "Space exploration", category: "exploration" },
        { id: "geography", title: "Geography", category: "exploration" },
        { id: "new_lands", title: "Discovery of new lands", category: "exploration" },
    ];

    const filteredInterests = interests.filter(item =>
        (selectedCategory === "all" || item.category === selectedCategory) &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const checkUsername = async (val: string) => {
        if (val.length < 3) {
            setIsUsernameValid(null);
            return;
        }
        setIsCheckingUsername(true);
        try {
            const user = await getUserByUsername(val);
            setIsUsernameValid(!user);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'kyc' = 'profile') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            if (type === 'profile') setPhotoURL(url);
            else setKycDocument(url);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const fetchTopUsers = async () => {
        try {
            const users = await getDocuments(COLLECTIONS.USERS, [
                orderBy('followers', 'desc'),
                limit(3)
            ]);
            setTopUsers(users);
        } catch (error) {
            console.error("Error fetching top users:", error);
        }
    };

    const handleFollow = async (userId: string) => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await followUser(user.uid, userId);
            setFollowedUsers(prev => [...prev, userId]);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const next = () => {
        if (step === 8) fetchTopUsers();
        setStep((s) => Math.min(s + 1, totalSteps));
    };
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const saveUserData = async () => {
        const user = auth.currentUser;
        if (!user) return;
        setIsSaving(true);
        try {
            await updateUser(user.uid, {
                displayName,
                username,
                bio,
                location,
                photoURL,
                interests: selectedInterests,
                role,
                dob,
                age: parseInt(age),
                phoneNumber: phone,
                kycStatus: kycDocument ? 'pending' : 'not_started',
                kycDocument,
                onboardingCompleted: true,
                coins: 500,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error saving user data:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const finish = async () => {
        await saveUserData();
        router.push("/feed");
    };

    return (
        <div className="min-h-screen bg-[#0f0f13] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-3xl">

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-xs text-white/40 mb-2">
                        <span>Step {step} of {totalSteps}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* STEP 1 — Welcome */}
                    {step === 1 && (
                        <MotionWrapper key="step1">
                            <h1 className="text-4xl font-bold mb-4">
                                Welcome to Velo 🔥
                            </h1>
                            <p className="text-white/60 mb-8">
                                A premium space where creators shine and members connect.
                            </p>
                            <PrimaryButton onClick={next}>
                                Get Started <ArrowRight size={18} />
                            </PrimaryButton>
                        </MotionWrapper>
                    )}

                    {/* STEP 2 — Role & Interest Selection */}
                    {step === 2 && (
                        <MotionWrapper key="step2">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-4">
                                    What are you into?
                                </h2>
                                <p className="text-white/60 mb-8">
                                    Select at least 3 categories to personalize your experience.
                                </p>

                                <div className="flex flex-col gap-6 text-left">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search interests..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        />
                                    </div>

                                    {/* Categories */}
                                    <div className="flex justify-start overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
                                        <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="w-fit">
                                            <TabsList className="bg-transparent border-none gap-4 flex flex-nowrap h-12">
                                                {["all", "survival", "social", "power", "knowledge", "wealth", "creativity", "entertainment", "spirituality", "identity", "exploration"].map((cat) => (
                                                    <TabsTrigger
                                                        key={cat}
                                                        value={cat}
                                                        className="bg-transparent border-none data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 rounded-full px-5 py-2 transition-all capitalize whitespace-nowrap"
                                                    >
                                                        {cat}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    {/* Interest Selector (Chips) */}
                                    <div className="flex flex-wrap justify-center gap-3 max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                                        {filteredInterests.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleInterest(item.id)}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                                    selectedInterests.includes(item.id)
                                                        ? "bg-gradient-to-r from-purple-600 to-pink-500 border-none text-white shadow-lg shadow-purple-500/20"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10"
                                                )}
                                            >
                                                {item.title}
                                                {selectedInterests.includes(item.id) && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Selected Summary (Chips for removal) */}
                                    {selectedInterests.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedInterests.map(id => {
                                                    const item = interests.find(i => i.id === id);
                                                    return (
                                                        <div
                                                            key={id}
                                                            className="bg-white/10 rounded-full px-3 py-1 text-xs text-white flex items-center gap-2"
                                                        >
                                                            {item?.title}
                                                            <X
                                                                size={12}
                                                                className="cursor-pointer hover:text-red-400"
                                                                onClick={() => toggleInterest(id)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col items-center gap-6">
                                <PrimaryButton onClick={next} disabled={selectedInterests.length < 3}>
                                    Continue ({selectedInterests.length}/3)
                                </PrimaryButton>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 3 — Profile & Role */}
                    {step === 3 && (
                        <MotionWrapper key="step3">
                            <h2 className="text-3xl font-bold mb-8 text-center">
                                Complete Your Profile
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-10">
                                <RoleCard
                                    title="Member"
                                    icon="🧑"
                                    features={["Browse creators", "Like & follow", "Chat", "Discover"]}
                                    active={role === "member"}
                                    onClick={() => setRole("member")}
                                />
                                <RoleCard
                                    title="Creator"
                                    icon="👑"
                                    features={["Upload content", "Earn money", "Get verified", "Build audience"]}
                                    active={role === "creator"}
                                    onClick={() => setRole("creator")}
                                />
                            </div>

                            <div className="mt-12 flex justify-between max-w-xl mx-auto w-full">
                                <SecondaryButton onClick={back}>Back</SecondaryButton>
                                <div className="w-[200px]">
                                    <PrimaryButton onClick={next} disabled={!role}>
                                        Continue
                                    </PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 4 — Detailed Profile Setup */}
                    {step === 4 && (
                        <MotionWrapper key="step4">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">
                                {role === "creator" ? "Setup Your Creator Profile" : "Tell Us About Yourself"}
                            </h2>
                            <p className="text-white/40 text-center mb-8">This is how the community will see you.</p>

                            <div className="max-w-xl mx-auto space-y-8">
                                {/* Profile Photo Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center">
                                            {photoURL ? (
                                                <img src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="text-white/20" size={32} />
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full">
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Change</span>
                                        </label>
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                                <Loader2 className="animate-spin text-purple-500" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-white/40">Profile Photo</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-bold">Identity</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/60 ml-1">Display Name</label>
                                            <Input
                                                placeholder="e.g. John Doe"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/60 ml-1">Username</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                                <input
                                                    className={cn(
                                                        "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all",
                                                        isUsernameValid === true ? "border-green-500/50 focus:ring-green-500/20" :
                                                            isUsernameValid === false ? "border-red-500/50 focus:ring-red-500/20" :
                                                                "border-white/10 focus:ring-purple-500/20"
                                                    )}
                                                    placeholder="username"
                                                    value={username}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                                        setUsername(val);
                                                        checkUsername(val);
                                                    }}
                                                />
                                                {isCheckingUsername && (
                                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-white/20" size={14} />
                                                )}
                                                {isUsernameValid === true && (
                                                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={14} />
                                                )}
                                                {isUsernameValid === false && (
                                                    <X className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={14} />
                                                )}
                                            </div>
                                            {isUsernameValid === false && <p className="text-[10px] text-red-400 ml-1">Username taken</p>}
                                        </div>
                                    </div>

                                    <div className="text-xs text-white/40 uppercase tracking-widest pt-4 mb-2 font-bold">Details</div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/60 ml-1">Bio</label>
                                            <textarea
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                                                placeholder="Write a short bio about yourself..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/60 ml-1">Location <span className="text-white/20">(Optional)</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g. Tokyo, Japan"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between gap-4">
                                    <SecondaryButton onClick={back} className="w-1/3">Back</SecondaryButton>
                                    <PrimaryButton
                                        onClick={next}
                                        disabled={!displayName || !isUsernameValid || !bio || isUploading}
                                        className="flex-1"
                                    >
                                        Continue
                                    </PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 5 — Plans Preview */}
                    {step === 5 && (
                        <MotionWrapper key="step5">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">Choose Your Level</h2>
                            <p className="text-white/40 text-center mb-10">Premium features designed for your growth.</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                <MiniPlanCard
                                    name="Basic"
                                    price="$9"
                                    features={["Unlimited browsing", "No ads", "HD viewing"]}
                                />
                                <MiniPlanCard
                                    name="Pro"
                                    price="$29"
                                    popular
                                    features={["Exclusive content", "Advanced filters", "Verified eligibility"]}
                                />
                                <MiniPlanCard
                                    name="Elite"
                                    price="$79"
                                    features={["Max algorithm boost", "VIP badge", "Dedicated support"]}
                                />
                            </div>

                            <div className="flex justify-between items-center max-w-xl mx-auto">
                                <SecondaryButton onClick={back}>Back</SecondaryButton>
                                <PrimaryButton onClick={next} className="w-[200px]">I Understand</PrimaryButton>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 6 — Agreement */}
                    {step === 6 && (
                        <MotionWrapper key="step6">
                            <h2 className="text-3xl font-bold mb-6 text-center">Community Guidelines</h2>
                            <div className="max-w-xl mx-auto">
                                <p className="text-white/60 mb-8 text-center text-sm">
                                    Velo is built on trust and respect.
                                </p>
                                <div className="bg-white/5 rounded-2xl p-6 space-y-4 mb-8 border border-white/10">
                                    {["Respect all community members", "Post original content", "Secure monetization", "Professional conduct"].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Check size={16} className="text-purple-500" />
                                            <span className="text-sm text-white/80">{text}</span>
                                        </div>
                                    ))}
                                </div>
                                <div onClick={() => setAgreed(!agreed)} className="flex items-center justify-center gap-3 cursor-pointer group">
                                    <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", agreed ? "bg-purple-600 border-none" : "border-white/20")}>
                                        {agreed && <Check size={16} />}
                                    </div>
                                    <span className="text-sm">I agree to the guidelines</span>
                                </div>
                                <div className="mt-12 flex justify-between gap-4">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                    <PrimaryButton onClick={next} disabled={!agreed}>Continue</PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 7 — Personal Information */}
                    {step === 7 && (
                        <MotionWrapper key="step7">
                            <h2 className="text-3xl font-bold mb-2 text-center">Keep it Secure</h2>
                            <p className="text-white/40 text-center mb-10">Verification details required for security.</p>

                            <div className="max-w-md mx-auto space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-white/40 ml-1">Date of Birth</label>
                                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-1">
                                        <label className="text-xs text-white/40 ml-1">Age</label>
                                        <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs text-white/40 ml-1">Phone Number</label>
                                        <Input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-between gap-4">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                    <PrimaryButton onClick={next} disabled={!dob || !age || !phone}>Continue</PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 8 — KYC */}
                    {step === 8 && (
                        <MotionWrapper key="step8">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">Identity Verification</h2>
                            <p className="text-white/40 text-center mb-10">Upload your ID for a verified badge and full access.</p>

                            <div className="max-w-md mx-auto">
                                <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center group hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden">
                                    {kycDocument ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <Check className="text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium">Document Uploaded</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Shield className="w-12 h-12 text-white/20 mb-4 group-hover:text-purple-500 transition-colors" />
                                            <p className="text-sm font-medium mb-1">Upload ID Document</p>
                                            <p className="text-xs text-white/40">Passport, Driving License or National ID</p>
                                        </>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'kyc')} accept="image/*,.pdf" />

                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-purple-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-12 flex justify-between gap-4">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                    <PrimaryButton onClick={next} disabled={!kycDocument && role === 'creator'}>
                                        {kycDocument ? "Continue" : role === 'creator' ? "Identity Required" : "Skip for now"}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 9 — Suggested Follows */}
                    {step === 9 && (
                        <MotionWrapper key="step9">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">Suggested for You</h2>
                            <p className="text-white/40 text-center mb-10">Follow the top creators to get your feed started.</p>

                            <div className="max-w-xl mx-auto space-y-4">
                                {topUsers.map((u) => (
                                    <div key={u.uid} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                        <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} className="w-12 h-12 rounded-full object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate">{u.displayName}</p>
                                            <p className="text-xs text-white/40">@{u.username} • {u.followers || 0} followers</p>
                                        </div>
                                        <button
                                            onClick={() => handleFollow(u.uid)}
                                            disabled={followedUsers.includes(u.uid)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                                                followedUsers.includes(u.uid)
                                                    ? "bg-white/10 text-white/40"
                                                    : "bg-white text-black hover:bg-white/90"
                                            )}
                                        >
                                            {followedUsers.includes(u.uid) ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                ))}

                                <div className="pt-12 flex justify-between gap-4">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                    <PrimaryButton onClick={next} className="w-[200px]">Next</PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 10 — Notifications */}
                    {step === 10 && (
                        <MotionWrapper key="step10">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">Don&apos;t Miss a Blast</h2>
                            <p className="text-white/40 text-center mb-10">Enable notifications to stay updated with your favorite creators.</p>

                            <div className="max-w-md mx-auto">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
                                        <Star className="w-10 h-10 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Stay in the Loop</h3>
                                    <p className="text-sm text-white/60 mb-8 px-4">Receive real-time updates when your favorite creators go live, post new content, or message you.</p>
                                    <PrimaryButton onClick={next}>Enable Notifications</PrimaryButton>
                                    <button onClick={next} className="mt-4 text-sm text-white/40 hover:text-white transition-colors">Maybe later</button>
                                </div>
                                <div className="mt-12 flex justify-start">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 11 — Invite */}
                    {step === 11 && (
                        <MotionWrapper key="step11">
                            <h2 className="text-3xl font-bold mb-2 text-center text-white">Velo is Better Together</h2>
                            <p className="text-white/40 text-center mb-10">Invite your friends to join the premium community.</p>

                            <div className="max-w-md mx-auto">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText("Join me on Velo! https://velo.app/signup");
                                            alert("Link copied!");
                                        }}
                                        className="w-full flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                                    >
                                        <span className="text-sm text-white/60">Invite link copied...</span>
                                        <span className="text-xs font-bold text-purple-500">Copy Link</span>
                                    </button>
                                    <div className="flex justify-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">𝕏</div>
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">💬</div>
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">📧</div>
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-between items-center gap-4">
                                    <SecondaryButton onClick={back}>Back</SecondaryButton>
                                    <PrimaryButton onClick={next}>Continue</PrimaryButton>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* STEP 12 — Final Success */}
                    {step === 12 && (
                        <MotionWrapper key="step12">
                            <div className="max-w-xl mx-auto text-center py-10">
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
                                    <Check size={48} strokeWidth={3} className="text-white" />
                                </div>

                                <h2 className="text-4xl font-black mb-2">You&apos;re All Set! 🔥</h2>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold mb-8 animate-bounce">
                                    <Star size={16} fill="currentColor" />
                                    <span>You claimed 500 coins!</span>
                                </div>

                                <div className="mb-10 space-y-4">
                                    {role === 'creator' ? (
                                        <>
                                            <p className="text-xl font-bold text-white/90">Your profile is live. Start uploading content.</p>
                                            <p className="text-white/40">The community is waiting for your transmissions.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xl font-bold text-white/90">Start discovering amazing creators.</p>
                                            <p className="text-white/40">Your personalized feed is ready for you.</p>
                                        </>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-3xl p-8 mb-12 relative overflow-hidden group">
                                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all" />
                                    <Star className="absolute top-4 right-4 text-pink-500 w-5 h-5 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-2">Limited Time Offer</p>
                                    <h3 className="text-2xl font-black text-white mb-2">20% Discount for Onboarding!</h3>
                                    <p className="text-sm text-white/60 mb-6">Upgrade to <span className="text-white font-bold">Pro</span> now and get 20% off your first year.</p>
                                    <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform active:scale-95">Claim Offer</button>
                                </div>

                                <div className="space-y-4">
                                    <PrimaryButton onClick={finish} disabled={isSaving}>
                                        {isSaving ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="animate-spin w-4 h-4" /> Finalizing...
                                            </span>
                                        ) : (
                                            "Explore Velo"
                                        )}
                                    </PrimaryButton>
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium">Your data has been securely saved to the transmission core</p>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

/* COMPONENTS */

function MotionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

function InterestCard({
    title,
    image,
    selected,
    onClick,
}: {
    title: string;
    image: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group cursor-pointer flex flex-col items-center",
                "transition-all duration-300"
            )}
        >
            <div className={cn(
                "relative aspect-[9/12] w-full rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500",
                selected ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "border-white/10"
            )}>
                <img src={image} alt={title} className={cn(
                    "w-full h-full object-cover transition-transform duration-700",
                    "group-hover:scale-110",
                    selected && "scale-105"
                )} />
                {selected && (
                    <div className="absolute inset-0 bg-purple-600/20 backdrop-blur-[2px] flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Check size={20} strokeWidth={3} />
                        </motion.div>
                    </div>
                )}
            </div>
            <span className={cn(
                "mt-4 text-sm font-semibold tracking-wide transition-all duration-300",
                selected ? "text-white" : "text-white/40 group-hover:text-white/80"
            )}>
                {title}
            </span>
        </div>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
    );
}

function PrimaryButton({
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-40"
        >
            {children}
        </button>
    );
}

function MiniPlanCard({ name, price, features, popular }: { name: string, price: string, features: string[], popular?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center backdrop-blur-md",
            popular ? "border-purple-500 bg-purple-500/10 scale-105 shadow-lg shadow-purple-500/20" : "border-white/10 bg-white/5 hover:border-white/20"
        )}>
            {popular && <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-2">Most Popular</span>}
            <h3 className="text-lg font-bold mb-1">{name}</h3>
            <div className="text-2xl font-black mb-4">{price}<span className="text-xs font-normal text-white/40">/mo</span></div>
            <ul className="space-y-2 mb-6 w-full">
                {features.map((f, i) => (
                    <li key={i} className="text-[11px] text-white/60 flex items-center justify-center gap-2">
                        <Check size={10} className="text-purple-500" /> {f}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SecondaryButton({
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className="px-4 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40"
        >
            {children}
        </button>
    );
}

function RoleCard({
    title,
    features,
    active,
    onClick,
    icon,
}: {
    title: string;
    features: string[];
    active: boolean;
    onClick: () => void;
    icon: string;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative p-[2px] rounded-3xl cursor-pointer transition-all duration-500",
                active
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                    : "bg-white/10 hover:bg-white/20"
            )}
        >
            <div className="h-full w-full bg-[#0f0f13] rounded-[1.4rem] p-6 flex flex-col items-start gap-4">
                <div className="flex items-center gap-3 w-full">
                    <span className="text-2xl">{icon}</span>
                    <h3 className={cn(
                        "font-bold text-lg uppercase tracking-wider",
                        active ? "text-white" : "text-white/60"
                    )}>{title}</h3>
                    {active && (
                        <div className="ml-auto bg-white text-purple-600 rounded-full p-1 shadow-lg">
                            <Check size={12} strokeWidth={4} />
                        </div>
                    )}
                </div>

                <ul className="space-y-3 w-full mt-2">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-colors",
                                active ? "bg-pink-500 animate-pulse" : "bg-white/20"
                            )} />
                            <span className={active ? "text-white/90" : "text-white/40"}>{f}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function PlanCard({
    name,
    price,
    active,
    popular,
    onClick,
}: {
    name: string;
    price: string;
    active: boolean;
    popular?: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-6 rounded-xl border cursor-pointer transition-all relative",
                active
                    ? "border-purple-500 bg-gradient-to-br from-purple-600/20 to-pink-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/30"
            )}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
                    Most Popular
                </div>
            )}
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-2xl font-bold mt-2">{price}/mo</p>
        </div>
    );
}