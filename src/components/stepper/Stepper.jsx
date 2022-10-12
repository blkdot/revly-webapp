import React from 'react';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import StepperKit from '../../kits/stepper/StepperKit';
import StepKit from '../../kits/step/StepKit';
import StepLabelKit from '../../kits/stepLabel/StepLabel';

import RevlyIcon from '../../assets/icons/RevlyIcon';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[500],
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[500],
  zIndex: 1,
  color: theme.palette.primary.icon,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  border: '3px solid white',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

const ColorlibStepIcon = (props) => {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      <RevlyIcon />
    </ColorlibStepIconRoot>
  );
};

const Stepper = (props) => {
  const { steps, step } = props;

  return (
    <StepperKit
      activeStep={steps.findIndex((s) => s.key === step)}
      alternativeLabel
      connector={<ColorlibConnector />}>
      {steps.map((s) => (
        <StepKit key={s.key}>
          <StepLabelKit StepIconComponent={ColorlibStepIcon}>
            <span style={{ color: '#212B36', fontSize: '12px', fontWeight: 400 }}>{s.label}</span>
          </StepLabelKit>
        </StepKit>
      ))}
    </StepperKit>
  );
};

export default Stepper;
