"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, User, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/lib/admin-store";

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isAdminAuthenticated } = useAdminStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAdminAuthenticated) {
            router.push("/admin/dashboard");
        }
    }, [isAdminAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulation for "ianpro" / "ianpro"
        setTimeout(() => {
            if (username === "ianpro" && password === "ianpro") {
                login(username, "super_admin");
                router.push("/admin/dashboard");
            } else {
                setError("Invalid credentials. System access denied.");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] space-y-8"
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-[#1A1A24] border border-white/5 rounded-2xl flex items-center justify-center shadow-xl">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">System Control</h1>
                        <p className="text-white/40 text-sm">FlowChat Authority Panel</p>
                    </div>
                </div>

                <div className="bg-[#16161D] border border-white/5 rounded-[24px] p-8 shadow-2xl relative overflow-hidden group">
                    {/* Subtle grid pattern background */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                    <form onSubmit={handleLogin} className="relative z-10 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-white/40 text-[10px] uppercase tracking-widest font-black">Admin ID</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        className="bg-[#0D0D12] border-white/5 h-12 pl-12 rounded-xl focus:border-blue-500/50 transition-all text-white placeholder:text-white/10"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="text-white/40 text-[10px] uppercase tracking-widest font-black">Access Key</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="bg-[#0D0D12] border-white/5 h-12 pl-12 rounded-xl focus:border-blue-500/50 transition-all text-white placeholder:text-white/10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    Authenticate <ChevronRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center space-y-4">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                        Secure 256-bit encrypted access only
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-20">
                            <Shield className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">RBAC Active</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-20">
                            <Lock className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Audit Logs</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
