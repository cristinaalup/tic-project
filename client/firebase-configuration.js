import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB49BUo4WMxsMkq8a0xnff0whHeGIULjbA",
  authDomain: "gestiune-angajati.firebaseapp.com",
  projectId: "gestiune-angajati",
  storageBucket: "gestiune-angajati.appspot.com",
  messagingSenderId: "698440514028",
  appId: "1:698440514028:web:affcb2d8faa0bef00d28c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };