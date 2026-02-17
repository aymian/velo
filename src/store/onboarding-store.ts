import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type IdentityType = 'Casual Viewer' | 'Supporter' | 'VIP Member' | 'Top Gifter' | null;

interface OnboardingState {
  step: number;
  identityType: IdentityType;
  interests: string[];
  is18Verified: boolean;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  phoneNumber: string;
  username: string;
  birthDate: string | null;
  gender: string;
  bio: string;
  profilePic: string;
  coins: number;
  privacySettings: {
    hideActivity: boolean;
    privateMode: boolean;
    notifications: boolean;
  };

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setIdentity: (identity: IdentityType) => void;
  toggleInterest: (interest: string) => void;
  setAgeVerified: (verified: boolean) => void;
  setEmailVerified: (verified: boolean) => void;
  setProfileData: (data: Partial<Pick<OnboardingState, 'phoneNumber' | 'username' | 'birthDate' | 'gender' | 'bio' | 'profilePic'>>) => void;
  updatePrivacy: (setting: 'hideActivity' | 'privateMode' | 'notifications', value: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      identityType: null,
      interests: [],
      is18Verified: false,
      emailVerified: false,
      onboardingCompleted: false,
      phoneNumber: '',
      username: '',
      birthDate: null,
      gender: '',
      bio: '',
      profilePic: '',
      coins: 500,
      privacySettings: {
        hideActivity: false,
        privateMode: false,
        notifications: true,
      },

      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
      setStep: (step: number) => set({ step }),

      setIdentity: (identity) => set({ identityType: identity }),

      setProfileData: (data) => set((state) => ({ ...state, ...data })),

      toggleInterest: (interest) => set((state) => {
        const exists = state.interests.includes(interest);
        if (exists) {
          return { interests: state.interests.filter((i) => i !== interest) };
        }
        if (state.interests.length >= 3) return state; // Max 3
        return { interests: [...state.interests, interest] };
      }),

      setAgeVerified: (verified) => set({ is18Verified: verified }),

      setEmailVerified: (verified) => set({ emailVerified: verified }),

      updatePrivacy: (setting, value) => set((state) => ({
        privacySettings: {
          ...state.privacySettings,
          [setting]: value,
        },
      })),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      reset: () => set({
        step: 1,
        identityType: null,
        interests: [],
        is18Verified: false,
        emailVerified: false,
        onboardingCompleted: false,
        phoneNumber: '',
        username: '',
        birthDate: null,
        gender: '',
        bio: '',
        profilePic: '',
        coins: 500,
        privacySettings: {
          hideActivity: false,
          privateMode: false,
          notifications: true,
        },
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
