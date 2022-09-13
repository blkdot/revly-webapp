// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB9-hXrsxyP5dLr69QlY337eFzHjKrRGYs",
  authDomain: "test-909d1.firebaseapp.com",
  projectId: "test-909d1",
  storageBucket: "test-909d1.appspot.com",
  messagingSenderId: "993001754322",
  appId: "1:993001754322:web:35ab2112345e2cc2faa70b"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);