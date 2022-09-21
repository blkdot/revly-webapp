import React from 'react';

import './OnBoardingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

const OnBoardingForm = (props) => {
  const {
    onChangeEmail,
    onChangePassword,
    title,
    onSubmit,
    disabled,
    isLoading,
    isError,
    valueMail,
    valuePassword,
  } = props;

  const renderButton = () => {
    if (!onSubmit) return null;

    return (
      <ButtonLoadingKit
        className="onboarding-form__input"
        onClick={onSubmit}
        variant="contained"
        disabled={disabled}
        loading={isLoading}>
        Onboard
      </ButtonLoadingKit>
    );
  };

  return (
    <div className="onboarding-form">
      {title ? <h2>{title}</h2> : null}
      <FormcontrolKit className="onboarding-form" fullWidth>
        <TextfieldKit
          label="Email address"
          size="small"
          onChange={(e) => onChangeEmail(e.target.value)}
          className="onboarding-form__input"
          fullWidth
          value={valueMail}
          error={isError}
        />
        <TextfieldKit
          label="Password"
          type="password"
          size="small"
          onChange={(e) => onChangePassword(e.target.value)}
          className="onboarding-form__input"
          error={isError}
          value={valuePassword}
          fullWidth
        />
        {renderButton()}
      </FormcontrolKit>
    </div>
  );
};

export default OnBoardingForm;
