// TODO: fix linter problem
/* eslint-disable react/jsx-no-constructed-context-values */ import {
  applyActionCode,
  browserLocalPersistence,
  browserSessionPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  RecaptchaVerifier,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePhoneNumber,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { usePlatform } from '../hooks/usePlatform';

const UserAuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState<any>(true);
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

  const createRecaptcha = () => {
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

  const verifyResetCode = (actionCode) => verifyPasswordResetCode(auth, actionCode);

  const verifyCodeEmail = (actionCode) => applyActionCode(auth, actionCode);

  const resetPassword = async (actionCode, pass) => confirmPasswordReset(auth, actionCode, pass);

  const verifyPhone = async (phone) => {
    createRecaptcha();
    const provider = new PhoneAuthProvider(auth);
    return provider.verifyPhoneNumber(phone, (window as any).applicationVerifier);
  };

  const updatePhone = (vId, code) => {
    const phoneCredential = PhoneAuthProvider.credential(vId, code);
    return updatePhoneNumber(user, phoneCredential);
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
        reAuth,
        verifyPhone,
        resetPassword,
        verifyResetCode,
        updatePhone,
        isUpdatingPhone,
        setIsUpdatingPhone,
        verifyCodeEmail,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext) as any;
