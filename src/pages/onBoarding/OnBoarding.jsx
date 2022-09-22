import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdHelpOutline } from 'react-icons/md';

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
import HighOrderBlock from '../../components/highOrderBlock/HighOrderBlock';

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
  const [successPlatformConnect, setSuccessPlatformConnect] = useState(defaultSelected);
  const [isLoading, setIsLoading] = useState(false);

  const { userPlatformData, setUserPlatformData } = usePlatform();
  const { settingsOnboardPlatform } = useApi();
  const { user, logOut } = useUserAuth();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');
  const navigate = useNavigate();

  useEffect(() => {
    if (step > 0) {
      setErrorPlatformConnect(defaultSelected);
      return;
    }

    setErrorPlatformConnect(defaultSelected);
  }, [step]);

  useEffect(() => {
    setFormValues({ email: '', password: '' });

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

      if (isAllSelected()) setStep(2);

      return;
    }

    setCurrentPlatform(currentPlatformInsertion[0]);
    if (step === 2 && isAllSelected()) setStep(1);
  }, [JSON.stringify(userPlatformData.platforms), JSON.stringify(selectedPlatform)]);

  const isAllSelected = () => Object.values(selectedPlatform).every((v) => v);

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

    setErrorPlatformConnect({ ...errorPlatformConnect, [currentPlatform.name]: false });
    setSuccessPlatformConnect({ ...successPlatformConnect, [currentPlatform.name]: true });
    triggerAlertWithMessageSuccess(`You ${currentPlatform.name} account has been
    linked successfully`);

    setUserPlatformData({
      ...userPlatformData,
      platforms: { ...userPlatformData.platforms, [currentPlatform.name]: res },
      onboarded: true,
    });

    setFormValues({ email: '', password: '' });
  };

  const handlePlatformClick = (key) => {
    if (userPlatformData.platforms[key].registered) return;

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
          success={successPlatformConnect}
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
          onClickItem={handlePlatformClick}
          platforms={userPlatformData.platforms}
          noText
        />
        <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
          All your accounts have been linked successfully!
        </p>
        <div style={{ margin: '1.2rem 2rem 0.6rem' }}>
          <ButtonKit variant="contained" fullWidth onClick={handleClickStart}>
            Start using Revly
          </ButtonKit>
        </div>
      </>
    );
  };

  const isNextDisabled = () => {
    switch (step) {
      case 0:
        return !Object.values(selectedPlatform).some((v) => v);

      case 1:
        return !Object.values(successPlatformConnect).some((v) => v);

      default:
        return true;
    }
  };

  const renderNext = () => {
    if (step === steps.length - 1) return null;

    return (
      <div>
        <ButtonKit variant="outlined" disabled={isNextDisabled()} onClick={() => setStep(step + 1)}>
          Next
        </ButtonKit>
      </div>
    );
  };

  const renderSendButton = () => {
    if (step !== 1 || !currentPlatform) return null;

    return (
      <ButtonLoadingKit
        variant="contained"
        onClick={handleSubmitLoginInfo}
        loading={isLoading}
        disabled={!currentPlatform || !formValues.email || !formValues.password}
        fullWidth>
        Link
      </ButtonLoadingKit>
    );
  };

  const isBackDisabled = () => step === 0;

  const handleClickStart = () => navigate('/dashboard');

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

  const backTarget = () => {
    if (step === 2 && isAllSelected()) {
      setStep(0);
      return;
    }

    setStep(step - 1);
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
                onClick={backTarget}>
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
          <MdHelpOutline style={{ fontSize: '30px' }} />
        </HighOrderBlock>
      </div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={handleLogout}
        tabIndex={0}
        onKeyDown={handleLogout}
        role="button">
        <HighOrderBlock style={{ cursor: 'pointer' }}>
          <MdLogout style={{ fontSize: '30px' }} />
        </HighOrderBlock>
      </div>
    </div>
  );
};

export default OnBoarding;
