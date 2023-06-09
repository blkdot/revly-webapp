import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  ButtonKit,
  CheckboxKit,
  FormControlLabelKit,
  FormGroupKit,
  TextfieldKit,
  TypographyKit,
} from 'kits';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import './SignInForm.scss';

const SignInForm: FC<{
  email: string;
  emailError: boolean;
  setEmail: (v: string) => void;
  onEmailBlur: () => void;
  password: string;
  passwordError: boolean;
  setPassword: (v: string) => void;
  onPasswordBlur: () => void;
  remember: boolean;
  setRemember: (v: boolean) => void;
  onSubmit: (e: any) => Promise<unknown>;
  disabled: boolean;
}> = ({
  email,
  emailError,
  setEmail,
  onEmailBlur,
  password,
  passwordError,
  onPasswordBlur,
  setPassword,
  remember,
  setRemember,
  onSubmit,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='signin-form'>
      <TypographyKit className='signin-form__get-started'>
        Don&apos;t have an account?{' '}
        <Link className='__get-started__link' to='/signup'>
          Get started
        </Link>
      </TypographyKit>
      <form onSubmit={onSubmit} className='signin-form__block'>
        <div className='__block-head'>
          <TypographyKit variant='h5' className='__block-head__title'>
            Sign in to Revly
          </TypographyKit>
          <TypographyKit variant='body1' className='__block-head__sub'>
            Enter your details below
          </TypographyKit>
        </div>
        <div className='__block-field'>
          <TextfieldKit
            value={email}
            label='Email address'
            onBlur={onEmailBlur}
            required
            fullWidth
            onChange={({ target }) => setEmail(target.value)}
            error={emailError}
          />
        </div>
        <div className='__block-field'>
          <TextfieldKit
            required
            value={password}
            label='Password'
            onBlur={onPasswordBlur}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            onChange={({ target }) => setPassword(target.value)}
            error={passwordError}
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
        </div>
        <div className='__block-field-check'>
          <FormGroupKit>
            <FormControlLabelKit
              control={
                <CheckboxKit
                  value={remember}
                  onChange={({ target }) => setRemember(target.checked)}
                />
              }
              label={
                <TypographyKit variant='body2' className='__block-field-check__text'>
                  Remember me
                </TypographyKit>
              }
            />
          </FormGroupKit>
          <Link className='__block-field-check__link' to='/forgot-password'>
            Forgot Password ?
          </Link>
        </div>
        <div>
          <ButtonKit
            style={{ borderRadius: 30 }}
            fullWidth
            size='large'
            variant='contained'
            type='submit'
            disabled={disabled}
          >
            Login
          </ButtonKit>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
