// src/config/firebase.js
// Firebase Web SDK initialization for Google Auth
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDF1todZN9YEgUHqPVK4EozO_jSh2Xj89M",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "dailydose-b5bd3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dailydose-b5bd3",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "dailydose-b5bd3.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1051830351927",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:1051830351927:web:b850757f3c80c16fa2e7b2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-20ZS5MBDYM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
