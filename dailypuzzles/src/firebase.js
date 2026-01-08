// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOv_zQjZj2dVcspyN60_gDhbfkM1E-PjY",
  authDomain: "daily-puzzles-99187.firebaseapp.com",
  projectId: "daily-puzzles-99187",
  storageBucket: "daily-puzzles-99187.firebasestorage.app",
  messagingSenderId: "313572776388",
  appId: "1:313572776388:web:16a594e699bc792fc52c91"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
