// === firebase.js ===
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYpUMPpKV8xYC1lcieDn8JNAQSElIUT8w",
  authDomain: "kaamigo-ce0e8.firebaseapp.com",
  projectId: "kaamigo-ce0e8",
  storageBucket: "kaamigo-ce0e8.firebasestorage.app", // Corrected the bucket domain
  messagingSenderId: "667370815778",
  appId: "1:667370815778:web:2b5f974f61c1cfe0e8257b",
  measurementId: "G-TLV31QBS7J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // ✅ Added
export const db = getFirestore(app);
export const storage = getStorage(app);
