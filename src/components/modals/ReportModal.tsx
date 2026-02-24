"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetName: string;
    targetId: string;
}

const REPORT_OPTIONS = [
    { id: "sexual", label: "Sexual content" },
    { id: "violent", label: "Violent Content" },
    { id: "abusive", label: "Abusive content" },
    { id: "stream_abuse", label: "Report stream for child abuse" },
    { id: "profile_abuse", label: "Report profile for child abuse" },
    { id: "spam", label: "Spam" },
    { id: "other", label: "Other" },
];

export function ReportModal({ isOpen, onClose, targetName, targetId }: ReportModalProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedOption) return;
        setIsSubmitting(true);

        // Mock submission delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Report submitted:", { targetId, targetName, reason: selectedOption });
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-[90%] max-w-[400px] translate-x-[-50%] translate-y-[-50%] bg-[#0D0D0D] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                    <div className="flex flex-col items-center text-center">
                        <Dialog.Title className="text-xl font-bold text-white mb-1">
                            Report on
                        </Dialog.Title>
                        <Dialog.Description className="text-xl font-bold text-white mb-8">
                            {targetName}
                        </Dialog.Description>

                        <div className="w-full space-y-4 mb-10">
                            {REPORT_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedOption(option.id)}
                                    className="flex items-center gap-4 w-full group transition-all"
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedOption === option.id
                                            ? "border-[#ff3b5c] bg-[#ff3b5c]/10"
                                            : "border-white/20 group-hover:border-white/40"
                                    )}>
                                        {selectedOption === option.id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b5c]" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[15px] font-medium transition-colors",
                                        selectedOption === option.id ? "text-white" : "text-white/40 group-hover:text-white"
                                    )}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="w-full space-y-3">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedOption || isSubmitting}
                                className={cn(
                                    "w-full py-4 rounded-full font-bold text-[15px] transition-all active:scale-95 shadow-lg shadow-[#ff3b5c]/10",
                                    selectedOption
                                        ? "bg-gradient-to-r from-[#ff3b5c] to-[#a855f7] text-white"
                                        : "bg-white/5 text-white/20 cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? "Submitting..." : "Submit report"}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-full font-bold text-[15px] text-white/60 hover:text-white transition-colors border border-white/5"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
