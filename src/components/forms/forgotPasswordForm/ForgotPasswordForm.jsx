import React from 'react';

import './ForgotPasswordForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

const ForgotPasswordForm = (props) => {
  const { onChange, onSubmit, disabled, error, isLoading } = props;

  return (
    <FormcontrolKit className="forgot-password-form" fullWidth>
      <TextfieldKit
        error={error}
        label="Email address"
        onChange={(e) => onChange(e.target.value)}
        className="forgot-password-form__input"
        fullWidth
      />
      <ButtonLoadingKit
        variant="contained"
        onClick={onSubmit}
        className="forgot-password-form__input"
        disabled={disabled}
        size="large"
        loading={isLoading}
      >
        Send Email
      </ButtonLoadingKit>
    </FormcontrolKit>
  );
};

export default ForgotPasswordForm;
