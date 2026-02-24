"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        {/* Overlay */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>

                        {/* Content */}
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="fixed z-50 left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#111] p-8 shadow-2xl border border-white/10"
                            >
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <Dialog.Title className="text-2xl font-bold text-white">
                                        Logout
                                    </Dialog.Title>

                                    <Dialog.Description className="text-white/80 text-lg">
                                        Are you sure you want to log out? Make sure to end user session to be real logged out.
                                    </Dialog.Description>

                                    <div className="flex flex-col w-full gap-3 pt-2">
                                        {/* Confirm */}
                                        <button
                                            onClick={onConfirm}
                                            className="w-full h-12 rounded-xl text-white font-semibold 
                      bg-gradient-to-r from-[#7000FF] to-[#FF2D55]
                      hover:opacity-90 transition-all active:scale-[0.98]
                      shadow-lg shadow-pink-500/20"
                                        >
                                            Yes, Logout
                                        </button>

                                        {/* Cancel */}
                                        <Dialog.Close asChild>
                                            <button
                                                className="w-full h-12 rounded-xl font-semibold 
                        border border-white/10 text-white
                        hover:bg-white/5 transition-all active:scale-[0.98]"
                                            >
                                                Cancel
                                            </button>
                                        </Dialog.Close>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}