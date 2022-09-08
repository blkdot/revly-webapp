import React from 'react';

import './ResetPasswordForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

const ResetPasswordForm = (props) => {
  const { onChange, onChangeConfirm, onSubmit, disabled, error, errorConfirm, isLoading } = props;

  return (
    <FormcontrolKit className='reset-password-form' fullWidth>
      <TextfieldKit
        type='password'
        error={error}
        label='New password'
        onChange={(e) => onChange(e.target.value)}
        className='reset-password-form__input'
        fullWidth
      />
      <TextfieldKit
        type='password'
        error={errorConfirm}
        label='Confirm new password'
        onChange={(e) => onChangeConfirm(e.target.value)}
        className='reset-password-form__input'
        fullWidth
      />
      <ButtonLoadingKit
        variant='contained'
        onClick={onSubmit}
        className='reset-password-form__input'
        disabled={disabled}
        size='large'
        loading={isLoading}
      >
        Change Password
      </ButtonLoadingKit>
    </FormcontrolKit>
  );
};

export default ResetPasswordForm;
