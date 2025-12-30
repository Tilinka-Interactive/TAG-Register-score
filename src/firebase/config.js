// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCfpfiL6sM3TySLQEn7rnkpobugMjYSDLM",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zyn-tag.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zyn-tag",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "zyn-tag.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "912942633422",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:912942633422:web:54ad6ccec988cf758f9b9f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0HZCXMF8FV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Functions
// Especificar la región para que coincida con el despliegue
export const functions = getFunctions(app, "us-central1");

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configurar para usar el flujo de popup y evitar problemas con user agents
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
