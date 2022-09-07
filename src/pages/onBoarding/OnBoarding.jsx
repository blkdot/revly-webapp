import React, { useState } from 'react';
import Confetti from "react-confetti";

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';
import PlatformSelector from '../../components/platformSelector/PlatformSelector';
import Congrats from '../../components/congrats/Congrats';

import ModalKit from '../../kits/modal/ModalKit';
import StepperKit from '../../kits/stepper/StepperKit';
import StepKit from '../../kits/step/StepKit';
import StepLabelKit from '../../kits/stepLabel/StepLabel';
import ButtonKit from '../../kits/button/ButtonKit';

import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import usePlatform from '../../hooks/usePlatform';
import useAlert from '../../hooks/useAlert';

import imageDeliveroo from '../../assets/images/deliveroo.png';
import imageTalabat from '../../assets/images/talabat.png';

const steps = [1, 2, 3];

const defaultSelections = [
  { src: imageDeliveroo, name: 'deliveroo' },
  { src: imageTalabat, name: 'talabat' },
];

const defaultSelected = {
  deliveroo: false,
  talabat: false,
};

const OnBoarding = () => {
  const [step, setStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultSelected);
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setPlatformToken, setIsOnboarded } = usePlatform();
  const { initLogin } = useApi();
  const { user } = useUserAuth();
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert('error');

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
    border: '0'
  };

  const handleSubmitLoginInfo = async (data) => {
    setIsLoading(true);

    const res = await initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      data,
    });

    if (res instanceof Error) {
      setAlertMessage(res.message);
      setAlertTheme('error');
      showAlert();
      setIsLoading(false);
      return;
    }

    setAlertMessage('Registered with success !');
    setAlertTheme('success');
    showAlert();
    setPlatformToken(res.response);
    setRegistered(true);
    setIsOnboarded(true);
    setIsLoading(false);
  };

  const handlePlatformClick = (key) => {
    setSelectedPlatform({ ...selectedPlatform, [key]: !selectedPlatform[key] });
  };

  const renderStepScreens = () => {
    if (step === 0) {
      return (
        <PlatformSelector
          items={defaultSelections}
          state={selectedPlatform}
          onClickItem={handlePlatformClick}
        />
      );
    }

    if (step === 1) {
      return <OnBoardingForm onSend={handleSubmitLoginInfo} activeForm={selectedPlatform} isLoading={isLoading} />;
    }

    return <Congrats />
  };

  const isNextDisabled = () => {
    if (step === 0) {
      return !selectedPlatform.deliveroo && !selectedPlatform.talabat;
    }

    if (step === 1) {
      return !registered;
    }

    return true;
  };
  
  const isBackDisabled = () => step === 0 || step === 2;

  return (
    <div className='onboarding'>
      <Confetti gravity={0.1} run={step === 2} style={{ zIndex: 1301 }} />
      <RestaurantDropdown names={[]} />
      <Dates />
      <Finance />
      <ModalKit open aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <div style={style}>
          <StepperKit activeStep={step} alternativeLabel>
            {steps.map((step) => (
              <StepKit key={step}>
                <StepLabelKit />
              </StepKit>
            ))}
          </StepperKit>
          {renderStepScreens()}
          <div className="onboarding-actions">
            <div>
              <ButtonKit variant="outlined" color="error" disabled={isBackDisabled()} onClick={() => setStep(step - 1)}>Back</ButtonKit>
            </div>
            <div>
              <ButtonKit variant="outlined" disabled={isNextDisabled()} onClick={() => setStep(step + 1)}>Next</ButtonKit>
            </div>
          </div>
        </div>
      </ModalKit>
    </div>
  );
};

export default OnBoarding;
