"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    ShieldCheck,
    Share2,
    Eye,
    Ban,
    Settings2,
    AlertTriangle,
    Coins,
    CreditCard,
    Star,
    BarChart3,
    Megaphone,
    Users,
    Palette,
    Bell,
    Sliders,
    ChevronRight,
    X,
    History as HistoryIcon,
    Smartphone,
    CheckCircle2,
    Lock,
    Camera,
    Trash2,
    CheckCircle,
    Sparkles
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { useAuthStore } from "@/lib/store";
import dayjs from "dayjs";

// --- Types ---
interface SettingItem {
    id: string;
    label: string;
    icon: any;
    description: string;
}

interface Category {
    id: string;
    title: string;
    icon: any;
    items: SettingItem[];
}

// --- Data ---
const CATEGORIES: Category[] = [
    {
        id: "account", title: "Account", icon: User, items: [
            { id: "personal", label: "Personal details", icon: User, description: "Names and contact info." },
            { id: "password", label: "Password and security", icon: Lock, description: "Secure your account." },
            { id: "connected", label: "Connected accounts", icon: Share2, description: "Linked social accounts." },
        ]
    },
    {
        id: "privacy", title: "Privacy and safety", icon: ShieldCheck, items: [
            { id: "visibility", label: "Visibility", icon: Eye, description: "Control who sees your content." },
            { id: "blocking", label: "Blocking", icon: Ban, description: "Blocked users." },
        ]
    },
    {
        id: "monetization", title: "Monetization", icon: Coins, items: [
            { id: "coins", label: "Coins and earnings", icon: Coins, description: "Wallet and balance." },
            { id: "payout", label: "Payout", icon: CreditCard, description: "Withdrawal methods." },
        ]
    },
    {
        id: "creator", title: "Professional tools", icon: BarChart3, items: [
            { id: "analytics", label: "Analytics", icon: BarChart3, description: "Performance data." },
            { id: "audience", label: "Audience insights", icon: Users, description: "Follower stats." },
        ]
    },
    {
        id: "experience", title: "Experience", icon: Sliders, items: [
            { id: "appearance", label: "Appearance", icon: Palette, description: "Themes." },
        ]
    }
];

// --- Sub-Components ---

const InputRow = ({ label, value, onChange, placeholder, limit }: any) => (
    <div className="flex flex-col py-5 border-b border-white/5 group hover:bg-white/[0.01] transition-all">
        <div className="flex justify-between items-center mb-1">
            <Label.Root className="text-[12px] font-bold text-white/30 uppercase tracking-[0.05em]">{label}</Label.Root>
            {limit && <span className="text-[10px] text-white/10">{value?.length || 0}/{limit}</span>}
        </div>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent border-none p-0 text-[16px] text-white placeholder:text-white/10 outline-none focus:ring-0"
        />
    </div>
);

const DetailRow = ({ label, value, badge, action }: any) => (
    <div className="flex items-center justify-between py-5 border-b border-white/5 group hover:bg-white/[0.01] transition-all">
        <div>
            <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.05em] mb-0.5">{label}</p>
            <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-white/90">{value}</span>
                {badge && (
                    <span className="flex items-center gap-1 text-[#FF3B5C] text-[10px] font-bold uppercase tracking-tight">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                    </span>
                )}
            </div>
        </div>
        {action && (
            <button
                onClick={action.onClick}
                className="text-[12px] font-bold text-[#FF3B5C] hover:opacity-70 transition-opacity"
            >
                {action.label}
            </button>
        )}
    </div>
);

