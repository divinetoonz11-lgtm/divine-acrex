// firebase/clientApp.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Replace the placeholders below with your Firebase project's config
 * (From Firebase Console -> Project Settings)
 */
const firebaseConfig = {
  apiKey: "REPLACE_API_KEY",
  authDomain: "REPLACE_AUTH_DOMAIN",
  projectId: "REPLACE_PROJECT_ID",
  appId: "REPLACE_APP_ID",
  // optional:
  // storageBucket: "REPLACE_STORAGE_BUCKET",
  // messagingSenderId: "REPLACE_MESSAGING_SENDER_ID"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();
