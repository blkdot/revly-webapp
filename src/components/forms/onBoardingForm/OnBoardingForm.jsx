import React from 'react';

import './OnBoardingForm.scss';

import CardKit from '../../../kits/card/CardKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';

const OnBoardingForm = (props) => {
  const { onChangeEmail, onChangePassword, title } = props;
  
  return (
    <CardKit variant='outlined' className="onboarding-form">
      <h2>{title}</h2>
      <FormcontrolKit className='auth-form' fullWidth>
        <TextfieldKit
          label='Email address'
          size="small"
          onChange={(e) => onChangeEmail(e.target.value)}
          className='auth-form__input'
          fullWidth
        />
        <TextfieldKit
          label='Password'
          type='password'
          size="small"
          onChange={(e) => onChangePassword(e.target.value)}
          className='auth-form__input'
          fullWidth
        />
      </FormcontrolKit>
    </CardKit>
  );
};

export default OnBoardingForm;
