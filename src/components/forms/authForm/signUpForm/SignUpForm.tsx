import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

import { Link } from 'react-router-dom';

import './SignUpForm.scss';

import ButtonKit from '../../../../kits/button/ButtonKit';
import CheckboxKit from '../../../../kits/checkbox/CheckboxKit';
import FormControlLabelKit from '../../../../kits/formControlLabel/FormControlLabel';
import FormGroupKit from '../../../../kits/formGroup/FormGroupKit';
import PhoneInputKit from '../../../../kits/phoneInput/PhoneInputKit';
import TextfieldKit from '../../../../kits/textfield/TextfieldKit';
import TypographyKit from '../../../../kits/typography/TypographyKit';

import onlyNumber from '../../../../utlls/input/onlyNumber';

const SignUpForm = (props: any) => {
  const {
    onChangeEmail,
    onChangePassword,
    onChangeFName,
    onChangeLName,
    onChangeRestoName,
    onChangePointOfSales,
    onSubmit,
    disabled,
    errorFName,
    errorLName,
    errorRestoName,
    onChangeAgree,
    errorEmail,
    errorPassword,
    onChangePhone,
    errorPointOfSale,
    onDialChange,
    onBlur,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='signup-form'>
      <TypographyKit className='signup-form__text'>Enroll in our Beta.</TypographyKit>
      <TypographyKit className='signup-form__subtext'>
        Let&apos;s increase those sales together!
      </TypographyKit>
      <div className='signup-form__form'>
        <div className='signup-form__flex'>
          <TextfieldKit
            error={errorFName}
            required
            label='First Name'
            onChange={(e) => onChangeFName(e.target.value)}
            className='signup-form__flex__input'
            onBlur={() => onBlur('fname')}
          />
          <TextfieldKit
            error={errorLName}
            label='Last Name'
            required
            onChange={(e) => onChangeLName(e.target.value)}
            className='signup-form__flex__input'
            onBlur={() => onBlur('lname')}
          />
        </div>
        <div className='signup-form__flex'>
          <TextfieldKit
            error={errorRestoName}
            required
            label='Restaurant name'
            onChange={(e) => onChangeRestoName(e.target.value)}
            className='signup-form__flex__input'
            fullWidth
            onBlur={() => onBlur('restoName')}
          />

          <TextfieldKit
            label='# of points of sale'
            required
            onChange={(e) => onChangePointOfSales(e.target.value)}
            className='signup-form__flex__input'
            onKeyDown={onlyNumber}
            fullWidth
            onBlur={() => onBlur('pointOfSale')}
            error={errorPointOfSale}
          />
        </div>
        <div className='signup-form__flex phone'>
          <PhoneInputKit
            inputProps={{ readOnly: true }}
            country='ae'
            onChange={(v, c) => onDialChange({ dialCode: c.dialCode, country: c.name })}
            specialLabel=''
            containerClass='signup-form__input-phone'
          />
          <TextfieldKit
            label='Phone number'
            onChange={(e) => onChangePhone(e.target.value)}
            className='signup-form__input'
            onKeyDown={onlyNumber}
            fullWidth
          />
        </div>
        <TextfieldKit
          error={errorEmail}
          label='Email address'
          required
          onChange={(e) => onChangeEmail(e.target.value)}
          className='signup-form__input'
          fullWidth
          onBlur={() => onBlur('email')}
        />
        <TextfieldKit
          error={errorPassword}
          label='Password'
          onBlur={() => onBlur('password')}
          required
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => onChangePassword(e.target.value)}
          className='signup-form__input'
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
        <FormGroupKit className='signup-form__check'>
          <FormControlLabelKit
            control={<CheckboxKit onChange={({ target }) => onChangeAgree(target.checked)} />}
            label={
              <TypographyKit variant='body2' className='signup-form__check__text'>
                By signing up, I agree to Revly <Link to='/term-of-use'>Term of Use</Link> and{' '}
                <Link to='/privacy-policy'>Privacy Policy</Link>.
              </TypographyKit>
            }
          />
        </FormGroupKit>
        <ButtonKit
          variant='contained'
          style={{ borderRadius: 30 }}
          onClick={onSubmit}
          className='signup-form__input'
          disabled={disabled}
          size='large'
        >
          Register
        </ButtonKit>
      </div>
    </div>
  );
};

export default SignUpForm;
