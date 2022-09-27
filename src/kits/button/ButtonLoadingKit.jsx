import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

const ButtonLoadingKit = (props) => (
  <LoadingButton
    sx={{ borderRadius: '8px', boxShadow: '0px 8px 16px rgba(43, 0, 171, 0.24)' }}
    {...props}
  />
);

export default ButtonLoadingKit;
