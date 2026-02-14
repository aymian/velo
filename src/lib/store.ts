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
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: AuthState['user']) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
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
