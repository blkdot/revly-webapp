import React, { useState, useEffect } from 'react';
import { MdOutlineDangerous } from 'react-icons/md';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import Dates from '../../components/dates/Dates';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import PlatformSelector from '../../components/platformSelector/PlatformSelector';

import ModalKit from '../../kits/modal/ModalKit';
import StepperKit from '../../kits/stepper/StepperKit';
import StepKit from '../../kits/step/StepKit';
import StepLabelKit from '../../kits/stepLabel/StepLabel';
import ButtonKit from '../../kits/button/ButtonKit';
import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';
import SpinnerKit from '../../kits/spinner/SpinnerKit';

import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../hooks/usePlatform';
import { useAlert } from '../../hooks/useAlert';

import { platformList } from '../../data/platformList';

const steps = ['Welcome to Revly', 'Add your delivery platforms', 'Start using Revly'];

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
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultSelected);
  const [errorPlatformConnect, setErrorPlatformConnect] = useState(defaultSelected);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');

  useEffect(() => {
    if (step > 0) {
      setErrorPlatformConnect(defaultSelected);
      return;
    }

    setShowError(false);
    cleanPlatformData();
  }, [step]);

  useEffect(() => {
    setShowError(false);

    // TODO: remove error only when the selected platform is unselected
    if (currentPlatform && selectedPlatform[currentPlatform.name]) {
      setErrorPlatformConnect({ ...errorPlatformConnect, [currentPlatform.name]: false });
    }

    if (Object.values(selectedPlatform).every((v) => !v) && step !== 0) {
      setStep(0);
      setCurrentPlatform(null);
      return;
    }

    const currentPlatformInsertion = platformList.filter(
      ({ name }) => selectedPlatform[name] && !userPlatformData.platforms[name].registered,
    );

    if (!currentPlatformInsertion[0]) {
      setCurrentPlatform(null);
      return;
    }

    setCurrentPlatform(currentPlatformInsertion[0]);
  }, [JSON.stringify(userPlatformData.platforms), JSON.stringify(selectedPlatform)]);

  const handleSubmitLoginInfo = async () => {
    if (!currentPlatform) return;

    setShowError(false);
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
      triggerAlertWithMessageError(res.message);
      setShowError(true);
      return;
    }

    setErrorPlatformConnect({ ...errorPlatformConnect, [currentPlatform.name]: false });
    triggerAlertWithMessageSuccess('Registered with success !');

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [currentPlatform.name]: res },
    });

    setFormValues({ email: '', password: '' });
  };

  const handlePlatformClick = (key) => {
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
    if (step === 0) {
      return (
        <PlatformSelector
          items={platformList}
          state={selectedPlatform}
          errors={errorPlatformConnect}
          onClickItem={handlePlatformClick}
        />
      );
    }

    if (step === 1) {
      return (
        <>
          <PlatformSelector
            items={platformList}
            state={selectedPlatform}
            errors={errorPlatformConnect}
            onClickItem={handlePlatformClick}
            platforms={userPlatformData.platforms}
            noText
          />
          {returnFormOrder()}
        </>
      );
    }

    return 'New content';
  };

  const renderErrorNotif = () => {
    if (!showError && !isLoading) return null;

    return (
      <div style={{ width: '20rem', display: 'flex' }}>
        <i>
          <MdOutlineDangerous style={{ fontSize: '60px', color: 'red' }} />
        </i>
        <span style={{ color: 'red' }}>
          We couldn’t connect to your deliveroo account. Please double check your credentials or
          contact customer support
        </span>
      </div>
    );
  };

  const isNextDisabled = () => {
    switch (step) {
      case 0:
        return Object.values(selectedPlatform).every((v) => !v);

      case 1:
        return !Object.keys(selectedPlatform).reduce((acc, cur) => {
          if (!selectedPlatform[cur]) return acc;

          return userPlatformData.platforms[cur].registered;
        }, true);

      default:
        return true;
    }
  };

  const renderSendButton = () => {
    if (step !== 1) return null;

    return (
      <ButtonLoadingKit
        variant="contained"
        onClick={handleSubmitLoginInfo}
        loading={isLoading}
        disabled={!isNextDisabled() || !currentPlatform}
        fullWidth>
        Link
      </ButtonLoadingKit>
    );
  };

  const isBackDisabled = () => step === 0 || step === 2;

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

  return (
    <div className="onboarding">
      <RestaurantDropdown names={[]} />
      <Dates />
      <FinanceEmpty />
      <MarketingEmpty />
      <ModalKit open aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div style={style}>
          <StepperKit activeStep={step} alternativeLabel>
            {steps.map((s) => (
              <StepKit key={s}>
                <StepLabelKit>{s}</StepLabelKit>
              </StepKit>
            ))}
          </StepperKit>
          {renderStepScreens()}
          <div style={{ width: '100%', padding: '0.5rem 2rem 0rem' }}>{renderSendButton()}</div>
          <div className="onboarding-actions">
            <div>
              <ButtonKit
                variant="outlined"
                color="error"
                disabled={isBackDisabled()}
                onClick={() => setStep(step - 1)}>
                Back
              </ButtonKit>
            </div>
            {renderSpinner()}
            {renderErrorNotif()}
            <div>
              <ButtonKit
                variant="outlined"
                disabled={isNextDisabled()}
                onClick={() => setStep(step + 1)}>
                Next
              </ButtonKit>
            </div>
          </div>
        </div>
      </ModalKit>
    </div>
  );
};

export default OnBoarding;
