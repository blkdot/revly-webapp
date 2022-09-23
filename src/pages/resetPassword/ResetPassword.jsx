import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './ResetPassword.scss';

import ResetPasswordForm from '../../components/forms/resetPasswordForm/ResetPasswordForm';

import ButtonLoadingKit from '../../kits/button/ButtonLoadingKit';
import SpinnerKit from '../../kits/spinner/SpinnerKit';

import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const ResetPassword = () => {
  const { resetPassword, verifyResetCode } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ new: '', confirm: '' });
  const [error, setError] = useState({ new: false, confirm: false });
  const [valid, setIsValid] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');

  const verifyActionCode = () => {
    verifyResetCode(params.get('oobCode'))
      .then(() => setIsValid(true))
      .catch(() => navigate('/'));
  };

  useEffect(() => verifyActionCode(), [valid]);

  const handleChange = (k) => (v) => {
    setError({ ...error, [k]: false });
    if (k === 'confirm' && v !== values.new) {
      setError({ ...error, [k]: true });
    }
    setValues({ ...values, [k]: v });
  };

  const onBlur = (field) => {
    if (!values[field]) {
      setError({ ...error, [field]: true });
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const code = params.get('oobCode');
      await resetPassword(code, values.confirm);
      navigate('/');
      triggerAlertWithMessageSuccess('Password successfully reset');
    } catch (err) {
      setLoading(false);
      triggerAlertWithMessageError(err.code);
    }
  };

  if (!valid) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return (
    <div className="reset-password">
      <p className="__title">Reset your password</p>
      <div className="__form">
        <ResetPasswordForm
          onChangeNewPassword={handleChange('new')}
          onChangeConfirmPassword={handleChange('confirm')}
          errorNewPassword={error.new}
          onBlur={onBlur}
          errorConfirmPassword={error.confirm}
        />
      </div>
      <div className="__btn-change">
        <ButtonLoadingKit
          disabled={!values.new || !values.confirm || values.new !== values.confirm}
          fullWidth
          loading={loading}
          onClick={handleReset}
          variant="contained">
          Change Password
        </ButtonLoadingKit>
      </div>
    </div>
  );
};

export default ResetPassword;
