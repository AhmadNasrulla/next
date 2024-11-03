// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics,isSupported } from "firebase/analytics";

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNQUZip2SDLuEaeRi6NchydQotNTuAw8o",
  authDomain: "website-18c7d.firebaseapp.com",
  projectId: "website-18c7d",
  storageBucket: "website-18c7d.appspot.com",
  messagingSenderId: "518439308844",
  appId: "1:518439308844:web:4c8944aff0d6c7be3f8b89",
  measurementId: "G-Q6GLRN11E3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, storage };