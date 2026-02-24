// Zustand Store for Global State Management
// Combines with React Query for optimal state management

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Auth state
interface AuthState {
    user: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
        username?: string;
        agencyCode?: string;
        bio?: string;
        phone?: string;
        role?: 'member' | 'creator' | 'admin';
        plan?: 'free' | 'basic' | 'pro' | 'elite';
        subscriptionStatus?: 'active' | 'canceled' | 'expired' | 'trialing';
        verified?: boolean;
        earned?: number;
        followers?: number;
        following?: number;
        energy?: number;
        interests?: string[];
        agreedToTerms?: boolean;
        onboardingCompleted?: boolean;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: AuthState['user']) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    signUp: (email: string) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
            clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
            setLoading: (loading) => set({ isLoading: loading }),
            signUp: async (email: string) => {
                try {
                    const { sendSignInLinkToEmail } = await import('firebase/auth');
                    const { auth } = await import('@/lib/firebase/config');
                    const actionCodeSettings = {
                        url: typeof window !== 'undefined' ? `${window.location.origin}/verify` : 'http://localhost:3000/verify',
                        handleCodeInApp: true,
                    };
                    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem('emailForSignIn', email);
                    }
                    return { error: null };
                } catch (error) {
                    return { error };
                }
            }
        }),
        {
            name: 'velo-auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// UI state
interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            theme: 'dark',
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'velo-ui-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Player state (for video/livestream)
interface PlayerState {
    currentVideoId: string | null;
    isPlaying: boolean;
    volume: number;
    muted: boolean;
    setCurrentVideo: (videoId: string | null) => void;
    setPlaying: (playing: boolean) => void;
    setVolume: (volume: number) => void;
    setMuted: (muted: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            currentVideoId: null,
            isPlaying: false,
            volume: 0.8,
            muted: false,
            setCurrentVideo: (videoId) => set({ currentVideoId: videoId }),
            setPlaying: (playing) => set({ isPlaying: playing }),
            setVolume: (volume) => set({ volume }),
            setMuted: (muted) => set({ muted }),
        }),
        {
            name: 'velo-player-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Notification state
interface NotificationState {
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
        timestamp: number;
    }>;
    addNotification: (notification: Omit<NotificationState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                {
                    ...notification,
                    id: Math.random().toString(36).substring(7),
                    timestamp: Date.now(),
                },
            ],
        })),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    clearNotifications: () => set({ notifications: [] }),
}));

// Create Post state (for /create page)
interface CreatePostState {
    videoFile: File | null;
    videoPreview: string | null;
    caption: string;
    visibility: 'public' | 'subscribers' | 'locked';
    price: number;
    previewDuration: number;
    blurEnabled: boolean;
    tags: string[];
    isUploading: boolean;
    uploadProgress: number;
    allowTipping: boolean;
    acceptRequests: boolean;

    setVideoFile: (file: File | null, preview: string | null) => void;
    setCaption: (caption: string) => void;
    setVisibility: (visibility: CreatePostState['visibility']) => void;
    setPrice: (price: number) => void;
    setPreviewDuration: (duration: number) => void;
    setBlurEnabled: (enabled: boolean) => void;
    setTags: (tags: string[]) => void;
    setUploading: (uploading: boolean) => void;
    setUploadProgress: (progress: number) => void;
    setAllowTipping: (allow: boolean) => void;
    setAcceptRequests: (accept: boolean) => void;
    reset: () => void;
}

export const useCreateStore = create<CreatePostState>((set) => ({
    videoFile: null,
    videoPreview: null,
    caption: '',
    visibility: 'public',
    price: 10,
    previewDuration: 5,
    blurEnabled: false,
    tags: [],
    isUploading: false,
    uploadProgress: 0,
    allowTipping: true,
    acceptRequests: false,

    setVideoFile: (file, preview) => set({ videoFile: file, videoPreview: preview }),
    setCaption: (caption) => set({ caption: caption ?? '' }),
    setVisibility: (visibility) => set({ visibility }),
    setPrice: (price) => set({ price }),
    setPreviewDuration: (duration) => set({ previewDuration: duration }),
    setBlurEnabled: (enabled) => set({ blurEnabled: enabled }),
    setTags: (tags) => set({ tags }),
    setUploading: (uploading) => set({ isUploading: uploading }),
    setUploadProgress: (progress) => set({ uploadProgress: progress }),
    setAllowTipping: (allow) => set({ allowTipping: allow }),
    setAcceptRequests: (accept) => set({ acceptRequests: accept }),
    reset: () => set({
        videoFile: null,
        videoPreview: null,
        caption: '',
        visibility: 'public',
        price: 10,
        previewDuration: 5,
        blurEnabled: false,
        tags: [],
        isUploading: false,
        uploadProgress: 0,
        allowTipping: true,
        acceptRequests: false,
    }),
}));

// Call state (WebRTC)
export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

interface CallState {
    status: CallStatus;
    mode: "video" | "audio" | null;
    channelId: string | null;   // Firestore signaling doc id (conversationId)
    callerId: string | null;    // uid of the person who initiated
    peerId: string | null;      // uid of the other person
    setCall: (params: { mode: "video" | "audio"; channelId: string; callerId: string; peerId: string }) => void;
    setStatus: (status: CallStatus) => void;
    endCall: () => void;
}

export const useCallStore = create<CallState>()((set) => ({
    status: "idle",
    mode: null,
    channelId: null,
    callerId: null,
    peerId: null,
    setCall: ({ mode, channelId, callerId, peerId }) =>
        set({ mode, channelId, callerId, peerId, status: "calling" }),
    setStatus: (status) => set({ status }),
    endCall: () => set({ status: "idle", mode: null, channelId: null, callerId: null, peerId: null }),
}));

// Search state
interface SearchState {
    recentSearches: string[];
    addSearch: (query: string) => void;
    removeSearch: (query: string) => void;
    clearRecent: () => void;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            recentSearches: [],
            isOpen: false,
            addSearch: (query) => set((state) => ({
                recentSearches: [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 10)
            })),
            removeSearch: (query) => set((state) => ({
                recentSearches: state.recentSearches.filter(q => q !== query)
            })),
            clearRecent: () => set({ recentSearches: [] }),
            setOpen: (open) => set({ isOpen: open }),
        }),
        {
            name: 'velo-search-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

