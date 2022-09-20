import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import './AuthForm.scss';

import TypographyKit from '../../../kits/typography/TypographyKit';
import ButtonKit from '../../../kits/button/ButtonKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';
import DividerKit from '../../../kits/divider/DividerKit';
import FormGroupKit from '../../../kits/formGroup/FormGroupKit';
import FormControlLabelKit from '../../../kits/formControlLabel/FormControlLabel';

const AuthForm = (props) => {
  const {
    onChangeEmail,
    onChangePassword,
    onSubmit,
    onGoogleSubmit,
    disabled,
    errorEmail,
    errorPassword,
    onChangeRemebered,
  } = props;

  return (
    <div className="auth-form">
      <TypographyKit className="auth-form__get-started">
        Don&apos;t have an account ?{' '}
        <Link className="__get-started__link" to="/signup">
          Get started
        </Link>
      </TypographyKit>
      <div className="auth-form__block">
        <div className="__block-head">
          <TypographyKit variant="h5" className="__block-head__title">
            Sign in to Revly
          </TypographyKit>
          <TypographyKit variant="body2" className="__block-head__sub">
            Enter your details below
          </TypographyKit>
        </div>
        <div className="__block-google">
          <ButtonKit
            variant="outlined"
            size="medium"
            className="__block-google__button"
            onClick={onGoogleSubmit}>
            <FcGoogle className="__block-google__icon" />
          </ButtonKit>
        </div>
        <DividerKit className="__block-divider">
          <TypographyKit variant="body2" className="__block-divider__text">
            OR
          </TypographyKit>
        </DividerKit>
        <div className="__block-field">
          <TextfieldKit
            label="Email address"
            size="small"
            fullWidth
            onChange={({ target }) => onChangeEmail(target.value)}
            error={errorEmail}
          />
        </div>
        <div className="__block-field">
          <TextfieldKit
            type="password"
            label="Password"
            size="small"
            fullWidth
            onChange={({ target }) => onChangePassword(target.value)}
            error={errorPassword}
          />
        </div>
        <div className="__block-field-check">
          <FormGroupKit>
            <FormControlLabelKit
              control={
                <CheckboxKit
                  onChange={({ target }) => onChangeRemebered(target.checked)}
                  defaultChecked
                />
              }
              label={<TypographyKit variant="body2">Remember me</TypographyKit>}
            />
          </FormGroupKit>
          <Link className="__block-field-check__link" to="/forgot-password">
            Forgot Password ?
          </Link>
        </div>
        <div>
          <ButtonKit fullWidth variant="contained" onClick={onSubmit} disabled={disabled}>
            Login
          </ButtonKit>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
