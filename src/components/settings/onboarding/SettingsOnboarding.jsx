import React, { useState, useEffect } from 'react';

import { FcHighPriority, FcCheckmark } from 'react-icons/fc';

import './SettingOnboarding.scss';

import OnBoardingForm from '../../forms/onBoardingForm/OnBoardingForm';

import { useUserAuth } from '../../../contexts/AuthContext';

import usePlatform from '../../../hooks/usePlatform';
import useApi from '../../../hooks/useApi';

import imageDeliveroo from '../../../assets/images/deliveroo.png';
import imageTalabat from '../../../assets/images/talabat.png';

const defaultValue = {
  email: '',
  password: '',
  isOnboarded: false,
  isLoading: false,
  isError: false,
};

const listPlatform = [
  { name: 'deliveroo', src: imageDeliveroo },
  { name: 'talabat', src: imageTalabat },
];

const defaultStateValues = listPlatform.reduce(
  (acc, cur) => ({ ...acc, [cur.name]: defaultValue }),
  {}
);

const SettingsOnboarding = () => {
  const [values, setValues] = useState(defaultStateValues);

  const { platformOnboarded } = usePlatform();
  const { initLogin } = useApi();
  const { user } = useUserAuth();

  useEffect(() => {
    platformOnboarded.forEach((p) => {
      setValues({ ...values, [p]: { ...values[p], isOnboarded: true } });
    });
  }, [platformOnboarded, values]);

  const renderImage = (src, alt) => (
    <img src={src} alt={alt} width={100} height={50} style={{ objectFit: 'contain' }} />
  );

  const renderIcon = (isOnboarded) => {
    if (!isOnboarded) return <FcHighPriority className='settings-onboarding__state-icon' />;

    return <FcCheckmark className='settings-onboarding__state-icon' />;
  };

  const handleChangeValues = (p, k) => (v) => {
    setValues({ ...values, [p]: { ...values[p], [k]: v, isError: false, isOnboarded: false } });
  };

  const handleSubmit = (p) => async () => {
    setValues({ ...values, [p]: { ...values[p], isLoading: true } });

    const res = await initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      platform: p,
    });

    if (res instanceof Error) {
      setValues({ ...values, [p]: { ...values[p], isLoading: false, isError: true } });
      return;
    }

    setValues({ ...values, [p]: { ...values[p], isLoading: false, isOnboarded: true } });
  };

  const isDisabled = (p) => {
    if (!values[p].email || !values[p].password) return true;

    return values[p].isOnboarded;
  };

  const renderForms = () =>
    listPlatform.map((l) => (
      <div className='settings-onboarding__item' key={l.name}>
        {renderIcon(values[l.name].isOnboarded)}
        <OnBoardingForm
          onChangeEmail={handleChangeValues(l.name, 'email')}
          onChangePassword={handleChangeValues(l.name, 'password')}
          title={renderImage(l.src, l.name)}
          disabled={isDisabled(l.name)}
          onSubmit={handleSubmit(l.name)}
          error={values[l.name].isError}
          isLoading={values[l.name].isLoading}
        />
      </div>
    ));

  return <div className='settings-onboarding'>{renderForms()}</div>;
};

export default SettingsOnboarding;
