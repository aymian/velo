import Mux from '@mux/mux-node';

let muxServer: Mux | null = null;

/**
 * Lazy-initializes Mux to prevent build-time failures
 * occurring when environment variables are unavailable during static analysis.
 */
export const getMuxServer = () => {
    if (muxServer) return muxServer;

    const tokenId = process.env.MUX_TOKEN_ID;
    const tokenSecret = process.env.MUX_TOKEN_SECRET;

    if (!tokenId || !tokenSecret) {
        console.warn('⚠️ Missing Mux credentials. Mux will not be initialized.');
        throw new Error("Missing Mux environment variables");
    }

    muxServer = new Mux({
        tokenId,
        tokenSecret,
    });

    return muxServer;
};
