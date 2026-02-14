// Firebase Client Configuration
// This is used for client-side Firebase operations (Auth, Firestore, Storage, etc.)

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpZ5YXe-_PKvSPsdoU5ffjRal8fnV6_VA",
    authDomain: "mora-4b89d.firebaseapp.com",
    databaseURL: "https://mora-4b89d-default-rtdb.firebaseio.com",
    projectId: "mora-4b89d",
    storageBucket: "mora-4b89d.firebasestorage.app",
    messagingSenderId: "758534233604",
    appId: "1:758534233604:web:b66a44293cdfc844525f51",
    measurementId: "G-8YLCRE5T9X"
};

// Initialize Firebase (singleton pattern to prevent multiple initializations)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Analytics only works in browser
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
}

export { app, auth, db, storage, analytics };
export default app;
