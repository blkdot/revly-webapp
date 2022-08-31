import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/forms/authForm/AuthForm';
import useAlert from '../../hooks/useAlert';
import firebaseCodeError from '../../data/firebaseCodeError';

const SignUp = () => {
  const [value, setValue] = useState({ email: '', password: '' });
  const { setAlertShow, setAlertMessage, renderAlert } = useAlert('error');
  const [errorData, setErrorData] = useState({ email: false, password: false });

  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(value.email, value.password);
      navigate('/onboarding');
      console.log(`${value.email} successfully registered as a new user`);
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      setAlertMessage(message)
      setAlertShow(true);
    }
  };

  const handleChange = (k) => (v) => {
    setValue({ ...value, [k]: v });
  };

  return (
    <div className='signup'>
      {renderAlert()}
      <div className="signup-cover">
        <img src="/images/cover.png" alt="cover" width={300} />
      </div>
      <Card className='card-signup' variant='outlined'>
        <h2>Sign up to your account</h2>
        <p>
          Already have an account yet? <Link to='/'> Sign in.</Link>
        </p>
        <AuthForm
          onChangeEmail={handleChange('email')}
          onChangePassword={handleChange('password')}
          errorEmail={errorData.email}
          errorPassword={errorData.password}
          onSubmit={handleSubmit}
          disabled={!value.email || !value.password}
        />
      </Card>
    </div>
  );
};

export default SignUp;
