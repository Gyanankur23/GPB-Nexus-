// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (replace with your own keys)
const firebaseConfig = {
  apiKey: "AIzaSyDduPnJjcl98ewwAdipYJj0p5aJEnNXiDI",
  authDomain: "gpb-nexus.firebaseapp.com",
  projectId: "gpb-nexus",
  storageBucket: "gpb-nexus.appspot.com", // <- Corrected domain
  messagingSenderId: "898488445022",
  appId: "1:898488445022:web:69ba7de890757f06896ccf",
  measurementId: "G-RFF980YRF2"
};

// Initialize Firebase only once (for Next.js hot reload compatibility)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Auth, Google Provider, Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Analytics (only in browser)
let analytics = null;
if (typeof window !== "undefined" && app.name && "measurementId" in firebaseConfig) {
  // Only import analytics in client-side
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, auth, provider, db, analytics };
