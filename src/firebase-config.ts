/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  applyActionCode,
  browserLocalPersistence,
  browserSessionPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  RecaptchaVerifier,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePhoneNumber,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyB9-hXrsxyP5dLr69QlY337eFzHjKrRGYs',
  authDomain: 'test-909d1.firebaseapp.com',
  projectId: 'test-909d1',
  storageBucket: 'test-909d1.appspot.com',
  messagingSenderId: '993001754322',
  appId: '1:993001754322:web:35ab2112345e2cc2faa70b',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signUp = async (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = async (email: string, password: string, remember: boolean) => {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => signOut(auth);

export const verifyResetCode = async (code: string) => verifyPasswordResetCode(auth, code);

export const verifyCodeEmail = async (code: string) => applyActionCode(auth, code);

export const resetPassword = async (code: string, password: string) =>
  confirmPasswordReset(auth, code, password);

export const reAuth = async (password: string) =>
  reauthenticateWithCredential(
    auth.currentUser,
    EmailAuthProvider.credential(auth.currentUser.email, password)
  );

export const updatePhone = async (vId: string, code: string) =>
  updatePhoneNumber(auth.currentUser, PhoneAuthProvider.credential(vId, code));

export const createRecaptcha = () => {
  const existDiv = document.getElementById('recaptcha');

  if (existDiv) {
    existDiv.remove();
  }

  const div = document.createElement('div');
  div.id = 'recaptcha';
  div.style.display = 'none';
  document.body.appendChild(div);

  (window as any).applicationVerifier = new RecaptchaVerifier(
    'recaptcha',
    {
      size: 'invisible',
    },
    auth
  );
};

export const verifyPhone = async (phone: string) => {
  createRecaptcha();
  return new PhoneAuthProvider(auth).verifyPhoneNumber(phone, (window as any).applicationVerifier);
};

export const reAuthGoogle = async () => {};
