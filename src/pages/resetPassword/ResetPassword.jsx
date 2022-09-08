import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './ResetPassword.scss';

import ResetPasswordForm from '../../components/forms/resetPasswordForm/ResetPasswordForm';

import CardKit from '../../kits/card/CardKit';

import useAlert from '../../hooks/useAlert';

// TODO: password restriction and validation will be implemented with the firebase response like the signin and signup page
const ResetPassword = () => {
  const [data, setData] = useState({ password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
  const navigate = useNavigate();

  const handleChange = (k) => (v) => setData({ ...data, [k]: v });

  const isDisabled = () => {
    if (!data.password || !data.confirm) return true;

    return data.password !== data.confirm;
  };

  const handleSubmit = () => {
    setIsLoading(true);
    console.log('Change password => ', JSON.stringify(data));

    // TODO: link to the API here, this is an API call simulation
    setTimeout(() => {
      setIsLoading(false);
      setAlertTheme('success');
      showAlert();
      setAlertMessage('Password changed successfully !');
      navigate('/');
    }, 3000);
  };

  return (
    <div className='reset-password'>
      <div className='reset-password-cover'>
        <img src='/images/cover.png' alt='cover' width={300} />
      </div>
      <CardKit variant='outlined' className='card-reset-password'>
        <h2>Provide your new password</h2>
        <ResetPasswordForm
          onChange={handleChange('password')}
          onChangeConfirm={handleChange('confirm')}
          onSubmit={handleSubmit}
          disabled={isDisabled()}
          isLoading={isLoading}
          errorConfirm={data.password !== data.confirm}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to='/'>Go back</Link>
        </div>
      </CardKit>
    </div>
  );
};

export default ResetPassword;
