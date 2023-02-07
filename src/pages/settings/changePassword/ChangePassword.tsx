import { useUserAuth } from 'contexts';
import { updatePassword } from 'firebase/auth';
import { useAlert } from 'hooks';
import { ButtonLoadingKit, TextfieldKit } from 'kits';
import { useState } from 'react';
import { firebaseCodeError } from '../../../data/firebaseCodeError';
import './ChangePassword.scss';

const defaultValues = {
  password: '',

  newPassword: '',

  confirmPassword: '',
};

const ChangePassword = () => {
  const [values, setValues] = useState(defaultValues);

  const [errors, setErrors] = useState({ password: false, confirm: false });

  const [isLoading, setIsLoading] = useState(false);

  const { user, reAuth, reAuthGoogle } = useUserAuth();

  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();

  const checkIfConfirmed = (v) => {
    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== v &&
      values.confirmPassword !== v
    ) {
      setErrors({ ...errors, confirm: true });

      return;
    }

    setErrors({ ...errors, confirm: false });
  };

  const handleChange = (k) => (e) => {
    if (k === 'password') {
      setErrors({ ...errors, password: false });
    } else {
      checkIfConfirmed(e.target.value);
    }

    setValues({ ...values, [k]: e.target.value });
  };

  const isOnlyGoogle = () => !user.providerData.some((v) => v.providerId === 'password');

  const handleClickSubmit = async () => {
    setIsLoading(true);

    try {
      if (isOnlyGoogle()) {
        await reAuthGoogle();
      } else {
        await reAuth(values.password);
      }

      await updatePassword(user, values.newPassword);

      setValues(defaultValues);

      setAlertMessage('Password changed');

      setAlertTheme('success');

      showAlert();
    } catch (e) {
      setAlertTheme('error');

      if (e.code === 'auth/wrong-password') {
        setErrors({ ...errors, password: true });
      }

      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      setAlertMessage(message);

      showAlert();
    }

    setIsLoading(false);
  };

  const renderForm = () => (
    <>
      {!isOnlyGoogle() && (
        <div className='change-password__field'>
          <TextfieldKit
            type='password'
            value={values.password}
            error={errors.password}
            label='Old password'
            fullWidth
            onChange={handleChange('password')}
          />
        </div>
      )}

      <div className='change-password__field'>
        <TextfieldKit
          type='password'
          value={values.confirmPassword}
          error={errors.confirm}
          label='Confirm new password'
          fullWidth
          onChange={handleChange('confirmPassword')}
        />
      </div>

      <div className='change-password__button'>
        <ButtonLoadingKit variant='contained' loading={isLoading} onClick={handleClickSubmit}>
          Save
        </ButtonLoadingKit>
      </div>
    </>
  );

  return (
    <div className='change-password'>
      <p className='__title'>Type your current password to change it</p>
      {renderForm()}
    </div>
  );
};

export default ChangePassword;
