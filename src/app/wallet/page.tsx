"use client";

import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    X,
    ChevronDown,
    Plus,
    Gem,
    Loader2
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { XSidebar } from "@/components/x-layout/XSidebar";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import { useUserRealtime } from "@/lib/firebase/hooks";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- Global Data ---
const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla",
    "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)",
    "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands",
    "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland",
    "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Ivory Coast", "Jamaica",
    "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Macau", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea",
    "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russia", "Rwanda",
    "Saint Barthélemy", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin",
    "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (U.S.)", "Wallis and Futuna",
    "Yemen", "Zambia", "Zimbabwe"
];

const CURRENCIES = [
    { code: "RWF", name: "Rwandan Franc" },
    { code: "AED", name: "UAE Dirham" },
    { code: "AFN", name: "Afghan Afghani" },
    { code: "ALL", name: "Albanian Lek" },
    { code: "AMD", name: "Armenian Dram" },
    { code: "ARS", name: "Argentine Peso" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "AZN", name: "Azerbaijani Manat" },
    { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
    { code: "BDT", name: "Bangladeshi Taka" },
    { code: "BGN", name: "Bulgarian Lev" },
    { code: "BHD", name: "Bahraini Dinar" },
    { code: "BND", name: "Brunei Dollar" },
    { code: "BOB", name: "Bolivian Boliviano" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "BWP", name: "Botswana Pula" },
    { code: "BYN", name: "Belarusian Ruble" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CLP", name: "Chilean Peso" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "COP", name: "Colombian Peso" },
    { code: "CZK", name: "Czech Koruna" },
    { code: "DKK", name: "Danish Krone" },
    { code: "DZD", name: "Algerian Dinar" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "ETB", name: "Ethiopian Birr" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound Sterling" },
    { code: "GEL", name: "Georgian Lari" },
    { code: "GHS", name: "Ghanaian Cedi" },
    { code: "GTQ", name: "Guatemalan Quetzal" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "HNL", name: "Honduran Lempira" },
    { code: "HUF", name: "Hungarian Forint" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "ILS", name: "Israeli New Shekel" },
    { code: "INR", name: "Indian Rupee" },
    { code: "IQD", name: "Iraqi Dinar" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "JMD", name: "Jamaican Dollar" },
    { code: "JOD", name: "Jordanian Dinar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "KRW", name: "South Korean Won" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "KZT", name: "Kazakhstani Tenge" },
    { code: "LBP", name: "Lebanese Pound" },
    { code: "LKR", name: "Sri Lankan Rupee" },
    { code: "MAD", name: "Moroccan Dirham" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "NPR", name: "Nepalese Rupee" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "OMR", name: "Omani Rial" },
    { code: "PHP", name: "Philippine Peso" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "PLN", name: "Polish Zloty" },
    { code: "QAR", name: "Qatari Rial" },
    { code: "RON", name: "Romanian Leu" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "THB", name: "Thai Baht" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "TWD", name: "New Taiwan Dollar" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "UGX", name: "Ugandan Shilling" },
    { code: "USD", name: "United States Dollar" },
    { code: "UYU", name: "Uruguayan Peso" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "XAF", name: "CFA Franc BEAC" },
    { code: "XOF", name: "CFA Franc BCEAO" },
    { code: "YER", name: "Yemeni Rial" },
    { code: "ZAR", name: "South African Rand" },
    { code: "ZMW", name: "Zambian Kwacha" }
];

const PAYMENT_METHODS = [
    { name: "Airwallex", logo: "https://www.vectorlogo.zone/logos/airwallex/airwallex-icon.svg" },
    { name: "Crypto", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { name: "Payoneer", logo: "https://www.vectorlogo.zone/logos/payoneer/payoneer-icon.svg" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" },
    { name: "VISA / Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Apple Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/3/37/Apple_Pay_logo.svg" },
    { name: "Google Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
];

export default function WalletPage() {
    const { isAuthenticated, user: authUser } = useAuthStore();
    const { data: userData, isLoading } = useUserRealtime(authUser?.uid);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<'methods' | 'detail' | 'country' | 'currency'>('methods');
    const [modalMode, setModalMode] = useState<'deposit' | 'withdraw'>('withdraw');
    const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedPaymentType, setSelectedPaymentType] = useState("");

    useEffect(() => {
        if (!isAuthenticated) router.push("/");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    // 1 coin = 1 FRW
    const coins = userData?.coins || 0;
    const goalFRW = 3000;
    const progressPct = Math.min((coins / (coins + goalFRW)) * 100, 100);

    const openModal = (mode: 'deposit' | 'withdraw') => {
        setModalMode(mode);
        setModalStep('methods');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#ff3b5c]">
            <Navbar />

            <div className="max-w-[1300px] mx-auto flex pt-16">
                <header className="fixed h-[calc(100vh-64px)] w-[72px] xl:w-[275px] border-r border-white/10 hidden sm:block">
                    <XSidebar />
                </header>

                <main className="flex-grow sm:ml-[72px] xl:ml-[275px] px-6 py-12">
                    <div className="max-w-2xl mx-auto">

                        {/* Header */}
                        <h1 className="text-2xl font-bold mb-8">Wallet</h1>

                        {/* Balance Card — flat, sharp, clean */}
                        <div className="border border-white/10 rounded-2xl p-8 mb-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-white/40" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-white/40 mb-1 font-medium">Current Balance</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-5xl font-bold tracking-tight">{coins.toLocaleString()}</span>
                                        <span className="text-lg text-white/30 font-semibold">FRW</span>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex items-center justify-between text-xs text-white/30 mb-2 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Gem size={12} className="text-white/30" />
                                            Progress to {goalFRW.toLocaleString()} FRW goal
                                        </span>
                                        <span>{Math.round(progressPct)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/[0.07] rounded-full">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-700"
                                            style={{ width: `${Math.max(progressPct, 2)}%` }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-10">
                            <button
                                onClick={() => openModal('withdraw')}
                                className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors"
                            >
                                <Plus size={16} className="text-white/50" />
                                Withdraw
                            </button>
                            <button
                                onClick={() => openModal('deposit')}
                                className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors"
                            >
                                <Plus size={16} className="text-white/50" />
                                Deposit
                            </button>
                        </div>

                        {/* Info Note */}
                        <p className="text-xs text-white/20 text-center">1 coin = 1 FRW · Earnings update in real time</p>
                    </div>
                </main>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

                    <div className="relative w-full max-w-[420px] bg-[#111111] rounded-3xl overflow-hidden shadow-2xl">

                        {/* ── STEP 1: Methods List ── */}
                        {modalStep === 'methods' && (
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-2xl font-bold leading-tight">
                                        {modalMode === 'withdraw' ? 'Withdrawal\nMethods' : 'Deposit\nMethods'}
                                    </h2>
                                    <button onClick={closeModal} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0">
                                        <X size={15} />
                                    </button>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[440px]" style={{ scrollbarWidth: 'none' }}>
                                    {PAYMENT_METHODS.map((m) => (
                                        <button
                                            key={m.name}
                                            onClick={() => {
                                                setSelectedMethod(m);
                                                setSelectedCountry("");
                                                setSelectedCurrency("");
                                                setSelectedPaymentType("");
                                                setModalStep('detail');
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3.5 border border-white/10 rounded-2xl hover:border-white/25 hover:bg-white/[0.03] transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[15px] font-semibold">{m.name}</span>
                                            </div>
                                            <span className="text-[13px] font-semibold text-white/50 border border-white/10 px-3.5 py-1.5 rounded-full">Add</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Method Detail Form (matches screenshot) ── */}
                        {modalStep === 'detail' && selectedMethod && (
                            <div className="p-6">
                                {/* Header: back + method name + X */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setModalStep('methods')}
                                            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 overflow-hidden shrink-0">
                                                <img src={selectedMethod.logo} alt={selectedMethod.name} className="w-full h-full object-contain" />
                                            </div>
                                            <h2 className="text-2xl font-bold">{selectedMethod.name}</h2>
                                        </div>
                                    </div>
                                    <button onClick={closeModal} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0">
                                        <X size={15} />
                                    </button>
                                </div>

                                {/* Three Dropdown Fields */}
                                <div className="space-y-4 mb-8">
                                    {/* Bank country / region */}
                                    <div>
                                        <label className="text-sm font-semibold text-white mb-1.5 block">Bank country / region</label>
                                        <button
                                            onClick={() => setModalStep('country')}
                                            className="w-full flex items-center justify-between px-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
                                        >
                                            <span className={cn("text-[15px]", selectedCountry ? "text-white" : "text-white/25")}>
                                                {selectedCountry || "Bank country / region"}
                                            </span>
                                            <ChevronDown size={16} className="text-white/30 shrink-0" />
                                        </button>
                                    </div>

                                    {/* Account currency */}
                                    <div>
                                        <label className="text-sm font-semibold text-white mb-1.5 block">Account currency</label>
                                        <button
                                            onClick={() => setModalStep('currency')}
                                            className="w-full flex items-center justify-between px-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
                                        >
                                            <span className={cn("text-[15px]", selectedCurrency ? "text-white" : "text-white/25")}>
                                                {selectedCurrency || "Account currency"}
                                            </span>
                                            <ChevronDown size={16} className="text-white/30 shrink-0" />
                                        </button>
                                    </div>

                                    {/* Payment methods */}
                                    <div>
                                        <label className="text-sm font-semibold text-white mb-1.5 block">Payment methods</label>
                                        <button
                                            onClick={() => setModalStep('methods')}
                                            className="w-full flex items-center justify-between px-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
                                        >
                                            <span className={cn("text-[15px]", selectedPaymentType ? "text-white" : "text-white/25")}>
                                                {selectedPaymentType || "Payment methods"}
                                            </span>
                                            <ChevronDown size={16} className="text-white/30 shrink-0" />
                                        </button>
                                    </div>
                                </div>

                                {/* Pink Gradient Connect Button */}
                                <button
                                    onClick={closeModal}
                                    className="w-full py-4 rounded-full text-white text-[15px] font-bold tracking-tight active:scale-[0.98] transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #c0175d, #7b2cbf)' }}
                                >
                                    Connect
                                </button>
                            </div>
                        )}

                        {/* ── STEP 3: Country Picker ── */}
                        {modalStep === 'country' && (
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => setModalStep('detail')}
                                            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0 mt-0.5"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        <h2 className="text-2xl font-bold leading-tight">Bank country /<br />region</h2>
                                    </div>
                                    <button onClick={closeModal} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0">
                                        <X size={15} />
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[460px] -mx-2" style={{ scrollbarWidth: 'none' }}>
                                    {COUNTRIES.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => { setSelectedCountry(c); setModalStep('detail'); }}
                                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] rounded-2xl transition-colors"
                                        >
                                            <span className="text-[15px] font-medium">{c}</span>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                                selectedCountry === c ? "border-white bg-white" : "border-white/20"
                                            )}>
                                                {selectedCountry === c && <div className="w-2 h-2 rounded-full bg-black" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── STEP 4: Currency Picker ── */}
                        {modalStep === 'currency' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setModalStep('detail')}
                                            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        <h2 className="text-2xl font-bold">Account currency</h2>
                                    </div>
                                    <button onClick={closeModal} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0">
                                        <X size={15} />
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[460px] -mx-2" style={{ scrollbarWidth: 'none' }}>
                                    {CURRENCIES.map((cur) => (
                                        <button
                                            key={cur.code}
                                            onClick={() => { setSelectedCurrency(`${cur.code} - ${cur.name}`); setModalStep('detail'); }}
                                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] rounded-2xl transition-colors"
                                        >
                                            <span className="text-[15px] font-medium">{cur.code} - {cur.name}</span>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                                selectedCurrency.startsWith(cur.code) ? "border-white bg-white" : "border-white/20"
                                            )}>
                                                {selectedCurrency.startsWith(cur.code) && <div className="w-2 h-2 rounded-full bg-black" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

