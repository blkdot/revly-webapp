import React from 'react';
import { FormControl, TextField, Button } from '@mui/material';
import GoogleButton from 'react-google-button';

import './AuthForm.scss'
const AuthForm = (props) => {
  const {
    onChangeEmail,
    onChangePassword,
    onSubmit,
    onGoogleSubmit,
    disabled,
  } = props;

  const renderGoogleButton = () => {
    if (!onGoogleSubmit) return null;

    return <GoogleButton onClick={onGoogleSubmit} className="auth-form__input __google" />;
  };

  return (
    <FormControl className="auth-form" fullWidth>
      <TextField label='Email address' onChange={(e) => onChangeEmail(e.target.value)} className="auth-form__input" fullWidth />
      <TextField label='Password' type="password" onChange={(e) => onChangePassword(e.target.value)} className="auth-form__input" fullWidth />
      <Button variant='contained' onClick={onSubmit} className="auth-form__input" disabled={disabled} size="large">
        Sign In
      </Button>
      {renderGoogleButton()}
    </FormControl>
  );
};

export default AuthForm;
