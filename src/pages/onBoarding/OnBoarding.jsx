import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { IoMdHelp } from 'react-icons/io';
import { pascalCase } from 'change-case';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import Dates from '../../components/dates/Dates';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import PlatformSelector from '../../components/platformSelector/PlatformSelector';

import ModalKit from '../../kits/modal/ModalKit';
import Stepper from '../../components/stepper/Stepper';
import ButtonKit from '../../kits/button/ButtonKit';
import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';
import SpinnerKit from '../../kits/spinner/SpinnerKit';
import HighOrderBlock from '../../components/highOrderBlock/HighOrderBlock';

import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../hooks/usePlatform';
import { useAlert } from '../../hooks/useAlert';

import { platformList } from '../../data/platformList';

const START_KEY = 'start';
const END_KEY = 'last';

const defaultSteps = [
  { key: START_KEY, label: 'Welcome to Revly', active: true },
  ...platformList.map((p) => ({ key: p.name, label: pascalCase(p.name), active: false })),
  { key: END_KEY, label: 'Start using Revly', active: true },
];

const defaultSelected = platformList.reduce((acc, cur) => ({ ...acc, [cur.name]: false }), {});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: '#ffffff',
  borderRadius: '0.4rem',
  boxShadow: 24,
  padding: '1rem',
  border: '0',
};

