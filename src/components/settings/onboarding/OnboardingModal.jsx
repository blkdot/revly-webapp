/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useUserAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../hooks/useAlert';
import useApi from '../../../hooks/useApi';
import { usePlatform } from '../../../hooks/usePlatform';
import ConnectAccount from './onboardingModal/ConnectAccount';
import ConnectPlatform from './onboardingModal/ConnectPlatform';
import ManageAccount from './onboardingModal/ManageAccount';
import ManageBranch from './onboardingModal/ManageBranch';
import UploadingActive from './onboardingModal/UploadingActive';
import UploadingCompleted from './onboardingModal/UploadingCompleted';

const OnboardingModal = ({ propsVariables }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');

  const handleSubmitLogin = async (currentPlatform) => {
    // setIsLoading(true);
    const res = await settingsOnboardPlatform(
      {
        master_email: user.email,
        access_token: user.accessToken,
        credentials: {
          email,
          password,
        },
      },
      currentPlatform.name
    );

    // setIsLoading(false);
    if (res instanceof Error) {
      triggerAlertWithMessageError(
        `We couldn’t connect to your ${currentPlatform} account. Please double check your credentials or contact customer support`
      );
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [currentPlatform]: res },
    });
    setEmail('');
    setPassword('');
    triggerAlertWithMessageSuccess(`You ${currentPlatform} account has been
    linked successfully`);
  };
  const { openCloseModal, openedModal, connectAccount } = propsVariables;
  const connectAccountModalObject = {
    manageAccount: <ManageAccount propsVariables={propsVariables} />,
    manageBranch: <ManageBranch propsVariables={propsVariables} />,
    completed: <UploadingCompleted propsVariables={propsVariables} />,
    active: (
      <UploadingActive
        propsVariables={{ ...propsVariables, email, setEmail, setPassword, password }}
      />
    ),
    platform: (
      <ConnectPlatform
        propsVariables={{ ...propsVariables, email, setEmail, setPassword, password }}
      />
    ),
    account: <ConnectAccount propsVariables={propsVariables} />,
  };
  return (
    <div
      tabIndex={-1}
      role='presentation'
      className={`onboarding-modal_overlay ${openedModal ? 'active' : ''}`}
      onClick={openCloseModal}
    >
      {connectAccountModalObject[connectAccount]}
    </div>
  );
};

export default OnboardingModal;
