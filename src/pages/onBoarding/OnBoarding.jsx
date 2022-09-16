import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import Dates from '../../components/dates/Dates';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import PlatformSelector from '../../components/platformSelector/PlatformSelector';
import Congrats from '../../components/congrats/Congrats';

import ModalKit from '../../kits/modal/ModalKit';
import StepperKit from '../../kits/stepper/StepperKit';
import StepKit from '../../kits/step/StepKit';
import StepLabelKit from '../../kits/stepLabel/StepLabel';
import ButtonKit from '../../kits/button/ButtonKit';
import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';

import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../hooks/usePlatform';
import { useAlert } from '../../hooks/useAlert';

import { platformList } from '../../data/platformList';

const steps = ['Welcome to Revly', 'Connect to the delivery platforms', 'Congratulation'];

const defaultSelected = platformList.reduce((acc, cur) => ({ ...acc, [cur.name]: false }), {});

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

const OnBoarding = () => {
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultSelected);
  const [isLoading, setIsLoading] = useState(false);
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');

  useEffect(() => {
    if (step > 0) return;

    cleanPlatformData();
  }, [step]);

  useEffect(() => {
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
      triggerAlertWithMessageError(res.message);
      return;
    }

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
            onClickItem={() => null}
            platforms={userPlatformData.platforms}
            noText
          />
          {returnFormOrder()}
        </>
      );
    }

    return <Congrats />;
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
        disabled={!isNextDisabled() || !currentPlatform}>
        Send
      </ButtonLoadingKit>
    );
  };

  const isBackDisabled = () => step === 0 || step === 2;

  return (
    <div className="onboarding">
      <Confetti gravity={0.1} run={step === 2} style={{ zIndex: 1301 }} />
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
            <div>{renderSendButton()}</div>
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
