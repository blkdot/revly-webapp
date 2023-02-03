/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useUserAuth } from 'contexts';
import { useAlert } from 'hooks/useAlert';
import useApi from 'hooks/useApi';
import ConnectAccount from './onboardingModal/ConnectAccount';
import ConnectPlatform from './onboardingModal/ConnectPlatform';
import ManageAccount from './onboardingModal/ManageAccount';
import ManageBranch from './onboardingModal/ManageBranch';
import UploadingActive from './onboardingModal/UploadingActive';
import UploadingCompleted from './onboardingModal/UploadingCompleted';

const OnboardingModal = ({ propsVariables }) => {
  const {
    openCloseModal,
    openedModal,
    connectAccount,
    setBranchDataUploading,
    connect,
    setConnectAccount,
    accounts,
    setAccounts,
  } = propsVariables;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { settingsOnboardPlatform, settingsSave, settingsOnboardPlatformStatus } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert();

  const handleSubmitLogin = async (currentPlatform) => {
    setIsLoading(true);
    const res = await settingsOnboardPlatform(
      {
        master_email: user.email,
        access_token: user.accessToken,
        credentials: {
          email,
          password,
        },
      },
      currentPlatform
    );
    setIsLoading(false);
    if (res instanceof Error) {
      triggerAlertWithMessageError(
        `We couldn’t connect to your ${currentPlatform} account. Please double check your credentials or contact customer support`
      );
      return;
    }
    setConnectAccount('active');
    setBranchDataUploading(
      res.vendors.map((obj) => ({
        branch_name: { title: obj.vendor_name, address: '' },
        accounts: [email],
        linked_platforms: [{ platform: connect, status: 'active' }],
        branch_status: 'active',
        id: obj.vendor_id,
      }))
    );
  };
  const deleteAccount = async (platform, clickedEmail) => {
    await settingsSave({
      master_email: user.email,
      platform,
      email: clickedEmail,
      data: { is_deleted: true },
    });
    if (accounts.length === 1) {
      await settingsOnboardPlatformStatus(
        {
          master_email: user.email,
          access_token: user.accessToken,
          email: clickedEmail,
          active_status: false,
        },
        platform
      );
    }
    accounts.splice(
      accounts.findIndex((obj) => obj.email === clickedEmail),
      1
    );
    setAccounts([...accounts]);
  };
  const connectAccountModalObject = {
    manageAccount: <ManageAccount propsVariables={{ ...propsVariables, deleteAccount }} />,
    manageBranch: <ManageBranch propsVariables={propsVariables} />,
    completed: <UploadingCompleted propsVariables={propsVariables} />,
    active: (
      <UploadingActive
        propsVariables={{ ...propsVariables, email, setEmail, setPassword, password }}
      />
    ),
    platform: (
      <ConnectPlatform
        propsVariables={{
          ...propsVariables,
          email,
          setEmail,
          setPassword,
          password,
          handleSubmitLogin,
          isLoading,
        }}
      />
    ),
    account: <ConnectAccount propsVariables={{ ...propsVariables, deleteAccount }} />,
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
