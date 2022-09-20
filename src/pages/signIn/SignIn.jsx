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
      <p className="signin__signup-text">
        Don&apos;t have an account? &nbsp; <Link to="/signup">Get Started</Link>
      </p>
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
  );
};

export default SignIn;
