// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZl352dwzkYp28fHoqD8FysZU0ILYsKqM",
  authDomain: "gameder-c9a9e.firebaseapp.com",
  projectId: "gameder-c9a9e",
  storageBucket: "gameder-c9a9e.appspot.com",
  messagingSenderId: "223363107368",
  appId: "1:223363107368:web:4d8c1c1bd52ee50810031d",
  measurementId: "G-99YX5G2NCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }