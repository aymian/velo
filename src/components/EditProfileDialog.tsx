"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, ChevronRight } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";

interface EditProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function EditProfileDialog({ isOpen, onClose, user }: EditProfileDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [displayName, setDisplayName] = useState(user?.displayName || "Funny Badger");
    const [username, setUsername] = useState("ishimweyvesian");
    const [bio, setBio] = useState("Digital artist & Designer.");
    const [tempPhotoURL, setTempPhotoURL] = useState<string | null>(null);

    const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTempPhotoURL(url);
        }
    }, []);

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <Dialog.Portal>
                <Dialog.Content
                    asChild
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 w-full max-w-sm md:w-[380px] h-[75vh] md:h-[660px] bg-black border border-white/10 rounded-[2rem] shadow-[0_32px_128px_rgba(0,0,0,1)] z-[101] outline-none overflow-hidden flex flex-col focus:ring-0"
                    >
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />

                        {/* Header */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-black">
                            <button onClick={onClose} className="text-[14px] font-medium text-white/40 hover:text-white transition-colors">Cancel</button>
                            <Dialog.Title className="text-[15px] font-bold">Edit profile</Dialog.Title>
                            <button
                                onClick={onClose}
                                className="text-[14px] font-bold text-[#FF3B5C]"
                            >
                                Done
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">

                            {/* Profile Image Trigger */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]">
                                        <img src={tempPhotoURL || user?.photoURL || "https://ui-avatars.com/api/?name=User&background=333&color=fff"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <button
                                    className="text-[13px] font-bold text-[#0095F6] hover:opacity-80"
                                    onClick={triggerFileInput}
                                >
                                    Change profile photo
                                </button>
                            </div>

                            {/* Form Rows (Threads Style) */}
                            <div className="space-y-8">
                                <div className="space-y-1.5">
                                    <Label.Root className="text-[13px] font-medium text-white/30">Name</Label.Root>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label.Root className="text-[13px] font-medium text-white/30">Username</Label.Root>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label.Root className="text-[13px] font-medium text-white/30">Bio</Label.Root>
                                        <span className="text-[10px] font-medium text-white/20 tracking-widest">{bio.length}/200</span>
                                    </div>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={2}
                                        maxLength={200}
                                        className="w-full bg-transparent border-b border-white/10 pb-2 text-[15px] text-white outline-none focus:border-white/30 transition-colors font-medium resize-none"
                                    />
                                </div>
                            </div>

                            {/* Meta Center Style Account Info */}
                            <div className="pt-2 space-y-6">
                                <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Account info</h3>

                                <div className="space-y-5">
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">Email</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] font-medium text-white/60">{user?.email || "bright@gmail.com"}</span>
                                                <CheckCircle className="w-3.5 h-3.5 text-[#FF3B5C]" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                                    </div>

                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">Phone</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] font-medium text-white/60">+250 788 000 000</span>
                                                <CheckCircle className="w-3.5 h-3.5 text-[#FF3B5C]" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[13px] font-medium text-white/30">Joined</span>
                                        <span className="text-[13px] font-bold text-white/60">February 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HIGH-FIDELITY GRADIENT BUTTON (EXACT MATCH TO SCREENSHOT) */}
                        <div className="p-7 bg-black border-t border-white/5">
                            <button className="w-full h-12 bg-gradient-to-r from-[#ff3b5c] via-[#f127a3] to-[#f127a3] text-white rounded-full font-bold text-[15px] shadow-[0_8px_32px_rgba(255,59,92,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center tracking-tight">
                                Save changes
                            </button>
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
