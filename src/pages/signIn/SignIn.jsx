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
  const { triggerAlertWithMessageError } = useAlert('error');
  const [errorData, setErrorData] = useState({ email: false, password: false });

  const navigate = useNavigate();

  const { signIn, googleSignIn, user, logOut } = useUserAuth();

  useEffect(() => {
    if (user) {
      navigate('/check');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      const res = await signIn(value.email, value.password, value.remembered);

      if (!res.user.emailVerified) {
        await logOut();
        setProcessing(false);
        throw new Error(
          'Email not verified, please check your email (include spam) for verification',
        );
      }

      navigate('/check');
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (firebaseCodeError[e.code] && firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      triggerAlertWithMessageError(message);
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

      triggerAlertWithMessageError(message);
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
