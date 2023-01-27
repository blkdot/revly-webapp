import { TextField } from '@mui/material';

const TextfieldKit = (props: any) => (
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
