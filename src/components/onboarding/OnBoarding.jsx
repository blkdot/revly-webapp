import React, { useState, useEffect } from 'react';

import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';

import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';

const defaultValue = {
  email: '',
  password: '',
};

const OnBoarding = ({ onSend, platform, isLoading }) => {
  const [formValue, setFormValue] = useState(defaultValue);

  useEffect(() => {
    setFormValue(defaultValue);
  }, [platform.name]);

  const handleChange = (k) => (v) => {
    setFormValue({ ...formValue, [k]: v });
  };

  const handleSubmitLoginInfo = () => {
    onSend(formValue, platform.name);
  };

  const renderForm = () => (
    <div className="onboarding__form-card">
      <OnBoardingForm
        onChangeEmail={handleChange('email')}
        onChangePassword={handleChange('password')}
        valueMail={formValue.email}
        valuePassword={formValue.password}
        title={
          <img
            src={platform.src}
            alt={platform.name}
            width={100}
            style={{ objectFit: 'contain' }}
          />
        }
      />
    </div>
  );

  const isDisabledSend = () => !formValue.email || !formValue.password;

  return (
    <div className="onboarding__form">
      {renderForm()}
      <div className="onboarding__submit">
        <ButtonLoadingKit
          variant="contained"
          onClick={handleSubmitLoginInfo}
          loading={isLoading}
          disabled={isDisabledSend()}>
          Send
        </ButtonLoadingKit>
      </div>
    </div>
  );
};

export default OnBoarding;
