/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { usePlatform } from '../../../hooks/usePlatform';
import useApi from '../../../hooks/useApi';
import { useUserAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../hooks/useAlert';
import OnboardingStepper from '../../../components/settings/onboarding/OnboardingStepper';
import OnboardingMiddleContent from '../../../components/settings/onboarding/OnboardingMiddleContent';
import { platformList } from '../../../data/platformList';
import OnboardingModal from '../../../components/settings/onboarding/OnboardingModal';
import OnboardingTable from '../../../components/settings/onboarding/OnboardingTable';

const NewSettingsOnboarding = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const [clickedBranch, setClickedBranch] = useState({});
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');

  const openCloseModal = () => {
    setOpenedModal(!openedModal);
    if (connectAccount === 'manageBranch') {
      setConnectAccount('account');
    }
    const body = document.querySelector('body');
    if (!openedModal) {
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
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
      currentPlatform.name,
    );

    // setIsLoading(false);
    if (res instanceof Error) {
      triggerAlertWithMessageError(
        `We couldn’t connect to your ${currentPlatform} account. Please double check your credentials or contact customer support`,
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
  const propsVariables = {
    openCloseModal,
    setConnect,
    connect,
    setEmail,
    email,
    setPassword,
    password,
    setAccounts,
    accounts,
    setBranchData,
    branchData,
    setBranchDataUploading,
    branchDataUploading,
    setActiveStep,
    activeStep,
    openedModal,
    clickedBranch,
    connectAccount,
    setConnectAccount,
  };
  return (
    <div>
      <OnboardingModal propsVariables={propsVariables} />
      <OnboardingStepper
        activeStep={activeStep}
        accounts={accounts}
        openCloseModal={openCloseModal}
      />
      <OnboardingMiddleContent
        branchData={branchData}
        openCloseModal={openCloseModal}
        accounts={accounts}
      />
      <OnboardingTable
        branchData={branchData}
        openCloseModal={openCloseModal}
        setClickedBranch={setClickedBranch}
        setConnectAccount={setConnectAccount}
      />
    </div>
  );
};

export default NewSettingsOnboarding;
