"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Ban,
    Trash2,
    ShieldAlert,
    UserCheck,
    Mail,
    ChevronDown,
    ArrowUpDown,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { collection, query, limit, getDocs } from "firebase/firestore";

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(db, COLLECTIONS.USERS), limit(50));
                const querySnapshot = await getDocs(q);
                const fetchedUsers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.username || user.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.uid || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">USER ARCHIVE</h1>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">{users.length} Recorded Entities</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 border-white/5 bg-white/5 text-white/60 hover:text-white rounded-xl gap-2 px-6">
                        <Filter className="w-4 h-4" /> Filters
                    </Button>
                    <Button className="h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 px-6">
                        Export Directory
                    </Button>
                </div>
            </div>

            {/* User Controls & Table Container */}
            <div className="bg-[#16161D] border border-white/5 rounded-[32px] overflow-hidden">
                {/* Table Header / Action Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                            placeholder="Search by username, email or UID..."
                            className="bg-[#0D0D12] border-white/5 h-11 pl-12 rounded-xl text-sm placeholder:text-white/10 focus:border-blue-500/30 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-white/20 uppercase tracking-widest hidden lg:block">Displaying {filteredUsers.length} Results</span>
                        <div className="h-4 w-px bg-white/5 hidden lg:block mx-2" />
                        <div className="flex gap-1">
                            {['All', 'Creators', 'Admins', 'Banned'].map(t => (
                                <button key={t} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">{t}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest text-white/20">Querying Database...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">Access Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">System Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">KYC Verify</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs overflow-hidden">
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.username || user.displayName || "?").charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-white">@{user.username || user.displayName || "Anonymous"}</p>
                                                    <p className="text-[11px] text-white/30">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                user.role === 'super_admin' ? "text-purple-400" :
                                                    user.role === 'creator' ? "text-blue-400" :
                                                        "text-white/40"
                                            )}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    (user.status === 'active' || !user.status) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"
                                                )} />
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    (user.status === 'active' || !user.status) ? "text-emerald-500" : "text-red-500"
                                                )}>
                                                    {user.status || 'active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {(user.verificationStatus === 'verified' || user.verified) ? (
                                                <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px] font-black tracking-widest">
                                                    <UserCheck className="w-3 h-3 mr-1" /> VERIFIED
                                                </Badge>
                                            ) : user.verificationStatus === 'pending' ? (
                                                <Badge className="bg-yellow-500/10 text-yellow-500 border-none text-[9px] font-black tracking-widest">
                                                    PENDING
                                                </Badge>
                                            ) : (
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Unverified</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-10 group-hover:opacity-100 transition-all">
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white" title="Send Message">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-orange-500/10 rounded-lg text-white/40 hover:text-orange-500" title="Suspension Warning">
                                                    <ShieldAlert className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500" title="Ban Account">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Placeholder */}
                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <p className="text-[11px] font-bold text-white/20">Showing 1 to {filteredUsers.length} of {users.length} entries</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/5 hover:border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">Next Page</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
