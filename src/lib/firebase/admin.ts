import admin from 'firebase-admin';

/**
 * Lazy-initializes Firebase Admin SDK to prevent build-time failures
 * occurring when environment variables are unavailable during static analysis.
 */
function getAdminApp() {
    if (!admin.apps.length) {
        try {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const projectId = process.env.FIREBASE_PROJECT_ID;

            if (!privateKey || !clientEmail || !projectId) {
                console.warn('⚠️ Missing Firebase Admin credentials. SDK will not be initialized.');
                return null;
            }

            return admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        } catch (error) {
            console.error('❌ Firebase Admin init error:', error);
            return null;
        }
    }
    return admin.apps[0];
}

export const getAdminDb = () => {
    const app = getAdminApp();
    return app ? admin.firestore() : null;
};

export const getAdminAuth = () => {
    const app = getAdminApp();
    return app ? admin.auth() : null;
};
