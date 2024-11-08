import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQIoQ2t_Omxp1i4PxaGXUkZc9p21Beo4Y",
  authDomain: "scratch-conalep.firebaseapp.com",
  projectId: "scratch-conalep",
  storageBucket: "scratch-conalep.firebasestorage.app",
  messagingSenderId: "485866356503",
  appId: "1:485866356503:web:a01e7d5984edd0a9a20152",
  measurementId: "G-0F2PX4W628",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
