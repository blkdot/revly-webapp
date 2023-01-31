/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import StepKit from '../../../kits/step/StepKit';
import StepLabelKit from '../../../kits/stepLabel/StepLabel';
import StepperKit from '../../../kits/stepper/StepperKit';
import CloseIcon from '../../../assets/images/ic_close.png';
import ButtonKit from '../../../kits/button/ButtonKit';
import CheckedIcon from '../../../assets/images/checked-settings_ic.png';
import ClockIcon from '../../../assets/images/clock-settings_ic.png';
import ShieldIcon from '../../../assets/images/shield-settings_ic.png';
import { usePlatform } from '../../../hooks/usePlatform';

const ColorlibStepIconRoot = styled('div')(({ ownerState }: any) => ({
  backgroundColor: 'rgba(145, 158, 171, 0.24);',
  zIndex: 1,
  color: '#fff',
  width: 45,
  height: 45,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    background: 'rgba(213, 200, 250, 0.3);',
  }),
  ...(ownerState.completed && {
    background: 'rgba(213, 200, 250, 0.3);',
  }),
}));

const ColorlibStepIcon = (props: any) => {
  const { active, completed, className, icon } = props;

  const icons = {
    1: CheckedIcon,
    2: ClockIcon,
    3: ShieldIcon,
  };
  const ownerProps = { ownerState: { completed, active } }
  return (
    <ColorlibStepIconRoot {...ownerProps} className={className}>
      <img width={30} height={30} src={icons[icon]} alt={icon} />
    </ColorlibStepIconRoot>
  );
};

const OnboardingStepper = ({ openCloseModal, activeStep, accounts }) => {
  const { userPlatformData } = usePlatform();
  const [active, setActive] = useState(!userPlatformData.onboarded);
  const steps = [
    {
      label: 'Connect your Accounts',
      subtitle:
        'This allows for easy access to important information and ensures that all necessary data are uploaded and stored securely.',
    },
    {
      label: 'Data Processing',
      subtitle:
        'Our team works to process all of the data that has been uploaded. This includes verifying the accuracy of the information and making sure that everything is in order before moving on to the next step. ',
    },
    {
      label: 'Unleash the Power of Revly !',
      subtitle:
        'All of the processed data is organized for easy management. This includes creating a personalized lists by brands and branches to access all of their important information on the different accounts.',
    },
  ];
  const getActiveStep = (index: any) => {
    if (Number(String(activeStep / 100)[0]) === index) {
      return activeStep >= 100 ? activeStep - 100 : activeStep;
    }
    return 0;
  };
  const getButton = (index) => {
    if (activeStep < 100 && index === 0) {
      return (
        <ButtonKit
          onClick={openCloseModal}
          className="settings-onboarding-btn connect"
          variant="contained"
        >
          Connect
        </ButtonKit>
      );
    }
    if (activeStep >= 100 && activeStep < 200 && index === 1) {
      return (
        <ButtonKit className="settings-onboarding-btn connect manage" variant="contained">
          <Link to="/settings/onboarding">Manage my branches</Link>
        </ButtonKit>
      );
    }
    return '';
  };
  useEffect(() => {
    if (activeStep >= 200 && accounts.length === 1) {
      setTimeout(() => {
        setActive(false);
      }, 5000);
    }
  }, [activeStep]);
  return (
    <div className={`settings-onboarding bg ${!active ? 'close' : ''}`}>
      <StepperKit
        className="onboarding-stepper"
        alternativeLabel
        activeStep={Number(String(activeStep / 100)[0])}
      >
        {steps.map((obj, index) => (
          <StepKit key={obj.label}>
            <StepLabelKit StepIconComponent={ColorlibStepIcon}>
              <span
                style={{ ['--activeStep' as any]: `${getActiveStep(index)}%` }}
                className={`${index !== 2 ? 'onboarding-stepper_line' : ''} ${
                  Number(String(activeStep / 100)[0]) >= index + 1 ? 'active' : ''
                }`}
              />
              <p className="__title">{`${index + 1}. ${obj.label}`}</p>
              <div className="__subtitle">{obj.subtitle}</div>
              {getButton(index)}
            </StepLabelKit>
          </StepKit>
        ))}
      </StepperKit>
      {accounts.length >= 1 && activeStep >= 100 ? (
        <img
          className="onboarding-close_icon"
          tabIndex={-1}
          role="presentation"
          src={CloseIcon}
          alt="close icon"
          onClick={() => setActive(false)}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default OnboardingStepper;
