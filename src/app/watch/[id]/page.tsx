"use client";

import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, Post, User } from "@/lib/firebase/collections";
import { WatchReel } from "@/components/feed/WatchReel";
import { Navbar } from "@/components/Navbar";
import { Loader2, ChevronLeft, Home } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WatchPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: post, isLoading, error } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            const docRef = doc(db, COLLECTIONS.POSTS, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error("Post not found");
            }

            const postData = docSnap.data() as Post;
            // Fetch creator info
            const creatorDoc = await getDoc(doc(db, COLLECTIONS.USERS, postData.creatorId));
            const creatorData = creatorDoc.exists() ? creatorDoc.data() as User : undefined;

            return {
                ...postData,
                id: docSnap.id,
                creator: creatorData
            };
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-[#0F0F14] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#FF2D55] animate-spin" />
                <span className="text-white/40 text-sm font-medium animate-pulse">Summoning content...</span>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="h-screen w-full bg-[#0F0F14] flex flex-col items-center justify-center gap-6 p-6 text-center">
                <div className="w-20 h-20 bg-[#FF2D55]/10 rounded-full flex items-center justify-center">
                    <ChevronLeft className="w-10 h-10 text-[#FF2D55]" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Reel Not Found</h2>
                    <p className="text-white/40 max-w-xs mx-auto">This content may have been removed or you followed a broken link.</p>
                </div>
                <Link href="/">
                    <Button className="bg-[#FF2D55] hover:bg-[#FF0040] text-white rounded-full px-8 py-6 font-bold uppercase tracking-widest">
                        Return Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="h-screen w-full bg-[#0F0F14] flex flex-col overflow-hidden">
            {/* Top Navigation Bar (Watch Specific) */}
            <div className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all active:scale-95">
                        <Home className="w-5 h-5" />
                    </Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#FF2D55] leading-none mb-1">Watching</span>
                    <span className="text-[11px] font-bold text-white/80 leading-none">Velo Reels</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center h-8 bg-white/5 px-3 rounded-full border border-white/10">
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-tighter">HD • High Fidelity</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                <WatchReel post={post} />
            </div>
        </main>
    );
}
