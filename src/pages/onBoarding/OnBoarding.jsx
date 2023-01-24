/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import PlatformSelector from '../../components/platformSelector/PlatformSelector';

import ModalKit from '../../kits/modal/ModalKit';
import Stepper from '../../components/stepper/Stepper';
import RButton from '../../kits/revly/button/RButton';
import SpinnerKit from '../../kits/spinner/SpinnerKit';
import NavbarOnboarding from '../../components/navbar/NavbarOnboarding';

import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../hooks/usePlatform';
import { useAlert } from '../../hooks/useAlert';

import { platformList, platformObject } from '../../data/platformList';

const START_KEY = 'start';
const MID_KEY = 'connect';
const END_KEY = 'last';

const FlagIcon = () => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.33203 19V3"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.332 13.6867C11.5138 18.2361 7.15021 9.13734 1.33203 13.6867V2.31329C7.15021 -2.23608 11.5138 6.86266 17.332 2.31329V13.6867Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SetupIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.6486 5.71141L10.9884 1.28876C10.679 1.11013 10.2978 1.11013 9.98838 1.28876L2.32812 5.71141C2.01872 5.89004 1.82812 6.22017 1.82812 6.57744V15.4227C1.82812 15.78 2.01872 16.1101 2.32813 16.2888L9.98838 20.7114C10.2978 20.89 10.679 20.89 10.9884 20.7114L18.6486 16.2888C18.958 16.1101 19.1486 15.78 19.1486 15.4227V6.57743C19.1486 6.22017 18.958 5.89004 18.6486 5.71141Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4883 14C12.1451 14 13.4883 12.6569 13.4883 11C13.4883 9.34315 12.1451 8 10.4883 8C8.83143 8 7.48828 9.34315 7.48828 11C7.48828 12.6569 8.83143 14 10.4883 14Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StartIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.900358 18.9279L13.8317 3.38583L12.9598 2.68048C12.6512 2.42577 12.5532 2.01432 12.6512 1.60777C12.7492 1.20122 13.1116 0.941611 13.5182 0.892629L22.7171 0.0207445C22.9718 -0.0282378 23.2265 0.0697268 23.4322 0.22647C23.6379 0.378315 23.7898 0.633023 23.7898 0.892629L24.6568 10.0866C24.7058 10.4932 24.5049 10.8507 24.1474 11.0565C23.5988 11.2867 23.2804 11.0565 23.0746 10.9046L22.2175 10.2091L13.7729 20.4072C13.4251 20.8627 12.7737 20.897 12.3916 20.559L10.1335 18.6928C9.87881 19.3541 9.73186 20.0104 8.86488 20.7647C7.91952 21.3672 6.8615 22.5085 6.76844 23.013C6.47944 24.5707 4.55933 24.0662 4.72587 22.9102C4.87772 21.8424 5.7643 20.4072 7.48358 19.2806C8.33097 18.7271 8.49751 17.3409 8.49751 17.3409L6.33249 15.553L2.47269 20.2014C1.92409 20.7794 1.24813 20.51 1.04241 20.3533C0.591769 20.0006 0.542787 19.3345 0.900358 18.9279ZM16.1632 2.57272L22.4575 7.77464L21.9529 2.01432L16.1632 2.57272ZM15.3599 4.62998L13.3419 7.0693L15.9869 14.5734L20.6549 8.93552L15.3599 4.62998ZM12.8569 18.3646L14.4978 16.3759L11.8528 8.87184L7.59134 14.0199L12.8569 18.3646Z"
      fill="white"
    />
  </svg>
);

const defaultSteps = [
  { key: START_KEY, label: 'Setup your Revly', active: true, icon: FlagIcon },
  { key: MID_KEY, label: 'Connect to your Accounts', active: true, icon: SetupIcon },
  { key: END_KEY, label: 'Start your Revly', active: true, icon: StartIcon },
];

const defaultPlatforms = platformList.reduce((acc, cur) => ({ ...acc, [cur.name]: false }), {});

const style = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 878,
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: 24,
  padding: '40px 40px 50px',
  border: '0',
};

