/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { FcHighPriority, FcCheckmark } from 'react-icons/fc';

import './SettingOnboarding.scss';

import OnBoardingForm from '../../forms/onBoardingForm/OnBoardingForm';

import ButtonKit from '../../../kits/button/ButtonKit';
import PaperKit from '../../../kits/paper/PaperKit';

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
  }, []);

  const renderImage = (src, alt) => (
    <img src={src} alt={alt} width={100} height={50} style={{ objectFit: 'contain', margin: 'auto' }} />
  );

  const renderIcon = (isOnboarded) => {
    if (!isOnboarded) return <FcHighPriority className='settings-onboarding__state-icon' />;

    return <FcCheckmark className='settings-onboarding__state-icon' />;
  };

  const handleChangeValues = (p, k) => (v) => {
    setValues({ ...values, [p]: { ...values[p], [k]: v, isError: false, isOnboarded: false } });
  };

  const handleClickEdit = (p) => () => {
    setValues({ ...values, [p]: { ...values[p], isOnboarded: false } });
    setPlatformOnboarded(platformOnboarded.filter((v) => v !== p));
  };

  const handleSubmit = (p) => async () => {
    setValues({ ...values, [p]: { ...values[p], isLoading: true } });

    const res = await initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      data: [
        {
          platform: p,
          email: values[p].email,
          password: values[p].password,
        },
      ],
    });

    if (res instanceof Error) {
      setValues({ ...values, [p]: { ...values[p], isLoading: false, isError: true } });
      setPlatformOnboarded(platformOnboarded.filter((v) => v !== p));
      return;
    }

    setValues({ ...values, [p]: { ...values[p], isLoading: false, isOnboarded: true } });
  };

  const isDisabled = (p) => {
    if (!values[p].email || !values[p].password) return true;

    return values[p].isOnboarded;
  };

  const renderEditor = (l) => (
    <PaperKit className='settings-onboarding__block' elevation={3}>
      {renderImage(l.src, l.name)}
      <ButtonKit variant='text' onClick={handleClickEdit(l.name)}>Edit</ButtonKit>
    </PaperKit>
  );

  const renderForms = () =>
    listPlatform.map((l) => (
      <div className='settings-onboarding__item' key={l.name}>
        {renderIcon(values[l.name].isOnboarded)}
        {values[l.name].isOnboarded ? renderEditor(l) : (
          <OnBoardingForm
            onChangeEmail={handleChangeValues(l.name, 'email')}
            onChangePassword={handleChangeValues(l.name, 'password')}
            title={renderImage(l.src, l.name)}
            disabled={isDisabled(l.name)}
            onSubmit={handleSubmit(l.name)}
            error={values[l.name].isError}
            isLoading={values[l.name].isLoading}
          />
        )}
      </div>
    ));

  return <div className='settings-onboarding'>{renderForms()}</div>;
};

export default SettingsOnboarding;
