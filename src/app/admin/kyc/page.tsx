"use client";

import React, { useState, useEffect } from "react";
import {
    ShieldCheck,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    User,
    History,
    AlertCircle,
    ChevronRight,
    Search,
    Loader2
} from "lucide-react";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminKYCPage() {
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKYC = async () => {
            setIsLoading(true);
            try {
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    where("verificationStatus", "==", "pending"),
                    limit(20)
                );
                const querySnapshot = await getDocs(q);
                const requests = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPendingRequests(requests);
            } catch (error) {
                console.error("KYC fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKYC();
    }, []);
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">IDENTITY COMPLIANCE</h1>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">{pendingRequests.length} Requests Pending Approval</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
                        <History className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Avg. 14m response time</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List of Pending Requests */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-[#16161D] border border-white/5 rounded-[32px] overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Verification Queue</h2>
                            <div className="relative group w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                <Input
                                    placeholder="Filter by name..."
                                    className="h-9 bg-[#0D0D12] border-white/5 pl-9 rounded-lg text-[11px]"
                                />
                            </div>
                        </div>

                        <div className="divide-y divide-white/[0.03]">
                            {isLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/20">Accessing Encryption Vault...</p>
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="py-20 text-center space-y-2">
                                    <ShieldCheck size={32} className="mx-auto text-white/10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Queue is Empty</p>
                                </div>
                            ) : (
                                pendingRequests.map((req) => (
                                    <div key={req.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative shadow-xl overflow-hidden">
                                                {req.photoURL ? (
                                                    <img src={req.photoURL} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-white/40" />
                                                )}
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#16161D] animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white">@{req.username || req.displayName || "anonymous"}</span>
                                                    <Badge className="bg-white/5 text-white/40 border-none text-[8px] font-black tracking-widest px-1.5">{req.country || "Global"}</Badge>
                                                </div>
                                                <p className="text-[11px] font-medium text-white/30">{req.firstName} {req.lastName} • {req.docType || "ID Document"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">Submitted</p>
                                                <p className="text-[11px] font-black text-white/60 mt-1">Recently</p>
                                            </div>
                                            <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-white hover:bg-blue-600 hover:border-blue-600 rounded-xl px-4 gap-2 transition-all">
                                                <Eye className="w-4 h-4" /> Inspect
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-8 border border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <ShieldCheck size={40} className="text-white/40" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest">End of Queue</p>
                            <p className="text-[11px]">All system-wide identity requests have been surfaced.</p>
                        </div>
                    </div>
                </div>

                {/* Secure Inspection Details (Placeholder/Empty until selection) */}
                <div className="space-y-6">
                    <div className="bg-[#16161D] border border-white/5 rounded-[32px] p-8 space-y-8 sticky top-24">
                        <div className="space-y-4 text-center">
                            <div className="w-20 h-20 mx-auto bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                <ShieldCheck className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-bold text-white">Select a Request</h2>
                                <p className="text-xs text-white/30 leading-relaxed px-4">
                                    Click on a verification request from the list to securely inspect their documents and biometric data.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: "256-bit Document Decryption", ok: true },
                                { label: "Biometric Face Match (AI)", ok: true },
                                { label: "Global Sanctions Check", ok: true },
                                { label: "Manual Override Permission", ok: true }
                            ].map((check, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#0D0D12] border border-white/5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-emerald-500/20">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{check.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-orange-500">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p className="text-[10px] font-bold leading-normal uppercase tracking-wider">
                                    Document review must follow FlowChat Compliance Policy V2.4
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
