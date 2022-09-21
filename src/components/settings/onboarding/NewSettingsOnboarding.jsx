import React, { useState, useEffect } from 'react';
import { pascalCase } from 'change-case';

import './SettingOnboarding.scss';

import PlatformSettingsBox from '../../platformSettingsBox/PlatformSettingsBox';

import ModalKit from '../../../kits/modal/ModalKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

import { useUserAuth } from '../../../contexts/AuthContext';
import { usePlatform } from '../../../hooks/usePlatform';
import { useAlert } from '../../../hooks/useAlert';
import useApi from '../../../hooks/useApi';

import { platformList } from '../../../data/platformList';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: '#ffffff',
  borderRadius: '0.4rem',
  boxShadow: 24,
  padding: '1rem',
  border: '0',
};

const NewSettingsOnboarding = () => {
  const [platformActiveModal, SetPlatformActiveModal] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { settingsOnboardPlatformStatus, settingsOnboardPlatform } = useApi();
  const { user } = useUserAuth();
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { triggerAlertWithMessageError, triggerAlertWithMessageSuccess } = useAlert();

  useEffect(() => {
    platformList.forEach(({ name }) => {
      if (
        userPlatformData.platforms[name].active_status &&
        !userPlatformData.platforms[name].registered
      ) {
        SetPlatformActiveModal(name);
        setIsOpenModal(true);
      }
    });
  }, [JSON.stringify(userPlatformData.platforms)]);

  const handleSwitchChange = (k) => async (v) => {
    const res = await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.accessToken,
        active_status: v,
      },
      k,
    );

    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [k]: res },
    });
    triggerAlertWithMessageSuccess(`State changed to ${v ? 'active' : 'inactive'}`);
  };

  const handleClick = (type) => () => {
    SetPlatformActiveModal(type);
    setIsOpenModal(true);
  };

  const handleChangeFormData = (k, v) => {
    setFormData({ ...formData, [k]: v });
  };

  const closeWithoutConnecting = async () => {
    if (userPlatformData.platforms[platformActiveModal].registered) {
      setIsOpenModal(false);
      return;
    }

    const res = await settingsOnboardPlatformStatus(
      {
        master_email: user.email,
        access_token: user.accessToken,
        active_status: false,
      },
      platformActiveModal,
    );

    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [platformActiveModal]: res },
    });
    setIsOpenModal(false);
    triggerAlertWithMessageSuccess('State changed to inactive');
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await settingsOnboardPlatform(
      {
        master_email: user.email,
        access_token: user.accessToken,
        credentials: {
          email: formData.email,
          password: formData.password,
        },
      },
      platformActiveModal,
    );

    setIsLoading(false);

    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [platformActiveModal]: res },
    });
    triggerAlertWithMessageSuccess('Registered successfully');
    setIsOpenModal(false);
  };

  const renderPlatform = () =>
    platformList.map((p) => (
      <PlatformSettingsBox
        key={p.name}
        src={p.src}
        type={p.name}
        onChangeSwitch={handleSwitchChange(p.name)}
        active={userPlatformData.platforms[p.name].active_status}
        registered={userPlatformData.platforms[p.name].registered}
        onClick={handleClick(p.name)}
      />
    ));

  return (
    <div>
      {renderPlatform()}
      <ModalKit
        open={isOpenModal}
        onClose={closeWithoutConnecting}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div style={style}>
          <div className="settings-onboarding__form">
            <span>
              Connect your {pascalCase(platformActiveModal)} account to your Revly account
            </span>
            <FormcontrolKit
              className="auth-form"
              fullWidth
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-beetween',
              }}>
              <TextfieldKit
                label="Email"
                size="small"
                onChange={(e) => handleChangeFormData('email', e.target.value)}
                className="auth-form__input"
                fullWidth
                style={{ margin: '1rem 0.5rem' }}
              />
              <TextfieldKit
                label="Password"
                type="password"
                size="small"
                onChange={(e) => handleChangeFormData('password', e.target.value)}
                className="auth-form__input"
                fullWidth
              />
            </FormcontrolKit>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <ButtonLoadingKit
                className="auth-form__input"
                variant="contained"
                disabled={!formData.email || !formData.password}
                onClick={handleSubmit}
                loading={isLoading}>
                Confirm
              </ButtonLoadingKit>
            </div>
          </div>
        </div>
      </ModalKit>
    </div>
  );
};

export default NewSettingsOnboarding;
