import React from 'react';
import { TextField } from '@mui/material';

const TextfieldKit = (props) => (
  <TextField
    sx={{
      '& fieldset': { borderColor: '#919eab65', borderRadius: '8px' },
      '& label': { color: '#919eab' },
      '& input': { backgroundColor: 'white' },
    }}
    {...props}
  />
);

export default TextfieldKit;
