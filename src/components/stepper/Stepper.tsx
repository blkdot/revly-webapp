import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { StepKit, StepLabelKit, StepperKit } from 'kits';
import icrevly from '../../assets/images/small-logo-white.png';

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

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }: any) => ({
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

const ColorlibStepIcon = (props: any) => {
  const { active, completed, className } = props;

  return (
    // TODO: FIX IT
    // <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
    <ColorlibStepIconRoot className={className}>
      <img width={16} height={20} src={icrevly} alt='revly' />
    </ColorlibStepIconRoot>
  );
};

const Stepper = (props: any) => {
  const { steps, step } = props;

  return (
    <StepperKit
      activeStep={steps.findIndex((s) => s.key === step)}
      alternativeLabel
      connector={<ColorlibConnector />}
    >
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
