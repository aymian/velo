"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Post } from "@/lib/firebase/collections";
import { useAddComment, useComments } from "@/lib/firebase/hooks";
import { useAuthStore, useNotificationStore } from "@/lib/store";
import { Image, ShieldAlert, Smile, List, Layout, MapPin, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import { VerifiedBadge } from "../ui/VerifiedBadge";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post & { creator?: User };
    onCommentAdded?: () => void;
}

export function CommentModal({ isOpen, onClose, post, onCommentAdded }: CommentModalProps) {
    const { user: currentUser } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const [comment, setComment] = useState("");
    const addCommentMutation = useAddComment();
    const { data: comments, isLoading: isLoadingComments } = useComments(post.id);

    const handleSubmit = async () => {
        if (!currentUser) {
            addNotification({
                type: "error",
                message: "You need to sign in to reply.",
            });
            return;
        }

        if (!comment.trim()) return;

        try {
            await addCommentMutation.mutateAsync({
                userId: currentUser.uid,
                postId: post.id,
                content: comment,
            });
            setComment("");
            onClose();
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            addNotification({
                type: "error",
                message: (error as any)?.message || "Failed to post comment. Please try again.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-black border-zinc-800 p-0 overflow-hidden rounded-3xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                    {/* Header */}
                    <DialogHeader className="p-0">
                        <DialogTitle className="sr-only">Reply to post</DialogTitle>
                        <DialogDescription className="sr-only">
                            Add a reply to this post.
                        </DialogDescription>
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
                                        showOnCondition={!!(post.creator?.verified || (post.creator?.plan && post.creator.plan !== "free"))}
                                        size={14}
                                    />
                                    <span className="text-white/30 text-[12px] ml-1">· {dayjs(post.createdAt?.toDate?.() || post.createdAt).fromNow(true)}</span>
                                </div>
                                <p className="text-[14px] text-white/90 mt-1 whitespace-pre-wrap">
                                    {post.caption}
                                </p>
                            </div>
                        </div>

                        {/* Comments List */}
                        {isLoadingComments ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                            </div>
                        ) : comments && comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6">
                                {comments.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-3 relative animate-in fade-in duration-300">
                                        <div className="absolute left-[15px] -top-6 bottom-0 w-[2px] bg-zinc-800 -z-10" />
                                        <Avatar className="w-8 h-8 z-10 ring-2 ring-black">
                                            <AvatarImage src={comment.user?.photoURL || ""} />
                                            <AvatarFallback className="bg-zinc-800 text-[10px]">
                                                {comment.user?.username?.slice(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-[14px] text-white">
                                                    {comment.user?.username || "user"}
                                                </span>
                                                <span className="text-white/30 text-[12px] ml-1">
                                                    · {dayjs(comment.createdAt?.toDate?.() || comment.createdAt).fromNow(true)}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-white/90 mt-0.5 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-white/30 text-sm">No comments yet. Be the first!</div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 ring-2 ring-black">
                                <AvatarImage src={currentUser?.photoURL || ""} />
                                <AvatarFallback className="bg-zinc-800 text-[10px]">
                                    {currentUser?.username?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Post your reply"
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/50 resize-none h-auto min-h-[40px]"
                                rows={1}
                            />
                        </div>
                        <div className="flex items-center justify-between">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
