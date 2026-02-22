/**
 * Feature Gating and Plan Configuration
 * Defines what each plan level can access and their limits.
 */

export type PlanType = 'free' | 'basic' | 'pro' | 'elite';
export type UserRole = 'member' | 'creator';

export interface PlanFeatures {
    maxMessagesPerDay: number;
    canSendFiles: boolean;
    canSendImages: boolean;
    canUnlockExclusive: boolean;
    priorityInbox: boolean;
    hdStreaming: boolean;
    downloadContent: boolean;
    canTipCreators: boolean;
    platformFee: number; // 0.20 for 20%
    canMonetize: boolean;
    verifiedBadge: boolean;
    discoveryBoost: 'none' | 'small' | 'large' | 'maximum';
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
    free: {
        maxMessagesPerDay: 3,
        canSendFiles: false,
        canSendImages: false,
        canUnlockExclusive: false,
        priorityInbox: false,
        hdStreaming: false,
        downloadContent: false,
        canTipCreators: false,
        platformFee: 0.20,
        canMonetize: false,
        verifiedBadge: false,
        discoveryBoost: 'none',
    },
    basic: {
        maxMessagesPerDay: 20,
        canSendFiles: false,
        canSendImages: false,
        canUnlockExclusive: false,
        priorityInbox: false,
        hdStreaming: true,
        downloadContent: false,
        canTipCreators: true,
        platformFee: 0.15,
        canMonetize: false,
        verifiedBadge: false,
        discoveryBoost: 'small',
    },
    pro: {
        maxMessagesPerDay: Infinity,
        canSendFiles: true,
        canSendImages: true,
        canUnlockExclusive: true,
        priorityInbox: false,
        hdStreaming: true,
        downloadContent: true,
        canTipCreators: true,
        platformFee: 0.10,
        canMonetize: true,
        verifiedBadge: true,
        discoveryBoost: 'large',
    },
    elite: {
        maxMessagesPerDay: Infinity,
        canSendFiles: true,
        canSendImages: true,
        canUnlockExclusive: true,
        priorityInbox: true,
        hdStreaming: true,
        downloadContent: true,
        canTipCreators: true,
        platformFee: 0.05,
        canMonetize: true,
        verifiedBadge: true,
        discoveryBoost: 'maximum',
    },
};

/**
 * Helper to check if a user has access to a boolean feature
 */
export function hasFeature(user: { plan?: PlanType } | null | undefined, feature: keyof PlanFeatures): boolean {
    if (!user || !user.plan) return false;
    const value = PLAN_FEATURES[user.plan][feature];
    return value === true;
}

/**
 * Helper to get a plan numeric value (like platform fee or message count)
 */
export function getPlanValue<K extends keyof PlanFeatures>(user: { plan?: PlanType } | null | undefined, feature: K): PlanFeatures[K] | null {
    if (!user || !user.plan) return null;
    return PLAN_FEATURES[user.plan][feature];
}
