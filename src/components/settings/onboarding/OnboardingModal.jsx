import React from 'react';
import ConnectAccount from './onboardingModal/ConnectAccount';
import ConnectPlatform from './onboardingModal/ConnectPlatform';
import ManageBranch from './onboardingModal/ManageBranch';
import UploadingActive from './onboardingModal/UploadingActive';
import UploadingCompleted from './onboardingModal/UploadingCompleted';

const OnboardingModal = ({ propsVariables }) => {
  const { openCloseModal, openedModal, uploading, connect, manageBranch } = propsVariables;
  const connectAccountModal = () => {
    if (manageBranch) {
      return <ManageBranch propsVariables={propsVariables} />;
    }
    if (uploading.completed) {
      return <UploadingCompleted propsVariables={propsVariables} />;
    }
    if (uploading.active && connect) {
      return <UploadingActive propsVariables={propsVariables} />;
    }
    if (connect) {
      return <ConnectPlatform propsVariables={propsVariables} />;
    }
    return <ConnectAccount propsVariables={propsVariables} />;
  };
  return (
    <div
      tabIndex={-1}
      role="presentation"
      className={`onboarding-modal_overlay ${openedModal ? 'active' : ''}`}
      onClick={openCloseModal}
    >
      {connectAccountModal()}
    </div>
  );
};

export default OnboardingModal;
