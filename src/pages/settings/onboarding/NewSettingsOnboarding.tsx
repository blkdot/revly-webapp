/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import OnboardingStepper from '../../../components/settings/onboarding/OnboardingStepper';
import OnboardingMiddleContent from '../../../components/settings/onboarding/OnboardingMiddleContent';
import OnboardingModal from '../../../components/settings/onboarding/OnboardingModal';
import OnboardingTable from '../../../components/settings/onboarding/OnboardingTable';
import { usePlatform } from '../../../hooks/usePlatform';
import './SettingOnboarding.scss';

const NewSettingsOnboarding = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [branchData, setBranchData] = useState([]);

  const { userPlatformData } = usePlatform();
  const getAccounts = () => {
    const arr = [];
    Object.keys(userPlatformData.platforms).forEach((plat) => {
      userPlatformData.platforms[plat].forEach((obj) => arr.push({ ...obj, platform: plat }));
    });
    return arr;
  };
  const [accounts, setAccounts] = useState(getAccounts() || []);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const [clickedBranch, setClickedBranch] = useState({});

  const openCloseModal = () => {
    setOpenedModal(!openedModal);
    const clearArr = ['manageBranch', 'completed', 'manageAccount'];
    if (clearArr.find((str) => str === connectAccount)) {
      setConnectAccount('account');
    }
    const body = document.querySelector('body');
    const navbar = document.querySelector('.Navbar');
    if (!openedModal) {
      navbar.classList.add('openedModal');
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const propsVariables = {
    openCloseModal,
    setConnect,
    connect,
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
        setConnectAccount={setConnectAccount}
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
