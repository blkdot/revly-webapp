import React, { useState } from 'react';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/forms/onBoardingForm/OnBoardingForm';
import ButtonKit from '../../kits/button/ButtonKit';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';

const defaultValue = {
  email: '',
  password: '',
};

const OnBoarding = () => {
  const [deliveroValue, setDeliveroValue] = useState(defaultValue);
  const [talabatValue, setTalabatValue] = useState(defaultValue);
  const [zomatoValue, setZomatoValue] = useState(defaultValue);
  const { initLogin } = useApi();
  const { user } = useUserAuth();

  const handleChangeDelivero = (k) => (v) => {
    setDeliveroValue({ ...deliveroValue, [k]: v });
  };

  const handleChangeTalabat = (k) => (v) => {
    setTalabatValue({ ...talabatValue, [k]: v });
  };

  const handleChangeZomato = (k) => (v) => {
    setZomatoValue({ ...zomatoValue, [k]: v });
  };

  const handleSubmitLoginInfo = () => {
    initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      data: {
        ...(deliveroValue.email && deliveroValue.password ? { platform: 'delivero', ...deliveroValue } : {}),
        ...(talabatValue.email && talabatValue.password ? { platform: 'talabat', ...talabatValue } : {}),
        ...(zomatoValue.email && zomatoValue.password ? { platform: 'zomato', ...zomatoValue } : {}),
      }
    })
  };

  return (
    <div className="onboarding">
      <div className="onboarding__form">
        <div className="onboarding__form-card">
          <OnBoardingForm onChangeEmail={handleChangeDelivero('email')} onChangePassword={handleChangeDelivero('password')} title="Delivero" />
        </div>
        <div className="onboarding__form-card">
          <OnBoardingForm onChangeEmail={handleChangeTalabat('email')} onChangePassword={handleChangeTalabat('password')} title="Talabat" />
        </div>
        <div className="onboarding__form-card">
          <OnBoardingForm onChangeEmail={handleChangeZomato('email')} onChangePassword={handleChangeZomato('password')} title="Zomato" />
        </div>
      </div>
      <div className="onboarding__submit">
        <ButtonKit variant="contained" onClick={handleSubmitLoginInfo}>Submit</ButtonKit>
      </div>
    </div>
  );
};

export default OnBoarding;
