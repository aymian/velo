"use client";

import { useOnboardingStore } from '@/store/onboarding-store';
import { OnboardingLayout } from '../OnboardingLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Phone, User, Calendar, Camera, Loader2, Check, X, FileText, ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import axios from 'axios';

export default function Step3Profile() {
    const { nextStep, setProfileData, phoneNumber, username, birthDate, gender, bio, profilePic } = useOnboardingStore();

    const [localUsername, setLocalUsername] = useState(username);
    const [localPhone, setLocalPhone] = useState(phoneNumber);
    const [localBirthDate, setLocalBirthDate] = useState(birthDate || '');
    const [localGender, setLocalGender] = useState(gender);
    const [localBio, setLocalBio] = useState(bio);
    const [localProfilePic, setLocalProfilePic] = useState(profilePic);

    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const checkUsername = async (val: string) => {
        if (val.length < 3) return;
        setIsCheckingUsername(true);
        setUsernameError('');
        try {
            const q = query(collection(db, COLLECTIONS.USERS), where('username', '==', val.toLowerCase()), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setUsernameError('Username already taken');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const checkPhone = async (val: string) => {
        if (val.length < 8) return;
        setIsCheckingPhone(true);
        setPhoneError('');
        try {
            const q = query(collection(db, COLLECTIONS.USERS), where('phoneNumber', '==', val), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setPhoneError('Phone number already registered');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckingPhone(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Starting upload for file:", file.name);
        setIsUploading(true);
        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            console.log("Using Cloudinary Cloud Name:", cloudName);

            if (!cloudName || cloudName === 'your_cloud_name_here') {
                throw new Error("Cloudinary Cloud Name is not configured. Please check your .env file.");
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );

            console.log("Cloudinary Upload Success:", response.data);

            if (response.data?.secure_url) {
                setLocalProfilePic(response.data.secure_url);
            }
        } catch (error: any) {
            console.error("Cloudinary Upload Detailed Error:", error.response?.data || error.message);
            alert("Upload failed: " + (error.response?.data?.error?.message || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleContinue = () => {
        if (!localUsername || usernameError || !localPhone || phoneError || !localBirthDate) return;

        setProfileData({
            username: localUsername.toLowerCase(),
            phoneNumber: localPhone,
            birthDate: localBirthDate,
            gender: localGender,
            bio: localBio,
            profilePic: localProfilePic
        });
        nextStep();
    };

    const canContinue = localUsername.length >= 3 && !usernameError && !isCheckingUsername &&
        localPhone.length >= 8 && !phoneError && !isCheckingPhone &&
        localBirthDate && !isUploading;

    return (
        <OnboardingLayout
            currentStep={3}
            totalSteps={6}
            title="Complete your profile"
            description="Tell us a bit more about yourself to get started."
        >
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Profile Pic Upload */}
                <div className="flex flex-col items-center gap-4 py-2">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-24 h-24 rounded-full bg-[#16161D] border-2 border-dashed border-[#27272A] flex items-center justify-center cursor-pointer hover:border-[#FF2D55] transition-all overflow-hidden group"
                    >
                        {localProfilePic ? (
                            <img src={localProfilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-8 h-8 text-[#71717A] group-hover:text-[#FF2D55]" />
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <p className="text-xs text-[#71717A]">Upload profile picture</p>
                </div>

                <div className="grid gap-4">
                    {/* Username */}
                    <div className="space-y-2">
                        <Label className="text-white">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                            <Input
                                value={localUsername}
                                onChange={(e) => {
                                    setLocalUsername(e.target.value);
                                    if (e.target.value.length >= 3) checkUsername(e.target.value);
                                }}
                                placeholder="username"
                                className={cn(
                                    "bg-[#0F0F14] border-[#27272A] pl-10 h-11",
                                    usernameError && "border-red-500",
                                    !usernameError && localUsername.length >= 3 && !isCheckingUsername && "border-green-500"
                                )}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isCheckingUsername && <Loader2 className="w-4 h-4 text-[#FF2D55] animate-spin" />}
                                {!isCheckingUsername && !usernameError && localUsername.length >= 3 && <Check className="w-4 h-4 text-green-500" />}
                                {!isCheckingUsername && usernameError && <X className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                        {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label className="text-white">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                            <Input
                                value={localPhone}
                                onChange={(e) => {
                                    setLocalPhone(e.target.value);
                                    if (e.target.value.length >= 8) checkPhone(e.target.value);
                                }}
                                placeholder="+1 234 567 890"
                                className={cn(
                                    "bg-[#0F0F14] border-[#27272A] pl-10 h-11",
                                    phoneError && "border-red-500",
                                    !phoneError && localPhone.length >= 8 && !isCheckingPhone && "border-green-500"
                                )}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isCheckingPhone && <Loader2 className="w-4 h-4 text-[#FF2D55] animate-spin" />}
                                {!isCheckingPhone && !phoneError && localPhone.length >= 8 && <Check className="w-4 h-4 text-green-500" />}
                                {!isCheckingPhone && phoneError && <X className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                        {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <Label className="text-white">Birth Date</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                            <Input
                                type="date"
                                value={localBirthDate}
                                onChange={(e) => setLocalBirthDate(e.target.value)}
                                className="bg-[#0F0F14] border-[#27272A] pl-10 h-11 text-white [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label className="text-white">Gender</Label>
                        <div className="relative">
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                            <select
                                value={localGender}
                                onChange={(e) => setLocalGender(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-[#27272A] rounded-md h-11 px-4 text-white appearance-none focus:outline-none focus:border-[#FF2D55]"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label className="text-white">Bio</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-[#71717A]" />
                            <textarea
                                value={localBio}
                                onChange={(e) => setLocalBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full bg-[#0F0F14] border border-[#27272A] rounded-md min-h-[80px] p-3 pl-10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#FF2D55] resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 pb-8">
                    <Button
                        onClick={handleContinue}
                        disabled={!canContinue}
                        className={cn(
                            "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-12 rounded-lg transition-all",
                            !canContinue && "opacity-50 grayscale cursor-not-allowed bg-[#27272A] text-[#71717A]"
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272A;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3F3F46;
                }
            `}</style>
        </OnboardingLayout>
    );
}
