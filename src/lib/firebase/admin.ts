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
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
        const projectId = process.env.FIREBASE_PROJECT_ID || adminConfig.projectId;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        try {
            if (serviceAccountKey) {
                const serviceAccount = JSON.parse(serviceAccountKey);
                adminApp = initializeApp({
                    credential: cert(serviceAccount),
                    ...adminConfig,
                });
            } else if (clientEmail && privateKey) {
                adminApp = initializeApp({
                    credential: cert({
                        projectId,
                        clientEmail,
                        privateKey: privateKey.replace(/\\n/g, '\n'),
                    }),
                    ...adminConfig,
                });
            } else {
                // If we're here, we have no credentials.
                // Instead of calling initializeApp and crashing with "Could not load default credentials",
                // we will throw a descriptive error that our API routes can catch.
                console.error("❌ Firebase Admin Error: Missing credentials in .env");
                console.error("Please set FIREBASE_SERVICE_ACCOUNT_KEY or (FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY)");

                // We'll initialize with just the project ID for now to prevent immediate crashes in the singleton,
                // but the DB operations will fail with a clear message.
                adminApp = initializeApp(adminConfig);
            }
        } catch (e: any) {
            console.error("❌ Firebase Admin Initialization Failed:", e.message);
            // Fallback to basic init to prevent total app failure, but it will still fail on DB calls
            try { adminApp = initializeApp(adminConfig); } catch { adminApp = getApps()[0]; }
        }
    } else {
        adminApp = getApps()[0];
    }

    try {
        adminAuth = getAuth(adminApp);
        adminDb = getFirestore(adminApp);
        adminStorage = getStorage(adminApp);
    } catch (e) {
        console.error("❌ Failed to get Firebase services:", e);
    }

    return { adminApp, adminAuth, adminDb, adminStorage };
}

// Initialize on import
const { adminApp: app, adminAuth: auth, adminDb: db, adminStorage: storage } = initializeAdminApp();

export { app as adminApp, auth as adminAuth, db as adminDb, storage as adminStorage };
export default app;
