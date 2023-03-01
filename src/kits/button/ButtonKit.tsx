import { Button, ButtonProps } from '@mui/material';
import { FC } from 'react';

const ButtonKit: FC<ButtonProps> = (props) => {
  const { disableElevation } = props;

  return (
    <Button
      sx={{
        borderRadius: '8px',
        fontWeight: 'bold',
        '&.MuiButton-contained': {
          boxShadow: disableElevation ? 'none' : '0px 8px 16px rgba(43, 0, 171, 0.24)',
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
};


export default ButtonKit;
