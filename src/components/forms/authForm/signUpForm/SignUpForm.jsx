import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { Link } from 'react-router-dom';

import './SignUpForm.scss';

import TextfieldKit from '../../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../../kits/button/ButtonKit';
import PhoneInputKit from '../../../../kits/phoneInput/PhoneInputKit';

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
    onChangePhone,
    onDialChange,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-form">
      <p className="signup-form__text">Enroll in our Beta.</p>
      <p className="signup-form__subtext">Let&apos;s increase those sales together!</p>
      <div className="signup-form__form">
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
        <div className="signup-form__flex">
          <TextfieldKit
            error={errorRestoName}
            label="Restaurant name"
            onChange={(e) => onChangeRestoName(e.target.value)}
            className="signup-form__flex__input"
            fullWidth
          />

          <TextfieldKit
            label="# of points of sale"
            onChange={(e) => onChangeRestoName(e.target.value)}
            className="signup-form__flex__input"
            fullWidth
          />
        </div>
        <div className="signup-form__flex phone">
          <PhoneInputKit
            inputProps={{ readOnly: true }}
            country="ae"
            onChange={(v, c) => onDialChange(c.dialCode)}
            specialLabel=""
            containerClass="signup-form__input-phone"
          />
          <TextfieldKit
            label="Phone number"
            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
            onChange={(e) => onChangePhone(e.target.value)}
            className="signup-form__input"
            fullWidth
          />
        </div>
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
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => onChangePassword(e.target.value)}
          className="signup-form__input"
          fullWidth
          InputProps={{
            endAdornment: showPassword ? (
              <VisibilityOff
                onClick={() => setShowPassword(false)}
                style={{ cursor: 'pointer', color: '#919eab' }}
              />
            ) : (
              <Visibility
                onClick={() => setShowPassword(true)}
                style={{ cursor: 'pointer', color: '#919eab' }}
              />
            ),
          }}
        />
        <div className="signup-form__check">
          <input type="checkbox" onChange={(e) => onChangeAgree(e.target.checked)} />
          &nbsp; &nbsp; By signing up, I agree to Revly <Link to="/term-of-use">
            Term of Use
          </Link>{' '}
          and <Link to="/privacy-policy">Privacy Policy</Link>.
        </div>
        <ButtonKit
          variant="contained"
          onClick={onSubmit}
          className="signup-form__input"
          disabled={disabled}
          size="large">
          Register
        </ButtonKit>
      </div>
    </div>
  );
};

export default SignUpForm;
