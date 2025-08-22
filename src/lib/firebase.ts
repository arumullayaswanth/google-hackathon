// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: ""
};

// Initialize Firebase safely
const app = !getApps().length && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : getApps().length > 0 ? getApp() : null;

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const storage = app ? getStorage(app) : null;
const googleProvider = app ? new GoogleAuthProvider() : null;


// Enable offline persistence only on the client and if db is initialized
if (db && typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db)
          .then(() => {
            console.log("Firebase offline persistence enabled.");
          })
          .catch((err) => {
            if (err.code == 'failed-precondition') {
              console.warn("Firebase persistence failed: multiple tabs open.");
            } else if (err.code == 'unimplemented') {
              console.log("Firebase persistence is not available in this browser.");
            }
          });
      } catch(e) {
          console.error("Error enabling persistence", e);
      }
}


export { db, auth, storage, googleProvider };
