import React from 'react';

import './OnBoardingForm.scss';

import PaperKit from '../../../kits/paper/PaperKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

const OnBoardingForm = (props) => {
  const { onChangeEmail, onChangePassword, title, onSubmit, disabled, isLoading, isError } = props;

  const renderButton = () => {
    if (!onSubmit) return null;

    return (
      <ButtonLoadingKit
        className='auth-form__input'
        onClick={onSubmit}
        variant='contained'
        disabled={disabled}
        loading={isLoading}
      >
        Onboard
      </ButtonLoadingKit>
    );
  };

  return (
    <PaperKit className='onboarding-form'>
      {title ? <h2>{title}</h2> : null}
      <FormcontrolKit className='auth-form' fullWidth>
        <TextfieldKit
          label='Email address'
          size='small'
          onChange={(e) => onChangeEmail(e.target.value)}
          className='auth-form__input'
          fullWidth
          error={isError}
        />
        <TextfieldKit
          label='Password'
          type='password'
          size='small'
          onChange={(e) => onChangePassword(e.target.value)}
          className='auth-form__input'
          error={isError}
          fullWidth
        />
        {renderButton()}
      </FormcontrolKit>
    </PaperKit>
  );
};

export default OnBoardingForm;
