import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; // or getDatabase for Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyDRMvfKpcSy0VygZpjjoHHuAEgZjjIRo6E",
    authDomain: "ecommersep1.firebaseapp.com",
    projectId: "ecommersep1",
    storageBucket: "ecommersep1.firebasestorage.app",
    messagingSenderId: "1033846373548",
    appId: "1:1033846373548:web:40cd22778dbda788c47309",
    measurementId: "G-R2V7848689"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app); // Use getDatabase(app) for Realtime Database