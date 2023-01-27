import { Button } from '@mui/material';

const ButtonKit = (props: any) => (
  <Button
    sx={{
      borderRadius: '8px',
      fontWeight: 'bold',
      '&.MuiButton-contained': {
        boxShadow: '0px 8px 16px rgba(43, 0, 171, 0.24)',
        '&:hover': {
          background: '#1F007B',
        },
        '&:disabled': {
          boxShadow: 'none',
        },
      },
    }}
    {...props}
  />
);

export default ButtonKit;
