"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboarding-store';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuthStore();
    const { setEmailVerified } = useOnboardingStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                // Get the current session after email verification
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("Session error:", sessionError);
                    setStatus('error');
                    setMessage(sessionError.message);
                    return;
                }

                if (session?.user) {
                    // User is verified and logged in
                    const user = session.user;

                    // Extract user metadata
                    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
                    const displayName = user.user_metadata?.display_name || username;

                    // Save to Firestore
                    try {
                        const userRef = doc(db, 'users', user.id);
                        await setDoc(userRef, {
                            uid: user.id,
                            email: user.email,
                            username: username,
                            displayName: displayName,
                            photoURL: user.user_metadata?.avatar_url || null,
                            emailVerified: true,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                            onboardingCompleted: false,
                            role: 'user',
                            bio: '',
                            stats: {
                                followers: 0,
                                following: 0,
                                impact: 0
                            },
                            privacySettings: {
                                hideActivity: false,
                                privateMode: false,
                                notifications: true
                            }
                        }, { merge: true });

                        console.log('User data saved to Firestore successfully');
                    } catch (firestoreError) {
                        console.error('Error saving to Firestore:', firestoreError);
                        // Continue anyway - we can retry later
                    }

                    // Update local auth store
                    setUser({
                        uid: user.id,
                        email: user.email || null,
                        displayName: displayName,
                        photoURL: user.user_metadata?.avatar_url || null,
                    });

                    // Mark email as verified and reset onboarding to step 1
                    setEmailVerified(true);

                    // Reset onboarding to start from step 1 for new users
                    const { reset } = useOnboardingStore.getState();
                    reset();

                    setStatus('success');
                    setMessage('Email verified successfully!');

                    // Redirect to onboarding after a short delay
                    setTimeout(() => {
                        router.push('/onboarding');
                    }, 2000);
                } else {
                    // No session found, listen for auth state change
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            const user = session.user;
                            const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
                            const displayName = user.user_metadata?.display_name || username;

                            // Save to Firestore
                            try {
                                const userRef = doc(db, 'users', user.id);
                                await setDoc(userRef, {
                                    uid: user.id,
                                    email: user.email,
                                    username: username,
                                    displayName: displayName,
                                    photoURL: user.user_metadata?.avatar_url || null,
                                    emailVerified: true,
                                    createdAt: serverTimestamp(),
                                    updatedAt: serverTimestamp(),
                                    onboardingCompleted: false,
                                    role: 'user',
                                    bio: '',
                                    stats: {
                                        followers: 0,
                                        following: 0,
                                        impact: 0
                                    },
                                    privacySettings: {
                                        hideActivity: false,
                                        privateMode: false,
                                        notifications: true
                                    }
                                }, { merge: true });
                            } catch (firestoreError) {
                                console.error('Error saving to Firestore:', firestoreError);
                            }

                            setUser({
                                uid: user.id,
                                email: user.email || null,
                                displayName: displayName,
                                photoURL: user.user_metadata?.avatar_url || null,
                            });

                            setEmailVerified(true);

                            // Reset onboarding to start from step 1
                            const { reset } = useOnboardingStore.getState();
                            reset();

                            setStatus('success');
                            setMessage('Email verified successfully! Redirecting...');
                            setTimeout(() => router.push('/onboarding'), 2000);
                        }
                    });

                    // Force a check after timeout if nothing happens
                    setTimeout(() => {
                        if (status === 'loading') {
                            setStatus('error');
                            setMessage('Could not verify email. Link may be expired or invalid.');
                        }
                    }, 5000);

                    return () => subscription.unsubscribe();
                }
            } catch (error: any) {
                console.error("Verification error:", error);
                setStatus('error');
                setMessage(error.message || 'An unexpected error occurred');
            }
        };

        verifyUser();
    }, [router, setUser, setEmailVerified, status]);

    return (
        <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-[#16161D] border border-[#27272A] rounded-lg p-8 text-center space-y-6">

                <div className="flex justify-center">
                    {status === 'loading' && (
                        <div className="w-16 h-16 rounded-full bg-[#FF2D55]/10 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">
                        {status === 'loading' && 'Verifying...'}
                        {status === 'success' && 'Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </h1>
                    <p className="text-[#A1A1AA]">
                        {message}
                    </p>
                </div>

                {status === 'error' && (
                    <Button
                        onClick={() => router.push('/signup')}
                        className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-white"
                    >
                        Return to Sign Up
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0F0F14]" />}>
            <VerifyContent />
        </Suspense>
    );
}
