import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAPiAUGUeo7s_s-uYPaeC99Wkt9P4y8nNw",
  authDomain: "bulky-49e60.firebaseapp.com",
  projectId: "bulky-49e60",
  storageBucket: "bulky-49e60.appspot.com",
  messagingSenderId: "53101824871",
  appId: "1:53101824871:web:5caf5941203a00f4b53dc2",
  measurementId: "G-FXHGE8KD5H",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
