import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';

import './SignIn.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/forms/authForm/AuthForm';

const SignIn = () => {
  const [value, setValue] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const { signIn, googleSignIn } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(value.email, value.password);
      navigate('/account');
      console.log(`${value.email} successfully signed in`);
    } catch (e) {
      console.log(e.message);
      console.log(e.code);
    }
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate('/account');
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleChange = (k) => (v) => {
    setValue({ ...value, [k]: v });
  };

  return (
    <div className="signin">
      <Card variant="outlined" className="card-signin">
        <h2>Sign in to your account</h2>
        <p>
          Don't have an account yet? <Link to='/signup'> Sign up.</Link>
        </p>
        <AuthForm
          onChangeEmail={handleChange('email')}
          onChangePassword={handleChange('password')}
          onSubmit={handleSubmit}
          onGoogleSubmit={handleGoogleSubmit}
          disabled={!value.email || !value.password}
        />
      </Card>
    </div>
  );
};

export default SignIn;
