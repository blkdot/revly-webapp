import * as React from 'react';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import './MarketingSetupStepper.scss';

const MarketingSetupStepper = ({ steps, selected }) => (
  <Stack sx={{ width: '100%' }} spacing={4}>
    <Stepper className="marketing-stepper" activeStep={selected}>
      {steps.map((label) => (
        <Step key={label} />
      ))}
    </Stepper>
  </Stack>
);

export default MarketingSetupStepper;
