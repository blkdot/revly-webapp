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
  updatePhoneNumber,
} from 'firebase/auth';
import { auth } from '../firebase-config';
import config from '../setup/config';

import usePlatform from '../hooks/usePlatform';

const UserAuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(true);
  const { clearToken } = usePlatform();

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
    clearToken();
    return signOut(auth);
  };

  const emailVerify = () => {
    const  actionCodeSettings = {
      url: `${config.frontUrl}`,
      handleCodeInApp: true,
    };

    return sendEmailVerification(user, actionCodeSettings);
  }

  const createRecaptcha = () => {
    const existDiv = document.getElementById('recaptcha');

    if (existDiv) {
      existDiv.remove();
    }

    const div = document.createElement('div');
    div.id = 'recaptcha';
    div.style.display = 'none';
    document.body.appendChild(div);

    window.applicationVerifier = new RecaptchaVerifier('recaptcha', {
      size: 'invisible',
    }, auth);
  }

  const updatePhone = async (phone) => {  
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phone, window.applicationVerifier)
    const code = window.prompt('Enter the code we sent to the phone number : ')
    const phoneCredential = PhoneAuthProvider.credential(verificationId, code);

    return updatePhoneNumber(user, phoneCredential);
  }

  const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  const reAuthGoogle = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return reauthenticateWithPopup(user, googleAuthProvider);
  }

  const reAuth = (password) => {
    const credentials = EmailAuthProvider.credential(user.email, password);

    return reauthenticateWithCredential(user, credentials);
  };

  return (
    <UserAuthContext.Provider value={{ createRecaptcha, user, signUp, signIn, logOut, googleSignIn, reAuth, updatePhone, emailVerify, reAuthGoogle }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
