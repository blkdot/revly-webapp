import React from 'react';
import ConnectAccount from './onboardingModal/ConnectAccount';
import ConnectPlatform from './onboardingModal/ConnectPlatform';
import ManageBranch from './onboardingModal/ManageBranch';
import UploadingActive from './onboardingModal/UploadingActive';
import UploadingCompleted from './onboardingModal/UploadingCompleted';

const OnboardingModal = ({ propsVariables }) => {
  const { openCloseModal, openedModal, connectAccount } = propsVariables;
  const connectAccountModalObject = {
    manageBranch: <ManageBranch propsVariables={propsVariables} />,
    completed: <UploadingCompleted propsVariables={propsVariables} />,
    active: <UploadingActive propsVariables={propsVariables} />,
    platform: <ConnectPlatform propsVariables={propsVariables} />,
    account: <ConnectAccount propsVariables={propsVariables} />,
  };
  return (
    <div
      tabIndex={-1}
      role="presentation"
      className={`onboarding-modal_overlay ${openedModal ? 'active' : ''}`}
      onClick={openCloseModal}
    >
      {connectAccountModalObject[connectAccount]}
    </div>
  );
};

export default OnboardingModal;
