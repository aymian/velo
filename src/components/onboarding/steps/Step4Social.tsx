"use client";

import { useOnboardingStore } from '@/store/onboarding-store';
import { OnboardingLayout } from '../OnboardingLayout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Share2, Loader2, Search, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, query, limit, getDocs, doc, setDoc, deleteDoc, where } from 'firebase/firestore';
import { COLLECTIONS, User } from '@/lib/firebase/collections';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Step4Social() {
    const { nextStep } = useOnboardingStore();
    const { user: currentUser } = useAuthStore();

    const [users, setUsers] = useState<User[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Fetch some users to suggest
                const q = query(collection(db, COLLECTIONS.USERS), limit(10));
                const querySnapshot = await getDocs(q);
                const fetchedUsers: User[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as User;
                    if (data.uid !== currentUser?.uid) {
                        fetchedUsers.push(data);
                    }
                });
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) fetchUsers();
    }, [currentUser]);

    const handleFollow = async (userId: string) => {
        if (!currentUser) return;

        const isFollowing = following.includes(userId);
        const followId = `${currentUser.uid}_${userId}`;
        const followRef = doc(db, COLLECTIONS.FOLLOWS, followId);

        try {
            if (isFollowing) {
                await deleteDoc(followRef);
                setFollowing(prev => prev.filter(id => id !== userId));
            } else {
                await setDoc(followRef, {
                    followerId: currentUser.uid,
                    followingId: userId,
                    createdAt: new Date()
                });
                setFollowing(prev => [...prev, userId]);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleInvite = () => {
        setIsInviting(true);
        // Simulate inviting
        setTimeout(() => {
            setIsInviting(false);
            alert("Invite link copied to clipboard!");
        }, 1000);
    };

    const handleContinue = () => {
        nextStep();
    };

    return (
        <OnboardingLayout
            currentStep={4}
            totalSteps={6}
            title="Grow your circle"
            description="Follow interesting people and invite your friends to join the community."
        >
            <div className="space-y-6">
                {/* Invite Box */}
                <div className="bg-[#16161D] border border-[#27272A] rounded-xl p-5 flex items-center justify-between group hover:border-[#FF2D55]/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF2D55]/10 flex items-center justify-center">
                            <Share2 className="w-6 h-6 text-[#FF2D55]" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Invite Friends</h3>
                            <p className="text-xs text-[#71717A]">Earn rewards for every friend who joins</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleInvite}
                        disabled={isInviting}
                        className="text-[#FF2D55] hover:text-[#FF4D6D] hover:bg-transparent p-0"
                    >
                        {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Invite"}
                    </Button>
                </div>

                {/* Suggested Users */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-wider">Suggested for you</h3>
                        <span className="text-xs text-[#71717A]">{users.length} found</span>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
                            </div>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <div key={user.uid} className="flex items-center justify-between p-3 rounded-lg bg-[#16161D]/50 border border-[#27272A] hover:bg-[#16161D] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-[#27272A]">
                                            <AvatarImage src={user.photoURL || undefined} />
                                            <AvatarFallback className="bg-[#27272A] text-white">
                                                {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-white capitalize">{user.displayName || user.username}</p>
                                            <p className="text-[10px] text-[#71717A]">@{user.username || 'user'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleFollow(user.uid)}
                                        className={cn(
                                            "h-8 px-4 text-xs font-bold rounded-full transition-all",
                                            following.includes(user.uid)
                                                ? "bg-[#27272A] text-white hover:bg-[#3F3F46]"
                                                : "bg-[#FF2D55] text-white hover:bg-[#FF4D6D]"
                                        )}
                                    >
                                        {following.includes(user.uid) ? (
                                            <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5" /> Following</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Follow</span>
                                        )}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[#71717A] text-sm">No users found to follow</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button
                        onClick={handleContinue}
                        variant="ghost"
                        className="flex-1 text-[#71717A] hover:text-white font-bold h-12"
                    >
                        Skip
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="flex-[2] bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-12 rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20"
                    >
                        Continue <ArrowRight className="ml-2 w-4 h-4" />
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
