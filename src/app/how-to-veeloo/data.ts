export type VideoItem = {
    title: string;
    thumbnail: string;
    url: string;
};

export const VIDEOS: Record<string, VideoItem[]> = {
    Creator: [
        { title: "Getting Started", thumbnail: "https://res.cloudinary.com/dwm2smxdk/image/upload/v1771588113/Screenshot_2026-02-16_164134_rcea6b.png", url: "https://res.cloudinary.com/dwm2smxdk/video/upload/v1771587168/threadsdownloader.com_81ed84_oumthv.mp4" },
        { title: "Posting Content", thumbnail: "", url: "" },
        { title: "The Perfect Streaming Spot", thumbnail: "", url: "" },
        { title: "Lighting & Camera", thumbnail: "", url: "" },
        { title: "Going Live", thumbnail: "", url: "" },
        { title: "Engaging Your Audience", thumbnail: "", url: "" },
        { title: "Growing Your Following", thumbnail: "", url: "" },
        { title: "Creator Monetization", thumbnail: "", url: "" },
    ],
    Supporter: [
        { title: "How to Support Creators", thumbnail: "", url: "" },
        { title: "Sending Gifts", thumbnail: "", url: "" },
        { title: "Joining Live Streams", thumbnail: "", url: "" },
        { title: "Subscriptions Explained", thumbnail: "", url: "" },
        { title: "Finding Your Favorites", thumbnail: "", url: "" },
    ],
    Agency: [
        { title: "What is an Agency?", thumbnail: "", url: "" },
        { title: "Managing Creators", thumbnail: "", url: "" },
        { title: "Agency Dashboard", thumbnail: "", url: "" },
        { title: "Payouts & Revenue", thumbnail: "", url: "" },
    ],
    Reseller: [
        { title: "Reseller Program Overview", thumbnail: "", url: "" },
        { title: "Selling Coins", thumbnail: "", url: "" },
        { title: "Reseller Commissions", thumbnail: "", url: "" },
    ],
};

export const TABS = ["Creator", "Supporter", "Agency", "Reseller"] as const;
export type Tab = typeof TABS[number];

export const GRADIENTS = [
    "from-purple-600/80 via-pink-500/60 to-transparent",
    "from-pink-600/80 via-fuchsia-500/60 to-transparent",
    "from-indigo-600/80 via-purple-500/60 to-transparent",
    "from-blue-600/80 via-indigo-500/60 to-transparent",
    "from-violet-600/80 via-pink-500/60 to-transparent",
    "from-rose-600/80 via-pink-500/60 to-transparent",
    "from-fuchsia-600/80 via-purple-500/60 to-transparent",
    "from-sky-600/80 via-blue-500/60 to-transparent",
];

export const BG_COLORS = [
    "bg-gradient-to-br from-purple-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-pink-900 via-fuchsia-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-indigo-900 via-purple-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-blue-900 via-indigo-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-violet-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-rose-900 via-pink-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-fuchsia-900 via-purple-900 to-[#1a1a2e]",
    "bg-gradient-to-br from-sky-900 via-blue-900 to-[#1a1a2e]",
];
