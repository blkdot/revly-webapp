import React, { useState, useEffect } from 'react';

import PlatformSettingsBox from '../../platformSettingsBox/PlatformSettingsBox';

import ModalKit from '../../../kits/modal/ModalKit';
import PaperKit from '../../../kits/paper/PaperKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';

import { useUserAuth } from '../../../contexts/AuthContext';
import useApi from '../../../hooks/useApi';
import { usePlatform } from '../../../hooks/usePlatform';

import imageDeliveroo from '../../../assets/images/deliveroo.png';
import imageTalabat from '../../../assets/images/talabat.png';

const platformList = [
  { src: imageDeliveroo, type: 'deliveroo' },
  { src: imageTalabat, type: 'talabat' },
];

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
  const [values, setValues] = useState({
    deliveroo: { active: true, registered: true },
    talabat: { active: false, registered: false },
  });
  const [platformActiveModal, SetPlatformActiveModal] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { initLogin } = useApi();
  const { user } = useUserAuth();
  const { platformOnboarded, setPlatformOnboarded } = usePlatform();

  useEffect(() => {
    platformList.forEach(({ type }) => {
      if (values[type].active && !values[type].registered) {
        SetPlatformActiveModal(type);
        setIsOpenModal(true);
      }
    });
  }, [values.deliveroo.active, values.talabat.active]);

  useEffect(() => {
    setFormData({ email: '', password: '' });
  }, [isOpenModal]);

  const handleSwitchChange = (k) => (v) => {
    setValues({ ...values, [k]: { ...values[k], active: v } });
  };

  const handleClick = (type) => () => {
    SetPlatformActiveModal(type);
    setIsOpenModal(true);
  };

  const handleChangeFormData = (k, v) => {
    setFormData({ ...formData, [k]: v });
  };

  const closeWithoutConnecting = () => {
    setIsOpenModal(false);

    if (!values[platformActiveModal].registered) {
      setValues({
        ...values,
        [platformActiveModal]: {
          ...values[platformActiveModal],
          active: false,
        },
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await initLogin(
      {
        master_email: user.email,
        access_token: user.accessToken,
        data: [
          {
            platform: platformActiveModal,
            email: formData.email,
            password: formData.password,
          },
        ],
      },
      true,
    );

    setIsLoading(false);

    if (res instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(res);
      return;
    }

    setPlatformOnboarded([...platformOnboarded, platformActiveModal]);
  };

  const renderPlatform = () =>
    platformList.map((p) => (
      <PlatformSettingsBox
        key={p.type}
        src={p.src}
        type={p.type}
        onChangeSwitch={handleSwitchChange(p.type)}
        active={values[p.type].active}
        registered={values[p.type].registered}
        onClick={handleClick(p.type)}
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
          <PaperKit className="onboarding-form">
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
          </PaperKit>
        </div>
      </ModalKit>
    </div>
  );
};

export default NewSettingsOnboarding;
