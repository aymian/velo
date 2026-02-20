import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
    isAdminAuthenticated: boolean;
    adminRole: 'super_admin' | 'admin' | 'moderator' | null;
    adminUsername: string | null;
    login: (username: string, role: AdminState['adminRole']) => void;
    logout: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isAdminAuthenticated: false,
            adminRole: null,
            adminUsername: null,
            login: (username, role) => set({
                isAdminAuthenticated: true,
                adminUsername: username,
                adminRole: role
            }),
            logout: () => set({
                isAdminAuthenticated: false,
                adminUsername: null,
                adminRole: null
            }),
        }),
        {
            name: 'velo-admin-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
