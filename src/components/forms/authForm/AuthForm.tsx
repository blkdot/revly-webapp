import { ButtonKit, FormControlKit, TextfieldKit } from 'kits';
import { Link } from 'react-router-dom';
import './AuthForm.scss';

const AuthForm = (props: any) => {
  const {
    onChangeEmail,
    onChangePassword,
    onSubmit,
    disabled,
    errorEmail,
    errorPassword,
    isSignin,
    onRemember,
  } = props;

  return (
    <div>
      <FormControlKit className='auth-form' fullWidth>
        <TextfieldKit
          error={errorEmail}
          label='Email address'
          onChange={(e) => onChangeEmail(e.target.value)}
          className='auth-form__input'
          fullWidth
        />
        <TextfieldKit
          error={errorPassword}
          label='Password'
          type='password'
          onChange={(e) => onChangePassword(e.target.value)}
          className='auth-form__input'
          fullWidth
        />
        <div className='auth-form__text'>
          <div>
            <input type='checkbox' onChange={(e) => onRemember(e.target.checked)} />
            &nbsp; &nbsp; Remember me
          </div>
          <Link to='/forgot-password'>Forgot password?</Link>
        </div>
        <ButtonKit
          variant='contained'
          onClick={onSubmit}
          className='auth-form__input'
          disabled={disabled}
          size='large'
        >
          {isSignin ? 'Sign In' : 'Sign Up'}
        </ButtonKit>
        <div className='auth-form__or'>
          <hr />
          <p>OR</p>
          <hr />
        </div>
      </FormControlKit>
    </div>
  );
};

export default AuthForm;
