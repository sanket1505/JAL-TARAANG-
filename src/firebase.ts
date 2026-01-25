import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "",
  authDomain: "jal-taraang-f1142.firebaseapp.com",
  projectId: "jal-taraang-f1142",
  storageBucket: "jal-taraang-f1142.firebasestorage.app",
  messagingSenderId: "734175425444",
  appId: "",
  measurementId: "G-5D18MRLY9B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
