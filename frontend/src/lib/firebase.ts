import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzXVhUaD5lx0howog1yovTd2ErR00-XE8",
  authDomain: "simpleketh-3d489.firebaseapp.com",
  projectId: "simpleketh-3d489",
  storageBucket: "simpleketh-3d489.firebasestorage.app",
  messagingSenderId: "419084719340",
  appId: "1:419084719340:web:8105353dcc89f8a88941c9",
  measurementId: "G-GRME591HHJ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
