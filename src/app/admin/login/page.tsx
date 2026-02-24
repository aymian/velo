"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Zap, ArrowRight, Loader2 } from "lucide-react";
import { VeloLogo } from "@/components/VeloLogo";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulation of login process
        setTimeout(() => {
            if (username === "ianpro" && password === "ianpro") {
                // Hardcoded success for admin entry
                localStorage.setItem("velo_admin_access", "true");
                router.push("/admin/dashboard");
            } else {
                setError("Invalid administrative credentials.");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-[#FF2D55]/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF2D55]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                        <VeloLogo showText={false} className="h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter mb-2">CONTROL PANEL</h1>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Authorized Personnel Only</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 shadow-3xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Command Identity</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#FF2D55] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-white focus:outline-none focus:border-[#FF2D55]/30 transition-all placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Access Protocol</label>
                            <div className="relative group">
                                <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#FF2D55] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-white focus:outline-none focus:border-[#FF2D55]/30 transition-all placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <ShieldAlert className="w-4 h-4 text-[#FF2D55]" />
                                <span className="text-xs font-bold text-[#FF2D55] uppercase tracking-wider">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-black" />
                            ) : (
                                <>
                                    Establish Link <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Security Note */}
                <div className="mt-10 flex flex-col items-center gap-4 text-center">
                    <div className="w-px h-10 bg-gradient-to-b from-white/10 to-transparent" />
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
                        <Zap className="w-3 h-3" />
                        Platform Security Layer Beta-8
                    </div>
                </div>
            </div>
        </div>
    );
}
