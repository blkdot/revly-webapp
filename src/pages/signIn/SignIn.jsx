import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './SignIn.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/forms/authForm/AuthForm';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';

const SignIn = () => {
  const [value, setValue] = useState({ email: '', password: '' });
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { showAlert, setAlertMessage } = useAlert();
  const [errorData, setErrorData] = useState({ email: false, password: false });

  const navigate = useNavigate();

  const { signIn, googleSignIn } = useUserAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      await signIn(value.email, value.password);
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

  return (
    <div className="signin">
      <div className="card-signin">
        <p className="card-signin__signin-text">
          Don&apos;t have an account yet? <Link to="/signup"> Sign up</Link>
        </p>
        <div className="card-signin__form">
          <div className="card-signin__form__logo">
            <img src="/images/cover.png" alt="cover" width="200" />
          </div>
          <h2>Sign in</h2>
          <AuthForm
            onChangeEmail={handleChange('email')}
            onChangePassword={handleChange('password')}
            errorEmail={errorData.email}
            errorPassword={errorData.password}
            onSubmit={handleSubmit}
            onGoogleSubmit={handleGoogleSubmit}
            disabled={!value.email || !value.password || processing}
            isSignin
          />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/forgot-password">Forgot password ?</Link>
          </div>
        </div>
      </div>
      <div className="signin-cover">
        <h1>Text</h1>
        <h1>Text</h1>
        <h1>Text</h1>
      </div>
    </div>
  );
};

export default SignIn;
