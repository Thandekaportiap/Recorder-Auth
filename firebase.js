// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAin7_KWg0j_9y8wuWLJYXjr-KA04-JVbo",
    authDomain: "audio-app-1822f.firebaseapp.com",
    projectId: "audio-app-1822f",
    storageBucket: "audio-app-1822f.firebasestorage.app",
    messagingSenderId: "666347620412",
    appId: "1:666347620412:web:2f118643b46a6f1efa9b39",
    measurementId: "G-1956JGPZSN"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