export default function EditProfilePage() {
    const { user } = useAuthStore();
    const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
    const [selectedTab, setSelectedTab] = useState<SettingItem>(CATEGORIES[0].items[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [displayName, setDisplayName] = useState(user?.displayName || "Yves Ian");
    const [username, setUsername] = useState("ishimweyvesian");
    const [bio, setBio] = useState("Digital artist & Designer.");

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#FF3B5C] font-sans">
            <Navbar />

            <div className="pt-24 flex justify-center px-4">
                <div className="w-full max-w-[960px] flex gap-10">

                    {/* SEC 1: FIXED Minimal Sidebar */}
                    <aside className="w-64 hidden lg:block fixed h-[calc(100vh-6rem)] pt-6 border-r border-white/5">
                        <div className="mb-10 px-4">
                            <h1 className="text-[13px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">Accounts Center</h1>
                            <p className="text-xl font-bold tracking-tight">Settings</p>
                        </div>

                        <nav className="space-y-0.5 px-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat); setIsModalOpen(true); }}
                                    className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-all group ${activeCategory.id === cat.id ? "bg-white/5 text-white" : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <cat.icon className={`w-4 h-4 ${activeCategory.id === cat.id ? "text-[#FF3B5C]" : "opacity-30"}`} />
                                        <span className={`text-[15px] ${activeCategory.id === cat.id ? "font-semibold" : "font-medium"}`}>{cat.title}</span>
                                    </div>
                                    {activeCategory.id === cat.id && <div className="w-1 h-1 rounded-full bg-[#FF3B5C]" />}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* SEC 2: Workspace Content */}
                    <section className="flex-1 lg:ml-64 py-4 px-12">
                        <div className="max-w-[560px]">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">
                                <span>{activeCategory.title}</span>
                                <ChevronRight className="w-3 h-3 opacity-30" />
                                <span className="text-[#FF3B5C]">{selectedTab.label}</span>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight mb-12">{selectedTab.label}</h2>

                            {selectedTab.id === "personal" ? (
                                <div className="space-y-16">
                                    <div className="space-y-8">
                                        <h3 className="text-[12px] font-bold text-white/30 uppercase tracking-[0.05em]">Profile information</h3>

                                        <div className="flex items-center gap-6 py-6 border-b border-white/5">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 p-0.5">
                                                <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=333&color=fff"} className="w-full h-full rounded-full object-cover" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[14px] font-bold">Photo</p>
                                                <div className="flex gap-4">
                                                    <button className="text-[12px] font-bold text-[#FF3B5C] hover:opacity-80 transition-opacity">Change</button>
                                                    <button className="text-[12px] font-bold text-white/20 hover:text-white">Remove</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <InputRow label="Name" value={displayName} onChange={setDisplayName} />
                                            <InputRow label="Username" value={username} onChange={setUsername} />
                                            <InputRow label="Bio" value={bio} onChange={setBio} limit={200} />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-[12px] font-bold text-white/30 uppercase tracking-[0.05em]">Account info</h3>
                                        <div className="space-y-1">
                                            <DetailRow label="Email" value={user?.email || "bright@gmail.com"} badge action={{ label: "Edit" }} />
                                            <DetailRow label="Phone" value="+250 788 000 000" badge action={{ label: "Edit" }} />
                                            <DetailRow label="Joined" value={dayjs().format("MMMM YYYY")} />
                                        </div>
                                    </div>

                                    <div className="space-y-8 text-white/50">
                                        <h3 className="text-[12px] font-bold text-white/30 uppercase tracking-[0.05em]">More</h3>
                                        <div className="space-y-1">
                                            <button className="w-full text-left py-4 border-b border-white/5 flex justify-between items-center group hover:bg-white/[0.01] transition-all">
                                                <span className="text-[14px] font-medium text-white/60 group-hover:text-white">Password</span>
                                                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40" />
                                            </button>
                                            <button className="w-full text-left py-4 border-b border-white/5 flex justify-between items-center group hover:bg-white/[0.01] transition-all">
                                                <span className="text-[14px] font-medium text-white/60 group-hover:text-white">Download information</span>
                                                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40" />
                                            </button>
                                            <button className="w-full text-left py-4 border-b border-white/5 flex justify-between items-center group hover:bg-red-500/[0.02] transition-all">
                                                <span className="text-[14px] font-bold text-red-500/50 group-hover:text-red-500 transition-colors">Delete account</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Simple Save Button */}
                                    <div className="pt-8 pb-32">
                                        <button className="w-full h-12 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#F127A3] text-white font-bold text-[15px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl text-white/10 text-[12px] font-bold uppercase tracking-widest">Available soon</div>
                            )}
                        </div>
                    </section>

                </div>
            </div>

            {/* Simplified Modal */}
            <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl z-[101] outline-none overflow-hidden">
                        <div className="p-5 border-b border-white/5 flex justify-between items-center">
                            <Dialog.Title className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{activeCategory.title}</Dialog.Title>
                            <Dialog.Close className="hover:opacity-50 transition-opacity"><X className="w-4 h-4" /></Dialog.Close>
                        </div>

                        <div className="p-2 space-y-0.5">
                            {activeCategory.items.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setSelectedTab(tab); setIsModalOpen(false); }}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[#FF3B5C]" />
                                        <span className="text-[14px] font-medium text-white/60 group-hover:text-white">{tab.label}</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/20" />
                                </button>
                            ))}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </main>
    );
}
