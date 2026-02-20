"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import {
    User, ShieldCheck, Bell, Coins,
    BarChart3, Megaphone, Users, HelpCircle, ChevronRight,
    DollarSign, Zap, Award, FileText,
    MessageSquare, Volume2, Settings, AlertTriangle, Sparkles,
    Building2, Video, Bookmark,
    Trash2, Mail, Shield, Ban, Calendar, Info, X, Loader2
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { updateUser } from "@/lib/firebase/helpers";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// ─── Firestore settings helpers ───
async function getSettings(uid: string): Promise<Record<string, any>> {
    const snap = await getDoc(doc(db, "user_settings", uid));
    return snap.exists() ? snap.data() : {};
}
async function saveSettings(uid: string, data: Record<string, any>): Promise<void> {
    await setDoc(doc(db, "user_settings", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
type TabId = "account" | "monetization" | "notifications" | "privacy" | "content" | "creator" | "support";

interface NavTab {
    id: TabId;
    label: string;
    icon: React.ElementType;
    badge?: string;
}

// ─────────────────────────────────────────────
//  NAV TABS
// ─────────────────────────────────────────────
const NAV_TABS: NavTab[] = [
    { id: "account", label: "Account", icon: User },
    { id: "monetization", label: "Monetization", icon: Coins, badge: "PRO" },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
    { id: "content", label: "Content", icon: Video },
    { id: "creator", label: "Creator Tools", icon: Sparkles },
    { id: "support", label: "Support", icon: HelpCircle },
];

// ─────────────────────────────────────────────
//  PHONE MODAL
// ─────────────────────────────────────────────

type CountryCode = Parameters<typeof getCountryCallingCode>[0];

function countryFlag(code: string): string {
    return code
        .toUpperCase()
        .split("")
        .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
        .join("");
}

const ALL_COUNTRIES = getCountries().map((code) => ({
    code,
    name: (en as Record<string, string>)[code] || code,
    dial: `+${getCountryCallingCode(code as CountryCode)}`,
    flag: countryFlag(code),
})).sort((a, b) => a.name.localeCompare(b.name));

function CountrySearchModal({
    onSelect,
    onClose,
}: {
    onSelect: (c: typeof ALL_COUNTRIES[0]) => void;
    onClose: () => void;
}) {
    const [search, setSearch] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        searchRef.current?.focus();
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const filtered = ALL_COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dial.includes(search)
    );

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-[400px] bg-[#1a1a1a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
                style={{ maxHeight: "80vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                    <span className="text-[12px] font-bold text-white/50 tracking-widest uppercase">Select Country</span>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 bg-white/[0.05] rounded-xl px-3 py-2.5">
                        <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            ref={searchRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="bg-transparent text-[14px] text-white placeholder:text-white/30 outline-none flex-1"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 130px)" }}>
                    {filtered.map((c) => (
                        <button
                            key={c.code}
                            onClick={() => { onSelect(c); onClose(); }}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.05] transition-colors text-left"
                        >
                            <span className="text-[22px] leading-none w-7 flex-shrink-0">{c.flag}</span>
                            <span className="text-[14px] text-white flex-1">{c.name}</span>
                            <span className="text-[13px] text-white/40">{c.dial}</span>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-center text-white/30 text-[13px] py-8">No results</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PhoneModal({ onClose, onSave }: { onClose: () => void; onSave: (phone: string) => Promise<void> }) {
    const [country, setCountry] = useState(ALL_COUNTRIES.find((c) => c.code === "US")!);
    const [number, setNumber] = useState("");
    const [saving, setSaving] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !showCountryPicker) onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, showCountryPicker]);

    const handleSave = async () => {
        if (!number.trim()) return;
        setSaving(true);
        await onSave(`${country.dial}${number.trim()}`);
        setSaving(false);
        onClose();
    };

    return (
        <>
            {showCountryPicker && (
                <CountrySearchModal
                    onSelect={(c) => setCountry(c)}
                    onClose={() => setShowCountryPicker(false)}
                />
            )}
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <div
                    className="relative w-full max-w-[400px] bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>

                    <h2 className="text-[18px] font-bold text-white text-center mb-1">Connect Phone Number</h2>
                    <p className="text-[13px] text-white/60 text-center mb-5">Verification code will be sent to this number</p>

                    {/* Phone input row */}
                    <div className="flex items-center gap-2 bg-[#111] border border-white/[0.08] rounded-xl px-3 h-12 mb-3 focus-within:border-pink-500/50 transition-colors">
                        {/* Country selector button */}
                        <button
                            onClick={() => setShowCountryPicker(true)}
                            className="flex items-center gap-1.5 flex-shrink-0 pr-2 border-r border-white/[0.08]"
                        >
                            <span className="text-[22px] leading-none">{country.flag}</span>
                            <span className="text-[13px] text-white/50">{country.dial}</span>
                            <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {/* Number input */}
                        <input
                            type="tel"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                            placeholder="Phone Number"
                            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/25 outline-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || !number.trim()}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Continue
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-12 rounded-xl border border-white/[0.08] text-white/60 font-medium text-[15px] hover:bg-white/[0.04] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

// ─────────────────────────────────────────────
//  DELETE ACCOUNT MODAL
// ─────────────────────────────────────────────

const DELETE_REASONS = [
    "I want to use a different account",
    "I met inappropriate or abusive users",
    "Not satisfied with the app behavior",
    "I no longer have an interest in using Velo",
    "Other reason",
];

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
    const [reason, setReason] = useState("");

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-[400px] bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-[20px] font-bold text-white text-center mb-5 leading-snug">
                    Why did you choose to leave Velo?
                </h2>

                <div className="space-y-3 mb-6">
                    {DELETE_REASONS.map((r) => (
                        <button
                            key={r}
                            onClick={() => setReason(r)}
                            className="w-full flex items-center gap-3 text-left group"
                        >
                            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                reason === r ? "border-[#FF2D55]" : "border-white/30 group-hover:border-white/60"
                            }`}>
                                {reason === r && <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D55]" />}
                            </span>
                            <span className="text-[14px] text-white/80">{r}</span>
                        </button>
                    ))}
                </div>

                <button
                    disabled={!reason}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#c026d3] text-white font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
                <button
                    onClick={onClose}
                    className="w-full h-12 rounded-xl border border-white/[0.08] text-white/70 font-medium text-[15px] hover:bg-white/[0.04] transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  EDIT MODAL
// ─────────────────────────────────────────────

interface ModalConfig {
    field: string;
    label: string;
    description?: string;
    placeholder?: string;
    type?: string;
    initialValue?: string;
}

function EditModal({
    config,
    onClose,
    onSave,
}: {
    config: ModalConfig;
    onClose: () => void;
    onSave: (field: string, value: string) => Promise<void>;
}) {
    const [value, setValue] = useState(config.initialValue || "");
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(config.field, value);
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-[420px] bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>

                {/* Title */}
                <h2 className="text-[18px] font-bold text-white text-center mb-2">{config.label}</h2>

                {/* Description */}
                {config.description && (
                    <p className="text-[13px] text-white/60 text-center mb-5 leading-snug">
                        {config.description}
                    </p>
                )}

                {/* Input */}
                <input
                    ref={inputRef}
                    type={config.type || "text"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={config.placeholder || ""}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/25 outline-none focus:border-pink-500/50 transition-colors mb-3"
                />

                {/* Continue */}
                <button
                    onClick={handleSave}
                    disabled={saving || !value.trim()}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#a855f7] text-white font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Continue
                </button>

                {/* Cancel */}
                <button
                    onClick={onClose}
                    className="w-full h-12 rounded-xl border border-white/[0.08] text-white/60 font-medium text-[15px] hover:bg-white/[0.04] transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────

function PageTitle({ title }: { title: string }) {
    return <h1 className="text-[26px] font-bold text-white mb-8">{title}</h1>;
}

function SectionTitle({ title }: { title: string }) {
    return <h2 className="text-[18px] font-bold text-white mt-10 mb-3">{title}</h2>;
}

function CategoryLabel({ label }: { label: string }) {
    return <p className="text-[13px] text-white/40 mt-5 mb-2">{label}</p>;
}

function SettingRow({ label, value, action, hint, danger }: {
    label: string;
    value?: string;
    hint?: React.ReactNode;
    danger?: boolean;
    action?: { label: string; onClick?: () => void };
}) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
            <div className="flex items-center gap-2">
                <span className={`text-[15px] font-semibold ${danger ? "text-red-400" : "text-white"}`}>{label}</span>
                {hint && <span className="text-white/30">{hint}</span>}
            </div>
            <div className="flex items-center gap-3">
                {value && <span className="text-[14px] text-white/40">{value}</span>}
                {action && (
                    <button
                        onClick={action.onClick}
                        className="px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-[13px] font-medium text-white/80 hover:border-pink-500/40 hover:text-white transition-colors"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}

function ToggleRow({ label, sublabel, checked, onChange }: {
    label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between py-3.5 border-b border-white/[0.05] last:border-0 gap-4">
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white">{label}</p>
                {sublabel && <p className="text-[13px] text-white/35 mt-0.5 leading-snug">{sublabel}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-10 h-[22px] rounded-full transition-all flex-shrink-0 mt-0.5 ${
                    checked
                        ? "bg-gradient-to-r from-[#FF2D55] to-[#a855f7]"
                        : "bg-white/15"
                }`}
            >
                <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-[22px]" : "left-[3px]"}`} />
            </button>
        </div>
    );
}

function DeleteRow() {
    return (
        <div className="flex items-center gap-4 py-4 border-t border-white/[0.05] mt-4">
            <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-red-500/30 text-[14px] font-semibold text-red-400 hover:bg-red-500/[0.07] transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Account
            </button>
            <span className="text-[13px] text-white/35">You will have 30 days to restore your account</span>
        </div>
    );
}

function LinkRow({ label, sublabel, danger, onClick }: {
    label: string; sublabel?: string; danger?: boolean; onClick?: () => void;
}) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0 text-left group">
            <div>
                <p className={`text-[15px] font-semibold ${danger ? "text-red-400" : "text-white"}`}>{label}</p>
                {sublabel && <p className="text-[13px] text-white/35 mt-0.5">{sublabel}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
        </button>
    );
}

function SelectRow({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
            <p className="text-[15px] font-semibold text-white">{label}</p>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border border-white/20 text-white/60 text-[13px] rounded-full px-3 py-1.5 outline-none cursor-pointer"
            >
                {options.map((o) => <option key={o} value={o} className="bg-[#111]">{o}</option>)}
            </select>
        </div>
    );
}

// ─────────────────────────────────────────────
//  TAB PANELS
// ─────────────────────────────────────────────

function AccountPanel({ user }: { user: any }) {
    const [tfa, setTfa] = useState(true);
    const [modal, setModal] = useState<ModalConfig | null>(null);
    const [showPhone, setShowPhone] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [localUser, setLocalUser] = useState(user);

    const openModal = (config: ModalConfig) => setModal(config);
    const closeModal = () => setModal(null);

    const handleSave = async (field: string, value: string) => {
        if (!user?.uid) return;
        await updateUser(user.uid, { [field]: value });
        setLocalUser((prev: any) => ({ ...prev, [field]: value }));
    };

    const handlePhoneSave = async (phone: string) => {
        if (!user?.uid) return;
        await updateUser(user.uid, { phone });
        setLocalUser((prev: any) => ({ ...prev, phone }));
    };

    return (
        <div>
            {modal && <EditModal config={modal} onClose={closeModal} onSave={handleSave} />}
            {showPhone && <PhoneModal onClose={() => setShowPhone(false)} onSave={handlePhoneSave} />}
            {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}

            <PageTitle title="Settings" />

            <SectionTitle title="Account" />

            <CategoryLabel label="Personal Info" />
            <SettingRow
                label="Email"
                value={localUser?.email || "—"}
                action={{ label: "Edit", onClick: () => openModal({ field: "email", label: "Email", description: "Used only to contact you for special promotions and support. Not visible to anyone.", placeholder: localUser?.email || "your@email.com", type: "email", initialValue: localUser?.email || "" }) }}
            />
            <SettingRow
                label="Display Name"
                value={localUser?.displayName || "—"}
                action={{ label: "Edit", onClick: () => openModal({ field: "displayName", label: "Display Name", description: "This is the name shown on your profile.", placeholder: "Your name", initialValue: localUser?.displayName || "" }) }}
            />
            <SettingRow
                label="Username"
                value={localUser?.username ? `@${localUser.username}` : "—"}
                action={{ label: "Edit", onClick: () => openModal({ field: "username", label: "Username", description: "Your unique handle on the platform.", placeholder: "username", initialValue: localUser?.username || "" }) }}
            />
            <SettingRow
                label="Bio"
                value={localUser?.bio ? localUser.bio.slice(0, 30) + (localUser.bio.length > 30 ? "…" : "") : "—"}
                action={{ label: "Edit", onClick: () => openModal({ field: "bio", label: "Bio", description: "Tell the world about yourself.", placeholder: "Write something about you…", initialValue: localUser?.bio || "" }) }}
            />

            <CategoryLabel label="Login Methods" />
            <SettingRow
                label="Phone number"
                value={localUser?.phone || undefined}
                action={{ label: localUser?.phone ? "Change" : "Connect", onClick: () => setShowPhone(true) }}
            />
            <ToggleRow label="Two-Factor Authentication" sublabel="Extra layer of security" checked={tfa} onChange={setTfa} />
            <LinkRow label="Active Sessions" sublabel="2 devices signed in" />
            <LinkRow label="Change Password" />

            <CategoryLabel label="Other" />
            <SettingRow
                label="Join an Agency"
                hint={<Info className="w-4 h-4" />}
                action={{ label: "Enter Code", onClick: () => openModal({ field: "agencyCode", label: "Join an Agency", description: "Enter your agency invite code to unlock managed creator benefits.", placeholder: "Agency invite code" }) }}
            />

            <div className="flex items-center gap-4 py-4 border-t border-white/[0.05] mt-8">
                <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-red-500/30 text-[14px] font-semibold text-red-400 hover:bg-red-500/[0.07] transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
                <span className="text-[13px] text-white/35">You will have 30 days to restore your account</span>
            </div>
        </div>
    );
}

function MonetizationPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [modal, setModal] = useState<ModalConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => { setSettings(s); setLoading(false); });
    }, [user?.uid]);

    const toggle = async (key: string, val: boolean) => {
        setSettings((p) => ({ ...p, [key]: val }));
        if (user?.uid) await saveSettings(user.uid, { [key]: val });
    };
    const handleSave = async (field: string, value: string) => {
        if (!user?.uid) return;
        setSettings((p) => ({ ...p, [field]: value }));
        await saveSettings(user.uid, { [field]: value });
    };

    if (loading) return <div className="py-20 text-center text-white/30 text-sm">Loading…</div>;

    return (
        <div>
            {modal && <EditModal config={modal} onClose={() => setModal(null)} onSave={handleSave} />}
            <PageTitle title="Settings" />
            <SectionTitle title="Payments" />
            <SettingRow label="Currency" value={settings.currency || "USD — US Dollar"} action={{ label: "Change", onClick: () => setModal({ field: "currency", label: "Preferred Currency", description: "Choose the currency used for your earnings and payouts.", placeholder: "USD, EUR, GBP…", initialValue: settings.currency || "" }) }} />
            <SettingRow label="Payment Method" value={settings.paymentMethod || "—"} action={{ label: "Update", onClick: () => setModal({ field: "paymentMethod", label: "Payment Method", description: "Enter your bank account or payout details.", placeholder: "IBAN / Account number", initialValue: settings.paymentMethod || "" }) }} />
            <SettingRow label="Tax Information" value={settings.taxInfo || "—"} action={{ label: "Update", onClick: () => setModal({ field: "taxInfo", label: "Tax Information", description: "Your tax form details for compliance.", placeholder: "Tax ID / SSN", initialValue: settings.taxInfo || "" }) }} />
            <SettingRow label="Withdraw Funds" value={settings.balance ? `$${settings.balance} available` : "—"} action={{ label: "Withdraw", onClick: () => setModal({ field: "withdraw", label: "Withdraw Funds", description: "Enter the amount you want to withdraw.", placeholder: "Amount in USD", type: "number" }) }} />
            <SectionTitle title="Revenue" />
            <ToggleRow label="Tips" sublabel="Let viewers tip during streams & posts" checked={!!settings.tipsEnabled} onChange={(v) => toggle("tipsEnabled", v)} />
            <ToggleRow label="Subscriptions" sublabel="Monthly recurring fan subscriptions" checked={!!settings.subsEnabled} onChange={(v) => toggle("subsEnabled", v)} />
            <ToggleRow label="Premium Streams" sublabel="Charge entry to live streams" checked={!!settings.premiumStreams} onChange={(v) => toggle("premiumStreams", v)} />
            <ToggleRow label="One-Click Gifting" sublabel="Fast gifting with saved payment method" checked={!!settings.oneClickGifting} onChange={(v) => toggle("oneClickGifting", v)} />
            <SettingRow label="Custom Gift Pricing" value={settings.giftPrice || "—"} action={{ label: "Set Prices", onClick: () => setModal({ field: "giftPrice", label: "Custom Gift Pricing", description: "Set your own gift price tiers for fans.", placeholder: "e.g. 5, 10, 50", initialValue: settings.giftPrice || "" }) }} />
        </div>
    );
}

function NotificationsPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [modal, setModal] = useState<ModalConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => { setSettings(s); setLoading(false); });
    }, [user?.uid]);

    const toggle = async (key: string, val: boolean) => {
        setSettings((p) => ({ ...p, [key]: val }));
        if (user?.uid) await saveSettings(user.uid, { [key]: val });
    };
    const handleSave = async (field: string, value: string) => {
        if (!user?.uid) return;
        setSettings((p) => ({ ...p, [field]: value }));
        await saveSettings(user.uid, { [field]: value });
    };

    if (loading) return <div className="py-20 text-center text-white/30 text-sm">Loading…</div>;

    return (
        <div>
            {modal && <EditModal config={modal} onClose={() => setModal(null)} onSave={handleSave} />}
            <PageTitle title="Settings" />
            <SectionTitle title="Payments" />
            <SettingRow label="Preferred Currency" value={settings.currency || "—"} action={{ label: "Manage", onClick: () => setModal({ field: "currency", label: "Preferred Currency", description: "Choose the currency used for your earnings and payouts.", placeholder: "USD, EUR, GBP…", initialValue: settings.currency || "" }) }} />
            <SectionTitle title="Notifications" />
            <ToggleRow label="Notifications" checked={!!settings.notifsEnabled} onChange={(v) => toggle("notifsEnabled", v)} />
            <div className="flex items-start justify-between py-3.5 border-b border-white/[0.05] gap-4">
                <div>
                    <p className="text-[15px] font-semibold text-white">Live Notifications</p>
                    <p className="text-[13px] text-white/35 mt-0.5">Get notified when your Friends are Live</p>
                </div>
                <button onClick={() => setModal({ field: "liveNotifsNote", label: "Live Notifications", description: "Add a note about your live notification preferences.", placeholder: "Note (optional)…", initialValue: settings.liveNotifsNote || "" })} className="px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-[13px] font-medium text-white/80 hover:border-pink-500/40 hover:text-white transition-colors flex-shrink-0">Manage</button>
            </div>
            <SectionTitle title="Privacy &amp; Terms" />
            <SettingRow label="Blocked Users" action={{ label: "Manage", onClick: () => setModal({ field: "blockedUsers", label: "Block a User", description: "Enter a username to block them from interacting with you.", placeholder: "@username" }) }} />
            <SettingRow label="Cookie Consent Settings" value={settings.cookieConsent || "—"} action={{ label: "Manage", onClick: () => setModal({ field: "cookieConsent", label: "Cookie Consent", description: "Update your cookie and tracking preferences.", placeholder: "e.g. analytics, marketing…", initialValue: settings.cookieConsent || "" }) }} />
            <ToggleRow label="Email Newsletter" checked={!!settings.emailNewsletter} onChange={(v) => toggle("emailNewsletter", v)} />
        </div>
    );
}

function PrivacyPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => { setSettings(s); setLoading(false); });
    }, [user?.uid]);

    const toggle = async (key: string, val: boolean) => {
        setSettings((p) => ({ ...p, [key]: val }));
        if (user?.uid) await saveSettings(user.uid, { [key]: val });
    };
    const changeLang = async (val: string) => {
        setSettings((p) => ({ ...p, language: val }));
        if (user?.uid) await saveSettings(user.uid, { language: val });
    };

    if (loading) return <div className="py-20 text-center text-white/30 text-sm">Loading…</div>;

    return (
        <div>
            {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
            <PageTitle title="Settings" />
            <SectionTitle title="General" />
            <SelectRow label="Language" options={["English", "Arabic", "French", "Spanish", "German"]} value={settings.language || "English"} onChange={changeLang} />
            <ToggleRow label="Show NSFW content (18+)" sublabel="Enabling NSFW content allows sensitive text, images, and videos to be shown. This cannot be activated for anonymous accounts and only applies to the current account." checked={!!settings.showNsfw} onChange={(v) => toggle("showNsfw", v)} />
            <ToggleRow label="Access to Premium streams" checked={!!settings.premiumStreams} onChange={(v) => toggle("premiumStreams", v)} />
            <ToggleRow label="One-Click Gifting" sublabel="Allow sending gifts without confirmation" checked={!!settings.oneClickGifting} onChange={(v) => toggle("oneClickGifting", v)} />
            <ToggleRow label="Recommend Me in Chat" checked={!!settings.recommendInChat} onChange={(v) => toggle("recommendInChat", v)} />
            <div className="flex items-start justify-between py-3.5 border-b border-white/[0.05] gap-4">
                <div>
                    <p className="text-[15px] font-semibold text-white">Remove Card from Auction</p>
                    <p className="text-[13px] text-white/35 mt-0.5">You have no Cards in ongoing Auctions</p>
                </div>
            </div>
            <div className="flex items-center gap-4 py-4 border-t border-white/[0.05] mt-8">
                <button onClick={() => setShowDelete(true)} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-red-500/30 text-[14px] font-semibold text-red-400 hover:bg-red-500/[0.07] transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
                <span className="text-[13px] text-white/35">You will have 30 days to restore your account</span>
            </div>
        </div>
    );
}

function ContentPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => { setSettings(s); setLoading(false); });
    }, [user?.uid]);

    const toggle = async (key: string, val: boolean) => {
        setSettings((p) => ({ ...p, [key]: val }));
        if (user?.uid) await saveSettings(user.uid, { [key]: val });
    };
    const changeSelect = async (key: string, val: string) => {
        setSettings((p) => ({ ...p, [key]: val }));
        if (user?.uid) await saveSettings(user.uid, { [key]: val });
    };

    if (loading) return <div className="py-20 text-center text-white/30 text-sm">Loading…</div>;

    return (
        <div>
            {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
            <PageTitle title="Settings" />
            <SectionTitle title="Content" />
            <CategoryLabel label="Publishing Defaults" />
            <SelectRow label="Default video quality" options={["4K", "1080p", "720p", "480p"]} value={settings.defaultQuality || "1080p"} onChange={(v) => changeSelect("defaultQuality", v)} />
            <SelectRow label="Default visibility" options={["Public", "Followers Only", "Subscribers", "Draft"]} value={settings.defaultVisibility || "Public"} onChange={(v) => changeSelect("defaultVisibility", v)} />
            <ToggleRow label="Draft autosave" checked={settings.draftAutosave !== false} onChange={(v) => toggle("draftAutosave", v)} />
            <ToggleRow label="Premium stream access" checked={!!settings.premiumStreams} onChange={(v) => toggle("premiumStreams", v)} />
            <CategoryLabel label="Your Library" />
            <LinkRow label="Scheduled Posts" />
            <LinkRow label="Saved Drafts" />
            <LinkRow label="Download My Data" />
            <div className="flex items-center gap-4 py-4 border-t border-white/[0.05] mt-8">
                <button onClick={() => setShowDelete(true)} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-red-500/30 text-[14px] font-semibold text-red-400 hover:bg-red-500/[0.07] transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
                <span className="text-[13px] text-white/35">You will have 30 days to restore your account</span>
            </div>
        </div>
    );
}

function CreatorPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [modal, setModal] = useState<ModalConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => { setSettings(s); setLoading(false); });
    }, [user?.uid]);

    const handleSave = async (field: string, value: string) => {
        if (!user?.uid) return;
        setSettings((p) => ({ ...p, [field]: value }));
        await saveSettings(user.uid, { [field]: value });
        if (field === "agencyCode") await updateUser(user.uid, { agencyCode: value });
    };

    if (loading) return <div className="py-20 text-center text-white/30 text-sm">Loading…</div>;

    return (
        <div>
            {modal && <EditModal config={modal} onClose={() => setModal(null)} onSave={handleSave} />}
            <PageTitle title="Settings" />
            <SectionTitle title="Creator Tools" />
            <CategoryLabel label="Agency Program" />
            <SettingRow label="Join an Agency" hint={<Info className="w-4 h-4" />} value={settings.agencyCode ? `Code: ${settings.agencyCode}` : undefined} action={{ label: settings.agencyCode ? "Change" : "Enter Code", onClick: () => setModal({ field: "agencyCode", label: "Join an Agency", description: "Enter your agency invite code to unlock managed creator benefits.", placeholder: "Agency invite code", initialValue: settings.agencyCode || "" }) }} />
            <LinkRow label="View Agency Benefits" />
            <CategoryLabel label="Growth & Analytics" />
            <LinkRow label="Analytics Dashboard" sublabel="Views, watchtime, revenue breakdown" />
            <LinkRow label="Audience Insights" sublabel="Who's watching your content" />
            <SettingRow label="Promotion Boost" value={settings.boostBudget ? `$${settings.boostBudget} budget` : "—"} action={{ label: "Boost", onClick: () => setModal({ field: "boostBudget", label: "Promotion Boost", description: "Set a budget to amplify your reach across the platform.", placeholder: "Budget in USD", type: "number", initialValue: settings.boostBudget || "" }) }} />
            <LinkRow label="Scheduled Posts" />
            <CategoryLabel label="Creator Profile" />
            <SettingRow label="Auction Settings" value={settings.auctionMin ? `Min bid: ${settings.auctionMin} coins` : "—"} action={{ label: "Configure", onClick: () => setModal({ field: "auctionMin", label: "Auction Settings", description: "Set the minimum bid price for your exclusive content auctions.", placeholder: "Minimum bid (coins)", type: "number", initialValue: settings.auctionMin || "" }) }} />
            <LinkRow label="Creator Badge Status" sublabel="Gold Creator · Next tier at 25K" />
        </div>
    );
}

