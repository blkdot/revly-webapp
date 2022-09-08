import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import './ForgotPassword.scss';

import ForgotPasswordForm from '../../components/forms/forgotPasswordForm/ForgotPasswordForm';

import CardKit from '../../kits/card/CardKit';

import useAlert from '../../hooks/useAlert';

import firebaseCodeError from '../../data/firebaseCodeError';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
  const navigate = useNavigate();

  const handleChange = (v) => {
    setIsError(false);
    setEmail(v);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsLoading(false);
        setAlertTheme('success');
        showAlert();
        setAlertMessage('An email was sent to your email address');
        navigate('/');
      })
      .catch((e) => {
        const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;
        setIsLoading(false);
        setAlertTheme('error');
        showAlert();
        setAlertMessage(message);
        setIsError(true);
      });
  };

  return (
    <div className='forgot-password'>
      <div className='forgot-password-cover'>
        <img src='/images/cover.png' alt='cover' width={300} />
      </div>
      <CardKit variant='outlined' className='card-forgot-password'>
        <h2>Forgot your password ?</h2>
        <p>
          Please enter the address email associated with your account, and we'll email you a link to
          reset your password.
        </p>
        <ForgotPasswordForm
          onChange={handleChange}
          onSubmit={handleSubmit}
          disabled={!email}
          isLoading={isLoading}
          error={isError}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to='/'>Go back</Link>
        </div>
      </CardKit>
    </div>
  );
};

export default ForgotPassword;
