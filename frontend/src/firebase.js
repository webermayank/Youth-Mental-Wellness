import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration - Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD94VmjflwXvE7oorcvV4f8ojHtI9u2Ndg",
  authDomain: "askai-health-wellness.firebaseapp.com",
  projectId: "askai-health-wellness",
  storageBucket: "askai-health-wellness.firebasestorage.app",
  messagingSenderId: "1007878258465",
  appId: "1:1007878258465:web:abd6c939c43e180e450860",
  measurementId: "G-NKWTKJC5GK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
