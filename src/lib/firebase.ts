
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ5wvZmfYvZls9UNddXQxiEEXv5W_4AlM",
  authDomain: "askfast-jpn57.firebaseapp.com",
  projectId: "askfast-jpn57",
  storageBucket: "askfast-jpn57.appspot.com",
  messagingSenderId: "191279584933",
  appId: "1:191279584933:web:c3c1136f122617780d9f4c",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

// Enable offline persistence
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


export { db, auth, storage, googleProvider };
