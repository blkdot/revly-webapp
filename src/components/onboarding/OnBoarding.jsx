import React, { useState } from 'react';
import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';
import ButtonKit from '../../kits/button/ButtonKit';

const defaultValue = {
  email: '',
  password: '',
};

const OnBoarding = ({ onSubmit }) => {
  const [deliverooValue, setDeliverooValue] = useState(defaultValue);
  const [talabatValue, setTalabatValue] = useState(defaultValue);
  const [zomatoValue, setZomatoValue] = useState(defaultValue);

  const handleChangeDeliveroo = (k) => (v) => {
    setDeliverooValue({ ...deliverooValue, [k]: v });
  };

  const handleChangeTalabat = (k) => (v) => {
    setTalabatValue({ ...talabatValue, [k]: v });
  };

  const handleChangeZomato = (k) => (v) => {
    setZomatoValue({ ...zomatoValue, [k]: v });
  };

  const handleSubmitLoginInfo = () => {
    const data = [
      { platform: 'deliveroo', ...deliverooValue },
      { platform: 'talabat', ...talabatValue },
      { platform: 'zomato', ...zomatoValue },
    ].filter((el) => el.email && el.password);

    onSubmit(data);
  };

  return (
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
      <div className='onboarding__submit'>
        <ButtonKit variant='contained' onClick={handleSubmitLoginInfo}>
          Submit
        </ButtonKit>
      </div>
    </div>
  );
};

export default OnBoarding;
