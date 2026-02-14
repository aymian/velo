// Firebase Admin SDK Configuration
// This is used for server-side operations (API routes, server components)

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

// Admin SDK configuration
const adminConfig = {
    projectId: "mora-4b89d",
    // For production, use service account credentials from environment variables
    // credential: cert({
    //   projectId: process.env.FIREBASE_PROJECT_ID,
    //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    // }),
    databaseURL: "https://mora-4b89d-default-rtdb.firebaseio.com",
    storageBucket: "mora-4b89d.firebasestorage.app",
};

// Initialize Admin SDK (singleton pattern)
let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

function initializeAdminApp() {
    if (!getApps().length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const projectId = process.env.FIREBASE_PROJECT_ID || adminConfig.projectId;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (serviceAccountKey) {
            try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                adminApp = initializeApp({
                    credential: cert(serviceAccount),
                    ...adminConfig,
                });
            } catch (e) {
                console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e);
                adminApp = initializeApp(adminConfig);
            }
        } else if (clientEmail && privateKey) {
            // Initialize using individual fields
            adminApp = initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
                ...adminConfig,
            });
        } else {
            // Fallback to default credentials (ADC)
            // This usually fails in local dev unless GOOGLE_APPLICATION_CREDENTIALS is set
            console.warn("⚠️ Firebase Admin: No credentials provided. Firestore may fail.");
            adminApp = initializeApp(adminConfig);
        }
    } else {
        adminApp = getApps()[0];
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    adminStorage = getStorage(adminApp);

    return { adminApp, adminAuth, adminDb, adminStorage };
}

// Initialize on import
const { adminApp: app, adminAuth: auth, adminDb: db, adminStorage: storage } = initializeAdminApp();

export { app as adminApp, auth as adminAuth, db as adminDb, storage as adminStorage };
export default app;
