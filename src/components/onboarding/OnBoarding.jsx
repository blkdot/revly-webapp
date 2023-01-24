import React from 'react';

import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';
import OnboardingPlatformDetails from '../onboardingPlatformDetails/OnboardingPlatformDetails';

const ArrowBack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12L3 12"
      stroke="#14181F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 17L3 12L8 7"
      stroke="#14181F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OnBoarding = ({ platform, formValue, setFormValue, onBack, onLogin, isLoading }) => {
  const handleChange = (k) => (v) => {
    setFormValue({ ...formValue, [k]: v });
  };

  const handleBack = () => {
    setFormValue({ email: '', password: '' });
    onBack();
  };

  const renderTitle = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleBack}
        tabIndex={0}
        onKeyDown={handleBack}
        role="button"
      >
        <ArrowBack />
        <span>Back</span>
      </div>
      <OnboardingPlatformDetails src={platform.src} name={platform.name} />
    </div>
  );

  const renderForm = () => (
    <div>
      <OnBoardingForm
        onChangeEmail={handleChange('email')}
        onChangePassword={handleChange('password')}
        valueMail={formValue.email}
        valuePassword={formValue.password}
        title={renderTitle()}
        onSubmit={onLogin}
        isLoading={isLoading}
      />
    </div>
  );

  return <div className="onboarding__form">{renderForm()}</div>;
};

export default OnBoarding;
