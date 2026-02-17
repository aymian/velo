"use client";

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle, User, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function EmailSignupForm() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        if (!username || username.length < 3) {
            setStatus('error');
            setMessage('Username must be at least 3 characters');
            return;
        }

        if (!password || password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            // Import Firebase modules
            const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const { auth, db } = await import('@/lib/firebase/config');

            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, {
                displayName: username,
            });

            // Save user data to Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: email,
                username: username,
                displayName: username,
                photoURL: null,
                emailVerified: false, // Can be verified later if needed
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
            });

            // Update auth store
            setUser({
                uid: user.uid,
                email: email,
                displayName: username,
                photoURL: null,
            });

            setStatus('success');
            setMessage('Account created successfully! Redirecting...');

            // Redirect to onboarding after a short delay
            setTimeout(() => {
                router.push('/onboarding');
            }, 1000);

        } catch (err: any) {
            console.error('Signup error:', err);
            setStatus('error');

            // Handle Firebase auth errors
            if (err.code === 'auth/email-already-in-use') {
                setMessage('This email is already registered. Please login instead.');
            } else if (err.code === 'auth/weak-password') {
                setMessage('Password is too weak. Please use a stronger password.');
            } else if (err.code === 'auth/invalid-email') {
                setMessage('Invalid email address.');
            } else {
                setMessage(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] bg-[#16161D] border border-[#27272A] rounded-lg p-8 space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-[#FF2D55]" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                <p className="text-[#A1A1AA]">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717A]" />
                        <Input
                            id="username"
                            type="text"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading || status === 'success'}
                            className="bg-[#0F0F14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FF2D55] h-12 pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717A]" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading || status === 'success'}
                            className="bg-[#0F0F14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FF2D55] h-12 pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717A]" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading || status === 'success'}
                            className="bg-[#0F0F14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FF2D55] h-12 pl-10"
                        />
                    </div>
                    <p className="text-xs text-[#71717A]">Must be at least 6 characters</p>
                </div>

                {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-green-400 text-sm font-medium">{message}</p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || status === 'success'}
                    className={cn(
                        "w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white font-bold h-14 text-lg rounded-lg transition-all shadow-lg shadow-[#FF2D55]/20",
                        (isLoading || status === 'success') && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Account...
                        </span>
                    ) : status === 'success' ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Success!
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-xs text-[#71717A]">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
