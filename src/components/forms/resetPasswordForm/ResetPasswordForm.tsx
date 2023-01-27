import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

import './ResetPasswordForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';

const ResetPasswordForm = (props: any) => {
  const {
    onChangeNewPassword,
    errorNewPassword,
    errorConfirmPassword,
    onChangeConfirmPassword,
    onBlur,
  } = props;

  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });

  const handleShow = (field, state) => {
    setShowPassword({ ...showPassword, [field]: state });
  };

  const endAdornment = (field) =>
    showPassword[field] ? (
      <VisibilityOff
        onClick={() => handleShow(field, false)}
        style={{ cursor: 'pointer', color: '#919eab' }}
      />
    ) : (
      <Visibility
        onClick={() => handleShow(field, true)}
        style={{ cursor: 'pointer', color: '#919eab' }}
      />
    );

  return (
    <div className='reset-password-form'>
      <TextfieldKit
        label='New Password'
        type={showPassword.new ? 'text' : 'password'}
        fullWidth
        onBlur={() => onBlur('new')}
        className='__input'
        onChange={({ target }) => onChangeNewPassword(target.value)}
        error={errorNewPassword}
        InputProps={{
          endAdornment: endAdornment('new'),
        }}
      />
      <TextfieldKit
        label='Confirm Password'
        type={showPassword.confirm ? 'text' : 'password'}
        fullWidth
        onBlur={() => onBlur('confirm')}
        onChange={({ target }) => onChangeConfirmPassword(target.value)}
        error={errorConfirmPassword}
        className='__input'
        InputProps={{
          endAdornment: endAdornment('confirm'),
        }}
      />
    </div>
  );
};

export default ResetPasswordForm;
