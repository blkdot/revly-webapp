import { TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';

const TextfieldKit: FC<TextFieldProps> = (props) => (
  <TextField
    sx={{
      '& fieldset': { borderColor: '#919eab65', borderRadius: '8px' },
      '& label': { color: '#919eab' },
      '& input': { backgroundColor: 'white' },
      '& .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline': {
        border: '2px solid #FF4842',
      },
    }}
    {...props}
  />
);

export default TextfieldKit;
