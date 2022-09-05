import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './SignIn.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/forms/authForm/AuthForm';
import useAlert from '../../hooks/useAlert';
import CardKit from '../../kits/card/CardKit';
import firebaseCodeError from '../../data/firebaseCodeError';

const SignIn = () => {
  const [value, setValue] = useState({ email: '', password: '' });
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { showAlert, setAlertMessage } = useAlert();
  const [errorData, setErrorData] = useState({ email: false, password: false });

  const navigate = useNavigate();

  const { signIn, googleSignIn } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await signIn(value.email, value.password);
      navigate('/dashboard');
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

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await googleSignIn();
      navigate('/dashboard');
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
    <div className='signin'>
      <div className="signin-cover">
        <img src="/images/cover.png" alt="cover" width={300} />
      </div>
      <CardKit variant='outlined' className='card-signin'>
        <h2>Sign in to your account</h2>
        <p>
          Don't have an account yet? <Link to='/signup'> Sign up.</Link>
        </p>
        <AuthForm
          onChangeEmail={handleChange('email')}
          onChangePassword={handleChange('password')}
          errorEmail={errorData.email}
          errorPassword={errorData.password}
          onSubmit={handleSubmit}
          onGoogleSubmit={handleGoogleSubmit}
          disabled={!value.email || !value.password || processing}
        />
      </CardKit>
    </div>
  );
};

export default SignIn;
