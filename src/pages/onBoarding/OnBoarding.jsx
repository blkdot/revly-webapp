import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import './OnBoarding.scss';

import OnBoardingForm from '../../components/onboarding/OnBoarding';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';

import BoxKit from '../../kits/box/BoxKit';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import usePlatform from '../../hooks/usePlatform';
import useAlert from '../../hooks/useAlert';

const steps = ['Greetings', 'Select delivery platform', 'Start your adventure'];

const OnBoarding = () => {
  
  const navigate = useNavigate();
  const { setPlatformToken } = usePlatform();
  const { initLogin } = useApi();
  const { user } = useUserAuth();
  const { showAlert, setAlertMessage } = useAlert('error');

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
  };

  const handleSubmitLoginInfo = async (data) => {
    const res = await initLogin({
      master_email: user.email,
      access_token: user.accessToken,
      data
    });

    if (res instanceof Error) {
      setAlertMessage(res.message);
      showAlert();
      return;
    }

    setPlatformToken(res.response);
    navigate('/dashboard');
  };

  return (
    <div className='onboarding'>
      <RestaurantDropdown names={[]} />
      <Dates />
      <Finance />
      <Modal open aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <BoxKit style={style}>
          <Stepper activeStep={0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <OnBoardingForm onSubmit={handleSubmitLoginInfo} />
        </BoxKit>
      </Modal>
    </div>
  );
};

export default OnBoarding;
