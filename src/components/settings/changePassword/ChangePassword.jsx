import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';

import './ChangePassword.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import PaperKit from '../../../kits/paper/PaperKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';
import TypographyKit from '../../../kits/typography/TypographyKit';

import useAlert from '../../../hooks/useAlert';

import { useUserAuth } from '../../../contexts/AuthContext';

import firebaseCodeError from '../../../data/firebaseCodeError';

const defaultValues = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

const ChangePassword = () => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({ password: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const { user, reAuth } = useUserAuth();
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();

  const checkIfConfirmed = (v) => {
    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== v &&
      values.confirmPassword !== v
    ) {
      setErrors({ ...errors, confirm: true });
      return;
    }

    setErrors({ ...errors, confirm: false });
  };

  const handleChange = (k) => (e) => {
    if (k === 'password') {
      setErrors({ ...errors, password: false });
    } else {
      checkIfConfirmed(e.target.value);
    }

    setValues({ ...values, [k]: e.target.value });
  };

  const handleClickSubmit = async () => {
    setIsLoading(true);
    try {
      await reAuth(values.password);

      await updatePassword(user, values.newPassword);

      setAlertMessage('Password changed');
      setAlertTheme('success');
      showAlert();
    } catch (e) {
      setAlertTheme('error');
      if (e.code === 'auth/wrong-password') {
        setErrors({ ...errors, password: true });
      }

      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;
      setAlertMessage(message);
      showAlert();
    }
    setIsLoading(false);
  };

  const renderForm = () => {
    if (user.providerData[0].providerId === 'google.com') {
      return <TypographyKit>You are currently connected with your google account.</TypographyKit>;
    }

    return (
      <>
        <div className='change-password__field'>
          <TextfieldKit
            type='password'
            error={errors.password}
            label='Old password'
            fullWidth
            onChange={handleChange('password')}
          />
        </div>
        <div className='change-password__field'>
          <TextfieldKit
            type='password'
            error={errors.confirm}
            label='New password'
            fullWidth
            onChange={handleChange('newPassword')}
          />
        </div>
        <div className='change-password__field'>
          <TextfieldKit
            type='password'
            error={errors.confirm}
            label='Confirm new password'
            fullWidth
            onChange={handleChange('confirmPassword')}
          />
        </div>
        <div className='change-password__button'>
          <ButtonLoadingKit variant='contained' loading={isLoading} onClick={handleClickSubmit}>
            Save change
          </ButtonLoadingKit>
        </div>
      </>
    );
  };

  return (
    <PaperKit className='change-password' elevation={0}>
      {renderForm()}
    </PaperKit>
  );
};

export default ChangePassword;
