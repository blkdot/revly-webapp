import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import './MarketingSetupStepper.scss';

const MarketingSetupStepper = ({ steps, selected }) => (
  <Stack sx={{ width: '100%' }} spacing={4}>
    <Stepper className='marketing-stepper' activeStep={selected}>
      {steps.map((label) => (
        <Step key={label} />
      ))}
    </Stepper>
  </Stack>
);

export default MarketingSetupStepper;
