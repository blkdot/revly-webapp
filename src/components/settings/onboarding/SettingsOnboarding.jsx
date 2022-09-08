import React, { useState } from 'react';

import OnBoardingForm from '../../forms/onBoardingForm/OnBoardingForm';

import usePlatform from '../../../hooks/usePlatform';

import imageDeliveroo from '../../../assets/images/deliveroo.png';
import imageTalabat from '../../../assets/images/talabat.png';

const defaultValue = {
  email: '',
  password: '',
};

const SettingsOnboarding = () => {
  const [deliverooValue, setDeliverooValue] = useState(defaultValue);
  const [talabatValue, setTalabatValue] = useState(defaultValue);

  const { platformOnboarded } = usePlatform();

  const handleDeliverooValueChange = (k) => (v) => setDeliverooValue({ ...deliverooValue, [k]: v });

  const handleTalabatValueChange = (k) => (v) => setTalabatValue({ ...talabatValue, [k]: v })

  const renderImage = (src, alt) => <img src={src} alt={alt} width={100} height={50} style={{ objectFit: 'contain' }} />

  return (
    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
      <div style={{ textAlign: '-webkit-center', minWidth: '20rem', margin: '0.5rem' }}>
        <OnBoardingForm onChangeEmail={handleDeliverooValueChange('email')} onChangePassword={handleDeliverooValueChange('password')} title={renderImage(imageDeliveroo, 'deliveroo')} />
      </div>
      <div style={{ textAlign: '-webkit-center', minWidth: '20rem', margin: '0.5rem' }}>
        <OnBoardingForm onChangeEmail={handleTalabatValueChange('email')} onChangePassword={handleTalabatValueChange('password')} title={renderImage(imageTalabat, 'talabat')} />
      </div>
    </div>
  );
};

export default SettingsOnboarding;
