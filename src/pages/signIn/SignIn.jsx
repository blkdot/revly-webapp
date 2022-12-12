import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import './SignIn.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import SigninForm from '../../components/forms/signinForm/SigninForm';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';
import useDate from '../../hooks/useDate';

const SignIn = () => {
  const [value, setValue] = useState({ email: '', password: '', remembered: true });
  const [processing, setProcessing] = useState(false);
  const { triggerAlertWithMessageError, triggerAlertWithMessageSuccess } = useAlert('error');
  const [errorData, setErrorData] = useState({ email: false, password: false });
  const [params] = useSearchParams();
  const { setVendors } = useDate();

  const oobCode = params.get('oobCode');
  const mode = params.get('mode');

  useEffect(() => {
    localStorage.removeItem('vendors');
    localStorage.removeItem('date');
    localStorage.removeItem('leaveTime');
    setVendors({
      restaurants: [],
      vendorsObj: {},
      vendorsArr: [],
      display: {},
      chainObj: {},
    });
  }, []);

  const navigate = useNavigate();

  const { signIn, googleSignIn, user, logOut, verifyCodeEmail } = useUserAuth();

  const verifyEmail = async (code) => {
    try {
      await verifyCodeEmail(code);
      triggerAlertWithMessageSuccess('Email verified , you can sign in now');
      navigate('/');
    } catch (err) {
      navigate('/');
    }
  };

  useEffect(() => {
    if (oobCode) {
      logOut();
      if (mode === 'resetPassword') {
        navigate(`/reset-password?oobCode=${oobCode}`);
      } else if (mode === 'verifyEmail') {
        verifyEmail(oobCode);
      }
    } else if (user) {
      navigate('/dashboard');
    }
  }, [oobCode, mode]);

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

      navigate('/dashboard');
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
      navigate('/dashboard');
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
    setErrorData({ ...errorData, [k]: false });
    setValue({ ...value, [k]: v });
  };

  const handleChangeRemembered = (v) => {
    setValue({ ...value, remembered: v });
  };

  const onInputBlur = (field) => {
    if (!value[field]) {
      setErrorData({ ...errorData, [field]: true });
    }
  };

  return (
    <SigninForm
      onChangeEmail={handleChange('email')}
      onChangePassword={handleChange('password')}
      onChangeRemebered={handleChangeRemembered}
      errorEmail={errorData.email}
      onBlur={onInputBlur}
      errorPassword={errorData.password}
      onSubmit={handleSubmit}
      onGoogleSubmit={handleGoogleSubmit}
      disabled={!value.email || !value.password || processing}
    />
  );
};

export default SignIn;
