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
} from 'firebase/auth';
import { auth } from '../firebase-config';

const UserAuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('User: ', currentUser);
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const reAuth = (password) => {
    const credentials = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credentials);
  };

  const reCaptcha = (container, callback) => {
    window.reCaptchaVerifier = new RecaptchaVerifier(container, {
      size: 'invisible',
      callback
    });

  }

  const phoneNumberVerify = async (phone) => {
    const applicationVerifier = new RecaptchaVerifier('recaptcha', {
      size: 'invisible'
    }).verify()
    console.log(applicationVerifier);
    // const provider = new PhoneAuthProvider(auth)
    // const verificationId = await provider.verifyPhoneNumber(phone, applicationVerifier);
    // const code = window.prompt('Enter the code :');
    // const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
    return ''
  }

  const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <UserAuthContext.Provider value={{ user, signUp, signIn, logOut, googleSignIn, reAuth, phoneNumberVerify, reCaptcha }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