const OnBoarding = () => {
  const [step, setStep] = useState(START_KEY);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [errorPlatformConnect, setErrorPlatformConnect] = useState(defaultPlatforms);
  const [successPlatformConnect, setSuccessPlatformConnect] = useState(defaultPlatforms);
  const [isLoading, setIsLoading] = useState(false);

  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform, settingsLogin } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');
  const navigate = useNavigate();

  const isAllPLatformRegistered = () =>
    platformList.every((p) => userPlatformData.platforms[p.name].registered);

  useEffect(() => {
    if (!isAllPLatformRegistered()) return;

    setStep(END_KEY);
  }, [JSON.stringify(userPlatformData.platforms)]);

  const isOnboarded = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      const res = await settingsLogin({
        master_email: user.email,
        access_token: user.accessToken,
      });
      setIsLoading(false);
      if (res instanceof Error || !res.onboarded || !res.platforms) throw new Error('');

      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...res.platforms },
      });

      navigate('/dashboard');
    } catch (error) {
      // Do nothing
    }
  };

  useEffect(() => {
    isOnboarded();
  }, []);

  const handleSubmitLoginInfo = async () => {
    if (!currentPlatform) return;

    setIsLoading(true);

    const res = await settingsOnboardPlatform(
      {
        master_email: user.email,
        access_token: user.accessToken,
        credentials: formValues,
      },
      currentPlatform.name,
    );

    setIsLoading(false);

    if (res instanceof Error) {
      setErrorPlatformConnect({ ...errorPlatformConnect, [currentPlatform.name]: true });
      triggerAlertWithMessageError(
        `We couldn’t connect to your ${currentPlatform.name} account. Please double check your credentials or contact customer support`,
      );
      return;
    }

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [currentPlatform.name]: res },
    });
    setFormValues({ email: '', password: '' });
    setErrorPlatformConnect({ ...errorPlatformConnect, [currentPlatform.name]: false });
    setSuccessPlatformConnect({ ...successPlatformConnect, [currentPlatform.name]: true });
    triggerAlertWithMessageSuccess(`You ${currentPlatform.name} account has been
    linked successfully`);
    setCurrentPlatform(null);
  };

  const handlePlatformClick = (key) => {
    setCurrentPlatform(platformObject[key]);
    setStep(MID_KEY);
  };

  const handleBack = () => {
    setCurrentPlatform(null);
    setStep(START_KEY);
  };

  const renderStepScreens = () => {
    if (step === MID_KEY && currentPlatform && !isAllPLatformRegistered()) {
      return (
        <OnBoardingForm
          platform={currentPlatform}
          setFormValue={(v) => setFormValues(v)}
          formValue={formValues}
          onBack={handleBack}
          onLogin={handleSubmitLoginInfo}
          isLoading={isLoading}
        />
      );
    }

    return (
      <PlatformSelector
        items={platformList}
        data={userPlatformData}
        success={successPlatformConnect}
        onClickItem={handlePlatformClick}
      />
    );
  };

  const renderNext = () => {
    if (step === MID_KEY && currentPlatform) return null;

    return (
      <div style={{ width: '486px' }}>
        <RButton
          onClick={handleClickStart}
          disabled={!Object.values(successPlatformConnect).some((v) => v)}
        >
          Start your Revly
        </RButton>
      </div>
    );
  };

  const handleClickStart = async () => {
    setUserPlatformData({
      ...userPlatformData,
      onboarded: true,
    });

    navigate('/dashboard');
  };

  const renderSpinner = () => {
    if (!isLoading) return null;

    return (
      <div style={{ display: 'flex', margin: '1rem auto' }}>
        <SpinnerKit />
        <span
          style={{
            alignSelf: 'center',
            fontSize: '16px',
            color: '#4D2681',
            marginLeft: '1rem',
          }}
        >
          Connecting
        </span>
      </div>
    );
  };

  const renderText = () => {
    if (isAllPLatformRegistered())
      return (
        <div className="onboarding-platform__title">
          <div className="title__main">All your Accounts have been linked Successfully !</div>
        </div>
      );

    return (
      <div className="onboarding-platform__title">
        <div className="title__main">
          Connect to your Delevery platform Account to unleash the the Power of Revly
        </div>
        <div className="title__sub">
          Select the platform you are using and enter your data to get access
        </div>
      </div>
    );
  };

  return (
    <div className="onboarding">
      <FinanceEmpty />
      <MarketingEmpty />
      <ModalKit open aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div style={style}>
          <div style={{ marginBottom: '60px' }}>
            <Stepper step={step} steps={defaultSteps} />
          </div>
          {renderText()}
          {renderStepScreens()}
          {renderSpinner()}
          <div className="onboarding-actions">{renderNext()}</div>
        </div>
      </ModalKit>
      <NavbarOnboarding />
    </div>
  );
};

export default OnBoarding;
