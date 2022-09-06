import React, { useState } from 'react';

import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';

import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';

import talabatImage from '../../assets/images/talabat.png';
import deliverooImage from '../../assets/images/deliveroo.png';

const defaultValue = {
  email: '',
  password: '',
};

const OnBoarding = ({ onSend, activeForm, isLoading }) => {
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

    onSend(data);
  };

  const renderDeliverooForm = () => {
    if (!activeForm.deliveroo) return null;

    return (
      <div className='onboarding__form-card'>
        <OnBoardingForm
          onChangeEmail={handleChangeDeliveroo('email')}
          onChangePassword={handleChangeDeliveroo('password')}
          title={<img src={deliverooImage} alt="deliveroo" height="50" />}
        />
      </div>
    );
  };

  const renderTalabatForm = () => {
    if (!activeForm.talabat) return null;

    return (
      <div className='onboarding__form-card'>
        <OnBoardingForm
          onChangeEmail={handleChangeTalabat('email')}
          onChangePassword={handleChangeTalabat('password')}
          title={<img src={talabatImage} alt="talabat" width="100" />}
        />
      </div>
    );
  };

  const renderZomatoForm = () => {
    if (!activeForm.zomato) return null;

    return (
      <div className='onboarding__form-card'>
        <OnBoardingForm
          onChangeEmail={handleChangeZomato('email')}
          onChangePassword={handleChangeZomato('password')}
          title='Zomato'
        />
      </div>
    );
  };

  const isDisabledSend = () => {
    const isDeliverooValide = activeForm.deliveroo ? deliverooValue.email && deliverooValue.password : true;
    const isTalabatValide = activeForm.talabat ? talabatValue.email && talabatValue.password : true;
    const isZomatoValide = activeForm.zomato ? zomatoValue.email && zomatoValue.password : true;

    return !isDeliverooValide || !isTalabatValide || !isZomatoValide;
  };

  return (
    <div className='onboarding__form'>
      {renderDeliverooForm()}
      {renderTalabatForm()}
      {renderZomatoForm()}
      <div className='onboarding__submit'>
        <ButtonLoadingKit variant='contained' onClick={handleSubmitLoginInfo} loading={isLoading} disabled={isDisabledSend()}>
          Send
        </ButtonLoadingKit>
      </div>
    </div>
  );
};

export default OnBoarding;
