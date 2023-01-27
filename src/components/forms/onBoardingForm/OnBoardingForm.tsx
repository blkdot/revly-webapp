import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

import './OnBoardingForm.scss';

import ButtonLoadingKit from '../../../kits/button/ButtonLoadingKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';

const OnBoardingForm = (props: any) => {
  const {
    onChangeEmail,
    onChangePassword,
    title,
    onSubmit,
    disabled,
    isLoading,
    isError,
    valueMail,
    valuePassword,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const renderButton = () => {
    if (!onSubmit) return null;

    return (
      <ButtonLoadingKit
        className="onboarding-form__input"
        onClick={onSubmit}
        variant="contained"
        disabled={disabled}
        loading={isLoading}
      >
        Onboard
      </ButtonLoadingKit>
    );
  };

  return (
    <div className="onboarding-form">
      {title ? <h2>{title}</h2> : null}
      <FormcontrolKit className="onboarding-form" fullWidth>
        <TextfieldKit
          label="Email address"
          onChange={(e) => onChangeEmail(e.target.value)}
          className="onboarding-form__input"
          fullWidth
          value={valueMail}
          error={isError}
        />
        <TextfieldKit
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => onChangePassword(e.target.value)}
          className="onboarding-form__input"
          error={isError}
          value={valuePassword}
          fullWidth
          InputProps={{
            endAdornment: showPassword ? (
              <VisibilityOff
                onClick={() => setShowPassword(false)}
                style={{ cursor: 'pointer', color: '#919eab' }}
              />
            ) : (
              <Visibility
                onClick={() => setShowPassword(true)}
                style={{ cursor: 'pointer', color: '#919eab' }}
              />
            ),
          }}
        />
        {renderButton()}
      </FormcontrolKit>
    </div>
  );
};

export default OnBoardingForm;
