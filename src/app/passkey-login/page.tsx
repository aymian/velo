"use client";

import React, { useState, useEffect } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VeloLogo } from "@/components/VeloLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Fingerprint, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PasskeyLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check if WebAuthn is supported
        if (!window.PublicKeyCredential) {
            setIsSupported(false);
            setError("Passkeys are not supported on this device/browser");
        }
    }, []);

    const handlePasskeyLogin = async () => {
        if (!isSupported) return;

        setIsLoading(true);
        setError("");

        try {
            // Get authentication options from server
            const optionsResponse = await fetch('/api/auth/passkey?type=authenticate');
            const options = await optionsResponse.json();

            if (!optionsResponse.ok) {
                throw new Error(options.error || 'Failed to get authentication options');
            }

            // Convert challenge from base64url to ArrayBuffer
            const publicKeyCredentialRequestOptions = {
                ...options,
                challenge: Uint8Array.from(atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
            };

            // Request credential from authenticator
            const credential = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            if (!credential) {
                throw new Error('No credential returned');
            }

            // Send credential to server for verification
            const verifyResponse = await fetch('/api/auth/passkey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: {
                        id: credential.id,
                        rawId: btoa(String.fromCharCode(...new Uint8Array((credential as any).rawId))),
                        response: {
                            authenticatorData: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.authenticatorData))),
                            clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.clientDataJSON))),
                            signature: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.signature))),
                        },
                        type: credential.type,
                    },
                    challenge: options.challenge,
                }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Authentication failed');
            }

            setSuccess(true);

            // Redirect after short delay
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (err: any) {
            console.error('Passkey error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Authentication was cancelled');
            } else {
                setError(err.message || 'Failed to authenticate with passkey');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasskeyRegister = async () => {
        if (!isSupported) return;

        setIsLoading(true);
        setError("");

        try {
            // Get registration options from server
            const optionsResponse = await fetch('/api/auth/passkey?type=register');
            const options = await optionsResponse.json();

            if (!optionsResponse.ok) {
                throw new Error(options.error || 'Failed to get registration options');
            }

            // Convert challenge and user.id from base64url to ArrayBuffer
            const publicKeyCredentialCreationOptions = {
                ...options,
                challenge: Uint8Array.from(atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
                user: {
                    ...options.user,
                    id: Uint8Array.from(atob(options.user.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
                },
            };

            // Create credential
            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            if (!credential) {
                throw new Error('No credential created');
            }

            // Send credential to server for storage
            const registerResponse = await fetch('/api/auth/passkey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: {
                        id: credential.id,
                        rawId: btoa(String.fromCharCode(...new Uint8Array((credential as any).rawId))),
                        response: {
                            attestationObject: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.attestationObject))),
                            clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.clientDataJSON))),
                        },
                        type: credential.type,
                    },
                    challenge: options.challenge,
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(registerData.error || 'Registration failed');
            }

            setSuccess(true);

            // Redirect after short delay
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (err: any) {
            console.error('Passkey registration error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Registration was cancelled');
            } else {
                setError(err.message || 'Failed to register passkey');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Video */}
            <BackgroundVideo blur={true} className="fixed inset-0 w-full h-full object-cover -z-20 opacity-80 contrast-125 saturate-150" />

            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/40 -z-10 pointer-events-none" />

            {/* Top Bar with Home Link */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <VeloLogo showText={true} className="scale-75 origin-top-left hover:opacity-80 transition-opacity drop-shadow-lg" />
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-[440px] mx-auto px-4 z-20 relative">

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <Fingerprint className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-xl">
                        {success ? "Success!" : "Passkey Login"}
                    </h1>
                    <p className="text-white/60 text-lg font-light tracking-wide drop-shadow-md">
                        {success
                            ? "Authentication successful"
                            : isSupported
                                ? "Use your fingerprint, face, or device PIN"
                                : "Your device doesn't support passkeys"}
                    </p>
                </motion.div>

                {/* Success State */}
                {success && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-20 h-20 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <p className="text-white/80 text-sm">Redirecting...</p>
                    </motion.div>
                )}

                {/* Action Buttons */}
                {!success && isSupported && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Login Button */}
                        <button
                            onClick={handlePasskeyLogin}
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-16 rounded-full flex items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Fingerprint className="w-6 h-6" />
                                    <span className="text-lg">Login with Passkey</span>
                                </>
                            )}
                        </button>

                        {/* Register Button */}
                        <button
                            onClick={handlePasskeyRegister}
                            disabled={isLoading}
                            className="w-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white font-medium h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-base">Register New Passkey</span>
                        </button>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-rose-400 text-sm font-medium drop-shadow-md px-4 py-3 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-xl"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4"
                        >
                            <p className="text-white/60 text-xs font-medium mb-2">What are passkeys?</p>
                            <p className="text-white/40 text-xs leading-relaxed">
                                Passkeys are a secure, passwordless way to sign in using your device's biometrics (fingerprint, face) or PIN. They're more secure than passwords and can't be phished.
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Not Supported State */}
                {!success && !isSupported && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 text-center"
                    >
                        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <p className="text-white/80 text-sm mb-4">
                            Your browser or device doesn't support passkeys. Please try a different authentication method.
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-white/60 hover:text-white text-sm font-medium transition-colors underline"
                        >
                            Back to login options
                        </button>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <Link href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium tracking-wider uppercase drop-shadow-md">
                        Protected by Velo Auth
                    </Link>
                </motion.div>
            </div>

            {/* Footer Links */}
            <div className="absolute bottom-6 w-full text-center z-20">
                <div className="flex items-center justify-center gap-6 text-[10px] md:text-xs text-white/20 font-medium uppercase tracking-widest">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Help</Link>
                </div>
            </div>
        </div>
    );
}
