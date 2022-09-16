import React from 'react';

import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';

const OnBoarding = ({ platform, formValue, setFormValue }) => {
  const handleChange = (k) => (v) => {
    setFormValue({ ...formValue, [k]: v });
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

  return <div className="onboarding__form">{renderForm()}</div>;
};

export default OnBoarding;
