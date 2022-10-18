// TODO: fix linter problem
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  RecaptchaVerifier,
  PhoneAuthProvider,
  reauthenticateWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  updatePhoneNumber,
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
} from 'firebase/auth';
import { auth } from '../firebase-config';
import config from '../setup/config';

import { usePlatform } from '../hooks/usePlatform';

const UserAuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(true);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const { cleanPlatformData } = usePlatform();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // eslint-disable-next-line no-console
      console.log('User: ', currentUser);
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  const signIn = async (email, password, remember = false) => {
    await setPersistence(auth, remember ? browserSessionPersistence : browserLocalPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    cleanPlatformData();
    return signOut(auth);
  };

  const verifyEmail = (users) => {
    const actionCodeSettings = {
      url: `${config.frontUrl}`,
      handleCodeInApp: true,
    };

    return sendEmailVerification(users, actionCodeSettings);
  };

  const createRecaptcha = () => {
    const existDiv = document.getElementById('recaptcha');

    if (existDiv) {
      existDiv.remove();
    }

    const div = document.createElement('div');
    div.id = 'recaptcha';
    div.style.display = 'none';
    document.body.appendChild(div);

    window.applicationVerifier = new RecaptchaVerifier(
      'recaptcha',
      {
        size: 'invisible',
      },
      auth,
    );
  };

  const verifyResetCode = (actionCode) => verifyPasswordResetCode(auth, actionCode);

  const verifyCodeEmail = (actionCode) => applyActionCode(auth, actionCode);

  const resetPassword = async (actionCode, pass) => confirmPasswordReset(auth, actionCode, pass);

  const verifyPhone = async (phone) => {
    createRecaptcha();
    const provider = new PhoneAuthProvider(auth);
    return provider.verifyPhoneNumber(phone, window.applicationVerifier);
  };

  const updatePhone = (vId, code) => {
    const phoneCredential = PhoneAuthProvider.credential(vId, code);
    return updatePhoneNumber(user, phoneCredential);
  };

  const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  const reAuthGoogle = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return reauthenticateWithPopup(user, googleAuthProvider);
  };

  const reAuth = (password) => {
    const credentials = EmailAuthProvider.credential(user.email, password);

    return reauthenticateWithCredential(user, credentials);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        logOut,
        googleSignIn,
        reAuth,
        verifyPhone,
        resetPassword,
        verifyResetCode,
        updatePhone,
        isUpdatingPhone,
        setIsUpdatingPhone,
        verifyEmail,
        verifyCodeEmail,
        reAuthGoogle,
      }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
