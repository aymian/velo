"use client";

import React, { useState, useEffect } from "react";
import {
    CircleDollarSign,
    ArrowUpRight,
    TrendingUp,
    Settings2,
    Globe,
    Wallet,
    PieChart,
    Banknote,
    Percent,
    ArrowDownToLine,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { db } from "@/lib/firebase/config";
import { getDoc, doc, getDocs, collection, setDoc } from "firebase/firestore";

export default function AdminMonetizationPage() {
    const [settings, setSettings] = useState({
        platformFee: 20,
        minWithdrawal: 500,
        giftingEnabled: true,
        subscriptionsEnabled: true,
        lockedContentEnabled: true,
        callsEnabled: false,
    });
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Platform Settings
                const settingsDoc = await getDoc(doc(db, "platform_settings", "global"));
                if (settingsDoc.exists()) {
                    setSettings(prev => ({ ...prev, ...settingsDoc.data() }));
                }

                // 2. Calculate Revenue (Sum of all user earnings/tips if available)
                const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
                const revenue = usersSnap.docs.reduce((acc, doc) => acc + (doc.data().earned || 0), 0);
                setTotalRevenue(revenue);

            } catch (error) {
                console.error("Monetization fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(doc(db, "platform_settings", "global"), settings);
            alert("Platform settings updated successfully.");
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/20">Decrypting Financial Ledgers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">FINANCIAL PROTOCOL</h1>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">Monetization Engine Control</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">Global Revenue (Net)</p>
                        <p className="text-xl font-black text-emerald-500 mt-1">${totalRevenue.toLocaleString()}.00</p>
                    </div>
                    <div className="h-10 w-px bg-white/5 mx-2" />
                    <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 shadow-lg shadow-emerald-500/10 transition-all font-bold">
                        Withdraw Platform Funds
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#16161D] border border-white/5 rounded-[32px] p-8 space-y-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <PieChart size={160} />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Settings2 className="w-5 h-5 text-blue-500" /> System Fee Configuration
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Platform Commission (%)</Label>
                                        <div className="relative">
                                            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <Input
                                                type="number"
                                                value={settings.platformFee}
                                                onChange={(e) => setSettings({ ...settings, platformFee: Number(e.target.value) })}
                                                className="h-14 bg-[#0D0D12] border-white/5 pl-12 rounded-2xl text-lg font-bold text-white transition-all focus:border-blue-500/30"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/20 leading-relaxed font-medium">Standard fee applied to all content purchases, subscriptions, and tips platform-wide.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Minimum Withdrawal ($)</Label>
                                        <div className="relative">
                                            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <Input
                                                type="number"
                                                value={settings.minWithdrawal}
                                                onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                                                className="h-14 bg-[#0D0D12] border-white/5 pl-12 rounded-2xl text-lg font-bold text-white transition-all focus:border-blue-500/30"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/20 leading-relaxed font-medium">Minimum credit balance required for a creator to initiate a payout request.</p>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20">Feature Toggles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {[
                                        { id: 'giftingEnabled', label: "Direct Gifting", desc: "Allow users to send one-time tips", status: settings.giftingEnabled },
                                        { id: 'subscriptionsEnabled', label: "Creator Subscriptions", desc: "Allow recurring monthly payments", status: settings.subscriptionsEnabled },
                                        { id: 'lockedContentEnabled', label: "Locked Content (Pay-per-view)", desc: "Individual post pricing controls", status: settings.lockedContentEnabled },
                                        { id: 'callsEnabled', label: "Video Call Monetization", desc: "Per-minute billing for calls", status: settings.callsEnabled }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</p>
                                                <p className="text-[11px] text-white/30 font-medium">{item.desc}</p>
                                            </div>
                                            <Switch
                                                checked={item.status}
                                                onCheckedChange={(checked) => setSettings({ ...settings, [item.id]: checked })}
                                                className="data-[state=checked]:bg-blue-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-blue-600 hover:bg-blue-700 h-12 px-10 rounded-xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Save Financial Protocol
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Regional/Secondary Controls */}
                <div className="space-y-8">
                    {/* Wallet Status */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white space-y-6 shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Payout Threshold</p>
                            <h3 className="text-3xl font-black">84% Progress</h3>
                        </div>
                        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden relative z-10 border border-white/5">
                            <div className="h-full w-[84%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        </div>
                        <p className="text-xs font-semibold text-white/60 relative z-10">
                            $124,000 pending in the payout queue.
                        </p>
                    </div>

                    {/* Regional Control */}
                    <div className="bg-[#16161D] border border-white/5 rounded-[32px] p-8 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 flex items-center gap-3">
                            <Globe className="w-4 h-4 text-white/30" /> Regional Commissions
                        </h3>
                        <div className="space-y-3">
                            {[
                                { region: "North America", fee: "20%" },
                                { region: "European Union", fee: "22%" },
                                { region: "United Kingdom", fee: "20%" },
                                { region: "Other Regions", fee: "18%" }
                            ].map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-[11px] font-bold text-white/60">{r.region}</span>
                                    <span className="text-[11px] font-black text-white">{r.fee}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 rounded-xl py-4">
                            Manage Region Exceptions
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