function SupportPanel() {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [modal, setModal] = useState<ModalConfig | null>(null);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;
        getSettings(user.uid).then((s) => setSettings(s));
    }, [user?.uid]);

    const handleSave = async (field: string, value: string) => {
        if (!user?.uid || !value.trim()) return;
        if (field === "report" || field === "supportMsg") {
            await addDoc(collection(db, "user_reports"), {
                uid: user.uid,
                type: field,
                message: value,
                createdAt: serverTimestamp(),
            });
        } else {
            setSettings((p) => ({ ...p, [field]: value }));
            await saveSettings(user.uid, { [field]: value });
        }
    };

    return (
        <div>
            {modal && <EditModal config={modal} onClose={() => setModal(null)} onSave={handleSave} />}
            {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}

            <PageTitle title="Settings" />
            <SectionTitle title="Support" />

            <CategoryLabel label="Get Help" />
            <SettingRow label="Report a Problem" action={{ label: "Report", onClick: () => setModal({ field: "report", label: "Report a Problem", description: "Describe the issue you're experiencing and we'll look into it.", placeholder: "Describe the problem…" }) }} />
            <SettingRow label="Contact Support" action={{ label: "Message", onClick: () => setModal({ field: "supportMsg", label: "Contact Support", description: "Send a message to the Velo support team.", placeholder: "How can we help you?" }) }} />
            <LinkRow label="Help Center" onClick={() => window.open("https://help.velo.com", "_blank")} />

            <CategoryLabel label="Legal" />
            <LinkRow label="Terms of Service" onClick={() => window.open("/terms", "_blank")} />
            <LinkRow label="Privacy Policy" onClick={() => window.open("/privacy", "_blank")} />
            <SettingRow label="Cookie Settings" value={settings.cookieConsent || "—"} action={{ label: "Manage", onClick: () => setModal({ field: "cookieConsent", label: "Cookie Settings", description: "Update your cookie and tracking preferences.", placeholder: "e.g. analytics, marketing…", initialValue: settings.cookieConsent || "" }) }} />

            <CategoryLabel label="Danger Zone" />
            <div className="flex items-center gap-4 py-4 border-t border-white/[0.05] mt-2">
                <button onClick={() => setShowDelete(true)} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-red-500/30 text-[14px] font-semibold text-red-400 hover:bg-red-500/[0.07] transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
                <span className="text-[13px] text-white/35">You will have 30 days to restore your account</span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  PANEL MAP
// ─────────────────────────────────────────────
function PanelRenderer({ tab, user }: { tab: TabId; user: any }) {
    switch (tab) {
        case "account": return <AccountPanel user={user} />;
        case "monetization": return <MonetizationPanel />;
        case "notifications": return <NotificationsPanel />;
        case "privacy": return <PrivacyPanel />;
        case "content": return <ContentPanel />;
        case "creator": return <CreatorPanel />;
        case "support": return <SupportPanel />;
    }
}

// ─────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────
export default function SettingsPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabId>("account");

    return (
        <main className="min-h-screen bg-[#111] text-white font-sans">
            <Navbar />

            <div className="pt-16 flex min-h-screen">
                {/* ── SIDEBAR ── */}
                <aside className="w-56 hidden lg:flex flex-col fixed top-16 bottom-0 border-r border-white/[0.06] overflow-y-auto scrollbar-hide">
                    <nav className="flex-1 px-3 py-6 space-y-0.5">
                        {NAV_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                        isActive
                                            ? "bg-gradient-to-r from-pink-500/15 to-purple-500/10 text-white border border-pink-500/20"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-pink-400" : ""}`} strokeWidth={1.8} />
                                    <span className="text-[14px] font-medium flex-1">{tab.label}</span>
                                    {tab.badge && (
                                        <span className="text-[9px] font-bold text-white/40 border border-white/15 px-1.5 py-0.5 rounded">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 lg:ml-56">
                    {/* Mobile tab strip */}
                    <div className="lg:hidden overflow-x-auto scrollbar-hide border-b border-white/[0.06]">
                        <div className="flex gap-1 px-4 py-2">
                            {NAV_TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap text-[12px] font-medium transition-colors flex-shrink-0 ${
                                            isActive ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="max-w-xl mx-auto px-6 py-10 pb-24">
                        <PanelRenderer tab={activeTab} user={user} />
                    </div>
                </div>
            </div>
        </main>
    );
}
