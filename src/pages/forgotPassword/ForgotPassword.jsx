import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './ForgotPassword.scss';

import ForgotPasswordForm from '../../components/forms/forgotPasswordForm/ForgotPasswordForm';

import CardKit from '../../kits/card/CardKit';

import useAlert from '../../hooks/useAlert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
  const navigate = useNavigate();

  const handleChange = (v) => setEmail(v);

  const handleSubmit = () => {
    setIsLoading(true);
    console.log('SEND EMAIL => ', email);

    // TODO: link to the API here, this is an API call simulation
    setTimeout(() => {
      setIsLoading(false);
      setAlertTheme('success');
      showAlert();
      setAlertMessage('An email was sent to your email address');
      navigate('/');
    }, 3000);
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
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to='/'>Go back</Link>
        </div>
      </CardKit>
    </div>
  );
};

export default ForgotPassword;
