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
  sendEmailVerification,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase-config';
import config from '../setup/config';

import { usePlatform } from '../hooks/usePlatform';

const UserAuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(true);
  const { clearToken } = usePlatform();

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

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logOut = () => {
    clearToken();
    return signOut(auth);
  };

  const emailVerify = () => {
    const actionCodeSettings = {
      url: `${config.frontUrl}`,
      handleCodeInApp: true,
    };

    return sendEmailVerification(user, actionCodeSettings);
  };

  const phoneNumberVerify = async (container, phone) => {
    const applicationVerifier = new RecaptchaVerifier(
      container,
      {
        size: 'invisible',
      },
      auth,
    );
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phone, applicationVerifier);
    // const code = window.prompt('Enter the code we sent you : ')
    // const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
    return Promise.resolve(verificationId);
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
        phoneNumberVerify,
        emailVerify,
        reAuthGoogle,
      }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
