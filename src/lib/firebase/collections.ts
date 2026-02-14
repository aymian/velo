// Firebase Collections and Types
// Centralized place for Firestore collection names and TypeScript types

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    POSTS: 'posts',
    COMMENTS: 'comments',
    LIKES: 'likes',
    FOLLOWS: 'follows',
    NOTIFICATIONS: 'notifications',
    MESSAGES: 'messages',
    LIVESTREAMS: 'livestreams',
    REPORTS: 'reports',
} as const;

// User type
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    bio?: string;
    username?: string;
    followers?: number;
    following?: number;
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
    userId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likes: number;
    comments: number;
    shares: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

// Comment type
export interface Comment {
    id: string;
    postId: string;
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
    targetId: string; // Post or Comment ID
    targetType: 'post' | 'comment';
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
