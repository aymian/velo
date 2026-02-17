"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/lib/store';

export default function DebugPage() {
    const router = useRouter();
    const { step, reset, onboardingCompleted } = useOnboardingStore();
    const { user, clearUser } = useAuthStore();

    const clearAllStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        alert('All storage cleared! Refresh the page.');
        window.location.reload();
    };

    const resetOnboarding = () => {
        reset();
        alert('Onboarding reset to step 1!');
    };

    const logout = () => {
        clearUser();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#0F0F14] text-white p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-[#FF2D55]">Debug Tools</h1>

                <div className="bg-[#16161D] border border-[#27272A] rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold">Current State</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-[#A1A1AA]">User:</span> {user ? user.email : 'Not logged in'}</p>
                        <p><span className="text-[#A1A1AA]">User ID:</span> {user?.uid || 'N/A'}</p>
                        <p><span className="text-[#A1A1AA]">Onboarding Step:</span> {step}</p>
                        <p><span className="text-[#A1A1AA]">Onboarding Completed:</span> {onboardingCompleted ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <div className="bg-[#16161D] border border-[#27272A] rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold">Actions</h2>
                    
                    <Button 
                        onClick={clearAllStorage}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                        Clear All Storage (localStorage + sessionStorage)
                    </Button>

                    <Button 
                        onClick={resetOnboarding}
                        className="w-full bg-[#FF2D55] hover:bg-[#FF4D6D] text-white"
                    >
                        Reset Onboarding to Step 1
                    </Button>

                    <Button 
                        onClick={logout}
                        className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-white"
                    >
                        Logout
                    </Button>

                    <Button 
                        onClick={() => router.push('/onboarding')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                        Go to Onboarding
                    </Button>

                    <Button 
                        onClick={() => router.push('/signup')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Go to Signup
                    </Button>
                </div>

                <div className="bg-[#16161D] border border-[#27272A] rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-[#A1A1AA]">
                        <li>If you're stuck on step 6, click "Clear All Storage"</li>
                        <li>Then go to Signup and create a new account</li>
                        <li>Or click "Reset Onboarding to Step 1" to restart</li>
                        <li>The onboarding page now checks Firestore for completion status</li>
                        <li>If onboarding is completed in Firestore, it redirects to /discover</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
