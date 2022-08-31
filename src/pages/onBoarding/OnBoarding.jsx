import React, { useState } from 'react';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/forms/onBoardingForm/OnBoardingForm';
import ButtonKit from '../../kits/button/ButtonKit';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import useAccessToken from '../../hooks/useAccessToken';
import useAlert from '../../hooks/useAlert';

const defaultValue = {
  email: '',
  password: '',
};

const OnBoarding = () => {
  const [deliverooValue, setDeliverooValue] = useState(defaultValue);
  const [talabatValue, setTalabatValue] = useState(defaultValue);
  const [zomatoValue, setZomatoValue] = useState(defaultValue);
  const { setPlatformToken, setIsOnBoarded } = useAccessToken();
  const { initLogin } = useApi();
  const { user } = useUserAuth();
  const { setAlertShow, setAlertMessage, renderAlert } = useAlert('error');

  const handleChangeDeliveroo = (k) => (v) => {
    setDeliverooValue({ ...deliverooValue, [k]: v });
  };

  const handleChangeTalabat = (k) => (v) => {
    setTalabatValue({ ...talabatValue, [k]: v });
  };

  const handleChangeZomato = (k) => (v) => {
    setZomatoValue({ ...zomatoValue, [k]: v });
  };

  const handleSubmitLoginInfo = async () => {
    const res = await initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      data: [
        { platform: 'deliveroo', ...deliverooValue },
        { platform: 'talabat', ...talabatValue },
        { platform: 'zomato', ...zomatoValue },
      ].filter((el) => el.email && el.password),
    });

    if (res instanceof Error) {
      setAlertMessage(res.message);
      setAlertShow(true);
      return;
    }

    setPlatformToken(res.response);
    setIsOnBoarded(true);
  };

  return (
    <div className='onboarding'>
      {renderAlert()}
      <div className='onboarding__form'>
        <div className='onboarding__form-card'>
          <OnBoardingForm
            onChangeEmail={handleChangeDeliveroo('email')}
            onChangePassword={handleChangeDeliveroo('password')}
            title='Deliveroo'
          />
        </div>
        <div className='onboarding__form-card'>
          <OnBoardingForm
            onChangeEmail={handleChangeTalabat('email')}
            onChangePassword={handleChangeTalabat('password')}
            title='Talabat'
          />
        </div>
        <div className='onboarding__form-card'>
          <OnBoardingForm
            onChangeEmail={handleChangeZomato('email')}
            onChangePassword={handleChangeZomato('password')}
            title='Zomato'
          />
        </div>
      </div>
      <div className='onboarding__submit'>
        <ButtonKit variant='contained' onClick={handleSubmitLoginInfo}>
          Submit
        </ButtonKit>
      </div>
    </div>
  );
};

export default OnBoarding;
