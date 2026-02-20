"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Post } from "@/lib/firebase/collections";
import { useAddComment } from "@/lib/firebase/hooks";
import { useAuthStore } from "@/lib/store";
import { Image, ShieldAlert, Smile, List, Layout, MapPin, X } from "lucide-react";
import { VerifiedBadge } from "../ui/VerifiedBadge";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post & { creator?: User };
}

export function CommentModal({ isOpen, onClose, post }: CommentModalProps) {
    const { user: currentUser } = useAuthStore();
    const [comment, setComment] = useState("");
    const addCommentMutation = useAddComment();

    const handleSubmit = async () => {
        if (!currentUser || !comment.trim()) return;

        try {
            await addCommentMutation.mutateAsync({
                userId: currentUser.uid,
                postId: post.id,
                content: comment,
            });
            setComment("");
            onClose();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-black border-zinc-800 p-0 overflow-hidden rounded-3xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                    {/* Header */}
                    <DialogHeader className="p-0">
                        <DialogTitle className="sr-only">Reply to post</DialogTitle>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <button onClick={onClose} className="text-white text-sm font-medium hover:opacity-70 transition-opacity">
                                Cancel
                            </button>
                            <span className="text-white font-bold" aria-hidden="true">Reply</span>
                            <div className="w-10" /> {/* Spacer */}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {/* Original Post Preview */}
                        <div className="flex gap-3 mb-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-[40px] bottom-[-20px] w-[2px] bg-zinc-800" />

                            <Avatar className="w-8 h-8 z-10 ring-2 ring-black">
                                <AvatarImage src={post.creator?.photoURL || ""} />
                                <AvatarFallback className="bg-zinc-800 text-[10px]">
                                    {post.creator?.username?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-[14px] text-white">
                                        {post.creator?.username || "user"}
                                    </span>
                                    <VerifiedBadge
                                        showOnCondition={!!(post.creator?.verified || (post.creator?.followers && post.creator.followers >= 1))}
                                        size={14}
                                    />
                                </div>
                                <p className="text-[14px] text-white/90 mt-1 whitespace-pre-wrap">
                                    {post.caption}
                                </p>
                            </div>
                        </div>

                        {/* Reply Input Area */}
                        <div className="flex gap-3 mt-4">
                            <Avatar className="w-8 h-8 z-10 ring-2 ring-black">
                                <AvatarImage src={currentUser?.photoURL || ""} />
                                <AvatarFallback className="bg-zinc-800 text-[10px]">
                                    {currentUser?.displayName?.slice(0, 2).toUpperCase() || "ME"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1">
                                <span className="font-bold text-[14px] text-white">
                                    {currentUser?.displayName?.toLowerCase().replace(/\s/g, ".") || "me"}
                                    <span className="text-white/30 font-medium ml-2">Add a topic</span>
                                </span>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={`Reply to ${post.creator?.username || "user"}...`}
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 text-[14px] resize-none mt-1 min-h-[100px]"
                                    autoFocus
                                />

                                {/* Tools Icons */}
                                <div className="flex items-center gap-4 text-white/30 mt-2">
                                    <button className="hover:text-white/60 transition-colors"><Image className="w-5 h-5" /></button>
                                    <button className="hover:text-white/60 transition-colors"><Smile className="w-5 h-5" /></button>
                                    <button className="hover:text-white/60 transition-colors"><List className="w-5 h-5" /></button>
                                    <button className="hover:text-white/60 transition-colors"><Layout className="w-5 h-5" /></button>
                                    <button className="hover:text-white/60 transition-colors"><MapPin className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/30 text-[12px] font-medium">
                            <ShieldAlert className="w-4 h-4" />
                            Reply options
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={!comment.trim() || addCommentMutation.isPending}
                            className="bg-gradient-to-r from-[#ff4081] to-[#7c4dff] hover:opacity-90 text-white border-none font-bold rounded-full px-6 py-2 h-auto text-[14px] shadow-lg shadow-pink-500/20"
                        >
                            {addCommentMutation.isPending ? "Posting..." : "Post"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
