"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getFollowers } from "@/lib/firebase/helpers";
import { User } from "@/lib/firebase/collections"; // Assuming User interface is here
import Link from "next/link";

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function FollowersModal({ isOpen, onClose, userId }: FollowersModalProps) {
  const { data: followers, isLoading } = useQuery<User[]>({
    queryKey: ["followers", userId],
    queryFn: async () => {
      const data = await getFollowers(userId);
      return data.map((u: any) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        username: u.username,
        photoURL: u.photoURL,
        createdAt: u.createdAt || null,
        updatedAt: u.updatedAt || null,
      })) as User[];
    },
    enabled: isOpen && !!userId,
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#0a0a0a] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          "max-h-[90vh] flex flex-col"
        )}>
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-white">Followers</Dialog.Title>
          <Dialog.Description className="text-sm text-white/60 mb-4">
            People who follow {userId}.
          </Dialog.Description>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {isLoading && <p className="text-white/40">Loading followers...</p>}
            {!isLoading && (!followers || (Array.isArray(followers) && followers.length === 0)) && (
              <p className="text-white/40">No followers found.</p>
            )}
            {Array.isArray(followers) && followers.map((follower: User) => (
              <Link href={`/profile/${follower.username || follower.uid}`} key={follower.uid} onClick={onClose}>
                <div className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-md px-2 -mx-2 transition-colors">
                  <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarImage src={follower.photoURL || undefined} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {follower.displayName?.charAt(0) || follower.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{follower.displayName || follower.username}</p>
                    <p className="text-xs text-white/60">@{follower.username || 'user'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
