// utils/firebaseClient.js
// Complete, robust Firebase client helpers for Auth (Email / Google / Phone OTP) + Firestore export

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

// --- REPLACE with your config (yours already provided earlier) ---
const firebaseConfig = {
  apiKey: "AIzaSyDqZGmYIFC3TmP9JHKjiFKyq0mC9ctF0fI",
  authDomain: "divine99acres.firebaseapp.com",
  projectId: "divine99acres",
  storageBucket: "divine99acres.firebasestorage.app",
  messagingSenderId: "59931166918",
  appId: "1:59931166918:web:9ec80ad600b2b47c446fc7"
};

// Init app only once (dev fast-refresh safe)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Auth and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// --- Google popup sign-in ---
export async function signInWithGooglePopup() {
  return signInWithPopup(auth, googleProvider);
}

// --- Email/password sign-in ---
export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// --- Email/password sign-up (optional) ---
export async function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// --- Phone OTP utilities ---
// call this BEFORE sendOtpToPhone to render reCAPTCHA
export function makeRecaptcha(containerId = "recaptcha-container", size = "invisible") {
  if (typeof window === "undefined") return null;

  // if already created, return existing
  if (typeof window !== "undefined" && window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }

  const verifier = new RecaptchaVerifier(
    containerId,
    { size }, // size: "invisible" or "normal"
    auth
  );

  // store globally so multiple renders don't recreate
  if (typeof window !== "undefined") window.recaptchaVerifier = verifier;
  return verifier;
}

// send OTP to phoneNumber (format: +919876543210)
export async function sendOtpToPhone(phoneNumber, containerId = "recaptcha-container") {
  const verifier = makeRecaptcha(containerId);
  if (!verifier) throw new Error("reCAPTCHA not available in this environment");
  await verifier.render();
  return signInWithPhoneNumber(auth, phoneNumber, verifier); // returns confirmationResult
}

// --- Sign out ---
export async function logout() {
  return signOut(auth);
}

// export auth and db for any advanced usage
export { auth, db };
