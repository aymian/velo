// Firebase Collections and Types
// Centralized place for Firestore collection names and TypeScript types

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    POSTS: 'posts',
    FOLLOWS: 'follows',
    NOTIFICATIONS: 'notifications',
    MESSAGES: 'messages',
    LIVESTREAMS: 'livestreams',
    REPORTS: 'reports',
    STORIES: 'stories',
} as const;

// User type
// Story type
export interface StorySticker {
    id: string;
    type: string;
    content: string;
    x: number;
    y: number;
    scale?: number;
    rotation?: number;
}

export interface Story {
    id: string;
    userId: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption?: string;
    textOverlay?: {
        text: string;
        color: string;
        fontSize: number;
        fontFamily: string;
        textAlign: string;
        hasBg: boolean;
        x: number;
        y: number;
    };
    stickers?: StorySticker[];
    timer?: number;
    tags?: string[];
    visibility: 'public' | 'fans' | 'premium';
    price?: number;
    createdAt: any;
    expiresAt: any;
}

export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    bio?: string;
    username?: string;
    followers?: number;
    following?: number;
    earned?: number;
    verified?: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Social auth providers
    providers?: ('google' | 'twitter' | 'apple' | 'phone' | 'email' | 'passkey')[];
    passkeyId?: string;
    pin?: string;
}

// Post type
export interface Post {
    id: string;
    creatorId: string;
    caption: string;
    postType?: 'video' | 'image' | 'audio';
    cloudinaryPublicId?: string;
    videoUrl?: string; // secure_url from Cloudinary (video posts)
    imageUrl?: string; // secure_url from Cloudinary (image posts)
    status: 'processing' | 'ready' | 'error';
    visibility: 'public' | 'subscribers' | 'locked';
    price?: number;
    previewDuration?: number;
    blurEnabled?: boolean;
    tags?: string[];
    allowTipping?: boolean;
    acceptRequests?: boolean;
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    createdAt: any;
    updatedAt: any;
}

// Comment type
export interface Comment {
    id: string;
    userId: string;
    content: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

// Like type
export interface Like {
    id: string;
    userId: string;
    createdAt: Date;
}

// Follow type
export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
}

// Notification type
export interface Notification {
    id: string;
    userId: string;
    type: 'like' | 'comment' | 'follow' | 'mention';
    fromUserId: string;
    targetId?: string;
    read: boolean;
    createdAt: Date;
}

// Livestream type
export interface Livestream {
    id: string;
    userId: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    streamUrl: string;
    viewers: number;
    isLive: boolean;
    startedAt?: Date;
    endedAt?: Date;
    createdAt: Date;
}
