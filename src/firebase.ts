import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCeahYd3lWzUmOBSPYPUlmo4M6Mey-dtX8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vinimay-p2p-marketplace.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vinimay-p2p-marketplace",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vinimay-p2p-marketplace.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "156039209240",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:156039209240:web:026e706e28b00a6af73e6d",
};

// Initialize Firebase app singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