const OnBoarding = () => {
  const [step, setStep] = useState(START_KEY);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultSelected);
  const [errorPlatformConnect, setErrorPlatformConnect] = useState(defaultSelected);
  const [successPlatformConnect, setSuccessPlatformConnect] = useState(defaultSelected);
  const [steps, setSteps] = useState(defaultSteps);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsredirecting] = useState(false);

  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const { user, logOut } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');
  const navigate = useNavigate();

  const isAllNotSelected = () => Object.values(selectedPlatform).every((v) => !v);

  const getCurrentPlatformInsertion = () =>
    platformList.filter(
      ({ name }) => selectedPlatform[name] && !userPlatformData.platforms[name].registered,
    );

  const getActiveSteps = () => steps.filter((f) => f.active);

  const isAllNotSelectedInMiddle = () => isAllNotSelected() && step !== START_KEY;

  const getNextKeySteps = (offset = 0) => {
    if (!currentPlatform) return [END_KEY];

    const indexSteps = steps.findIndex((s) => s.key === currentPlatform.name);

    if (indexSteps < 0) return [steps[indexSteps + 1].key];

    const promise = new Promise((res) => {
      for (let index = indexSteps + offset; index < steps.length; index += 1) {
        if (steps[index].active && !successPlatformConnect[steps[index].key]) {
          res(steps[index].key);
          return;
        }
      }

      res(END_KEY);
    });

    return Promise.all([promise]);
  };

  const getPrevKeySteps = async () => {
    if (step === END_KEY) return null;

    if (!currentPlatform) return [START_KEY];
    const indexSteps = steps.findIndex((s) => s.key === currentPlatform.name);

    if (indexSteps < 0) return [steps[indexSteps - 1].key];

    const promise = new Promise((res) => {
      for (let index = indexSteps; index > steps.length; index -= 1) {
        if (steps[index].active) {
          res(steps[index].key);
          return;
        }
      }

      res(START_KEY);
    });

    return Promise.all([promise]);
  };

  const resetAll = () => {
    setStep(START_KEY);
    setSteps(defaultSteps);
    setCurrentPlatform(null);
  };

  useEffect(() => {
    setErrorPlatformConnect(defaultSelected);
  }, [step]);
  useEffect(() => {
    setFormValues({ email: '', password: '' });

    if (isAllNotSelectedInMiddle()) {
      resetAll();
      return;
    }

    const currentPlatformInsertion = getCurrentPlatformInsertion();

    if (!currentPlatformInsertion[0]) {
      setCurrentPlatform(null);
      return;
    }

    setCurrentPlatform(currentPlatformInsertion[0]);
  }, [JSON.stringify(userPlatformData.platforms), JSON.stringify(selectedPlatform)]);

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

    const nextStep = await getNextKeySteps(1);
    setStep(nextStep[0]);
  };

  const handlePlatformClick = (key) => {
    if (userPlatformData.platforms[key].registered) return;

    const indexSteps = steps.findIndex((s) => s.key === key);

    if (indexSteps > 0) {
      const oldState = steps[indexSteps].active;

      const newContent = { ...steps[indexSteps], active: !steps[indexSteps].active };

      const clonedSteps = [...steps];

      clonedSteps.splice(indexSteps, 1, newContent);

      setSteps(clonedSteps);

      if (oldState && step === key && currentPlatform && step === currentPlatform.name) {
        setStep(START_KEY);
      }
    }

    setSelectedPlatform({ ...selectedPlatform, [key]: !selectedPlatform[key] });
  };

  const returnFormOrder = () => {
    if (!currentPlatform) return null;

    return (
      <OnBoardingForm
        platform={currentPlatform}
        setFormValue={(v) => setFormValues(v)}
        formValue={formValues}
      />
    );
  };

  const renderStepScreens = () => {
    if (step === START_KEY) {
      return (
        <PlatformSelector
          items={platformList}
          state={selectedPlatform}
          errors={errorPlatformConnect}
          success={successPlatformConnect}
          onClickItem={handlePlatformClick}
        />
      );
    }

    if (step !== END_KEY) {
      return (
        <>
          <PlatformSelector
            items={platformList}
            state={selectedPlatform}
            success={successPlatformConnect}
            errors={errorPlatformConnect}
            onClickItem={handlePlatformClick}
            platforms={userPlatformData.platforms}
            noText
          />
          {returnFormOrder()}
        </>
      );
    }

    return (
      <>
        <PlatformSelector
          items={platformList}
          state={selectedPlatform}
          success={successPlatformConnect}
          errors={errorPlatformConnect}
          onClickItem={() => null}
          platforms={userPlatformData.platforms}
          noText
        />
        <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
          All your accounts have been linked successfully!
        </p>
        <div style={{ margin: '1.2rem 2rem 0.6rem' }}>
          <ButtonLoadingKit
            variant="contained"
            loading={isRedirecting}
            fullWidth
            onClick={handleClickStart}>
            Start using Revly
          </ButtonLoadingKit>
        </div>
      </>
    );
  };

  const isNextDisabled = () => {
    switch (step) {
      case START_KEY:
        return !Object.values(selectedPlatform).some((v) => v);

      case END_KEY:
        return true;

      default:
        return !Object.values(successPlatformConnect).some((v) => v);
    }
  };

  const renderNext = () => {
    if (step === END_KEY) return null;

    return (
      <div>
        <ButtonKit variant="contained" disabled={isNextDisabled()} onClick={nextTarget}>
          Next
        </ButtonKit>
      </div>
    );
  };

  const renderSendButton = () => {
    if (step === START_KEY || step === END_KEY) return null;

    return (
      <ButtonLoadingKit
        variant="contained"
        onClick={handleSubmitLoginInfo}
        loading={isLoading}
        disabled={!currentPlatform || !formValues.email || !formValues.password}
        fullWidth>
        Connect
      </ButtonLoadingKit>
    );
  };

  const isBackDisabled = () => step === START_KEY || step === END_KEY;

  const handleClickStart = async () => {
    setUserPlatformData({
      ...userPlatformData,
      onboarded: true,
    });

    setIsredirecting(true);
    await new Promise((r) => {
      setTimeout(r, 2000);
    });

    navigate('/dashboard');
  };

  const renderSpinner = () => {
    if (!isLoading) return null;

    return (
      <div style={{ display: 'flex' }}>
        <SpinnerKit />
        <span
          style={{
            alignSelf: 'center',
            fontSize: '16px',
            color: '#4D2681',
            marginLeft: '1rem',
          }}>
          Connecting
        </span>
      </div>
    );
  };

  const backTarget = async () => {
    const prevtarget = await getPrevKeySteps();

    setStep(prevtarget[0]);
  };

  const nextTarget = async () => {
    let offset = 0;

    if (errorPlatformConnect[currentPlatform.name]) {
      offset = 1;
    }

    const nexttargetR = await getNextKeySteps(offset);

    setStep(nexttargetR[0]);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  };

  return (
    <div className="onboarding">
      <div className="top-inputs">
        <RestaurantDropdown vendors={[]} />
        <Dates />
      </div>
      <FinanceEmpty />
      <MarketingEmpty />
      <ModalKit open aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div style={style}>
          <Stepper step={step} steps={getActiveSteps()} />
          {renderStepScreens()}
          <div style={{ width: '100%', padding: '0.5rem 2rem 0rem' }}>{renderSendButton()}</div>
          <div className="onboarding-actions">
            <div>
              <ButtonKit variant="contained" disabled={isBackDisabled()} onClick={backTarget}>
                Back
              </ButtonKit>
            </div>
            {renderSpinner()}
            {renderNext()}
          </div>
        </div>
      </ModalKit>
      <div style={{ cursor: 'pointer' }}>
        <HighOrderBlock color="warning" higher>
          <IoMdHelp style={{ fontSize: '20px' }} />
        </HighOrderBlock>
      </div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={handleLogout}
        tabIndex={0}
        onKeyDown={handleLogout}
        role="button">
        <HighOrderBlock style={{ cursor: 'pointer' }}>
          <MdLogout style={{ fontSize: '20px' }} />
        </HighOrderBlock>
      </div>
    </div>
  );
};

export default OnBoarding;
