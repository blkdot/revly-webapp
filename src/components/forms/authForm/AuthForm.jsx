import React from 'react';

import './AuthForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import ButtonKit from '../../../kits/button/ButtonKit';
import ButtonGoogleKit from '../../../kits/button/ButtonGoogleKit';

const AuthForm = (props) => {
  const {
    onChangeEmail,
    onChangePassword,
    onSubmit,
    onGoogleSubmit,
    disabled,
    errorEmail,
    errorPassword,
    isSignin,
  } = props;

  const renderGoogleButton = () => {
    if (!onGoogleSubmit) return null;

    return <ButtonGoogleKit onClick={onGoogleSubmit} className="auth-form__input __google" />;
  };

  return (
    <div>
      <FormcontrolKit className="auth-form" fullWidth>
        <TextfieldKit
          error={errorEmail}
          label="Email address"
          onChange={(e) => onChangeEmail(e.target.value)}
          className="auth-form__input"
          fullWidth
        />
        <TextfieldKit
          error={errorPassword}
          label="Password"
          type="password"
          onChange={(e) => onChangePassword(e.target.value)}
          className="auth-form__input"
          fullWidth
        />
        <ButtonKit
          variant="contained"
          onClick={onSubmit}
          className="auth-form__input"
          disabled={disabled}
          size="large">
          {isSignin ? 'Sign In' : 'Sign Up'}
        </ButtonKit>
        {renderGoogleButton()}
      </FormcontrolKit>
    </div>
  );
};

export default AuthForm;
