// Firebase Client Configuration
// This is used for client-side Firebase operations (Auth, Firestore, Storage, etc.)

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDsNH9Z8OMz2S2O4wHO-XWBOZ5UYv0Tg4",
  authDomain: "veeloo-45e00.firebaseapp.com",
  projectId: "veeloo-45e00",
  storageBucket: "veeloo-45e00.firebasestorage.app",
  messagingSenderId: "994308701230",
  appId: "1:994308701230:web:af4ea89129d489052f33bf",
  measurementId: "G-MLZV8L44L6",
  databaseURL: "https://veeloo-45e00-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase (singleton pattern to prevent multiple initializations)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let rtdb: Database;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);
}

export { app, auth, db, rtdb, storage, analytics };
export default app;
