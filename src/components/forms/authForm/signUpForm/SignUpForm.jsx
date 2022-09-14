import React from 'react';

import { Link } from 'react-router-dom';

import './SignUpForm.scss';

import TextfieldKit from '../../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../../kits/button/ButtonKit';

const SignUpForm = (props) => {
  const {
    onChangeEmail,
    onChangePassword,
    onChangeFName,
    onChangeLName,
    onChangeRestoName,
    onSubmit,
    disabled,
    errorFName,
    errorLName,
    errorRestoName,
    onChangeAgree,
    errorEmail,
    errorPassword,
  } = props;

  return (
    <div className="signup-form" fullWidth>
      <div className="signup-form__flex">
        <TextfieldKit
          error={errorFName}
          label="First Name"
          onChange={(e) => onChangeFName(e.target.value)}
          className="signup-form__flex__input"
        />
        <TextfieldKit
          error={errorLName}
          label="Last Name"
          onChange={(e) => onChangeLName(e.target.value)}
          className="signup-form__flex__input"
        />
      </div>
      <TextfieldKit
        error={errorRestoName}
        label="Restaurant name"
        onChange={(e) => onChangeRestoName(e.target.value)}
        className="signup-form__input"
        fullWidth
      />
      <TextfieldKit
        error={errorEmail}
        label="Email address"
        onChange={(e) => onChangeEmail(e.target.value)}
        className="signup-form__input"
        fullWidth
      />
      <TextfieldKit
        error={errorPassword}
        label="Password"
        type="password"
        onChange={(e) => onChangePassword(e.target.value)}
        className="signup-form__input"
        fullWidth
      />
      <ButtonKit
        variant="contained"
        onClick={onSubmit}
        className="signup-form__input"
        disabled={disabled}
        size="large">
        Sign Up
      </ButtonKit>
      <div className="signup-form__check">
        <input type="checkbox" onChange={(e) => onChangeAgree(e.target.checked)} />
        &nbsp; &nbsp; I agree to the <Link to="/term-of-use">Term of Use</Link> and{' '}
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default SignUpForm;
