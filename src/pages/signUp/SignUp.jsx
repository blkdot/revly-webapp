import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/forms/authForm/AuthForm';

const SignUp = () => {
  const [value, setValue] = useState({ email: '', password: '' });
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(value.email, value.password);
      navigate('/account');
      console.log(`${value.email} successfully registered as a new user`);
    } catch (e) {
      console.log(e.message);
      console.log(e.code);
    }
  };

  const handleChange = (k) => (v) => {
    setValue({ ...value, [k]: v });
  };

  return (
    <div className='signup'>
      <Card className='card-signup' variant='outlined'>
        <h2>Sign up to your account</h2>
        <p>
          Already have an account yet? <Link to='/'> Sign in.</Link>
        </p>
        <AuthForm
          onChangeEmail={handleChange('email')}
          onChangePassword={handleChange('password')}
          onSubmit={handleSubmit}
          disabled={!value.email || !value.password}
        />
      </Card>
    </div>
  );
};

export default SignUp;
