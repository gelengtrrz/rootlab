import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-J5F_wMzY82YjX49VCX5MakNgczuuuUQ",
  authDomain: "rootlab-art.firebaseapp.com",
  projectId: "rootlab-art",
  storageBucket: "rootlab-art.firebasestorage.app",
  messagingSenderId: "940580079926",
  appId: "1:940580079926:web:2b7c4a27c61dada5f98b97",
  measurementId: "G-H8ZRXLQJTB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
