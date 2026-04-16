import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-OE-5Fm-k_CosC_PDT19skz8rAO7r-5k",
  authDomain: "beauty-salon11.firebaseapp.com",
  projectId: "beauty-salon11",
  storageBucket: "beauty-salon11.firebasestorage.app",
  messagingSenderId: "517398837309",
  appId: "1:517398837309:web:fe61a6096055fb3ad79254",
  measurementId: "G-ZBSJRG3LMH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
