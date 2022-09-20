import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './SignIn.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import SigninForm from '../../components/forms/signinForm/SigninForm';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';

const SignIn = () => {
  const [value, setValue] = useState({ email: '', password: '', remembered: true });
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { showAlert, setAlertMessage } = useAlert();
  const [errorData, setErrorData] = useState({ email: false, password: false });

  const navigate = useNavigate();

  const { signIn, googleSignIn, user } = useUserAuth();

  useEffect(() => {
    if (user) {
      navigate('/check');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      await signIn(value.email, value.password, value.remembered);
      navigate('/check');
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      setAlertMessage(message);
      showAlert();
      setProcessing(false);
    }
  };

  const handleGoogleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      await googleSignIn();
      navigate('/check');
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      setAlertMessage(message);
      showAlert();
      setProcessing(false);
    }
  };

  const handleChange = (k) => (v) => {
    setValue({ ...value, [k]: v });
  };

  const handleChangeRemembered = (v) => {
    setValue({ ...value, remembered: v });
  };

  return (
    <SigninForm
      onChangeEmail={handleChange('email')}
      onChangePassword={handleChange('password')}
      onChangeRemebered={handleChangeRemembered}
      errorEmail={errorData.email}
      errorPassword={errorData.password}
      onSubmit={handleSubmit}
      onGoogleSubmit={handleGoogleSubmit}
      disabled={!value.email || !value.password || processing}
    />
  );
};

export default SignIn;
